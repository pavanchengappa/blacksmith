import React, { useState, useMemo, useEffect } from 'react';
import { WorkoutLog, Exercise, BodyPart } from '../types';
import { ArrowUp, ArrowDown, Dumbbell, Calendar, Activity, BarChart2, Clock, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ComparisonViewProps {
    logs: WorkoutLog[];
    exercises: Exercise[];
    selectedPart: BodyPart | null;
}

type ComparisonMode = 'SESSION' | 'WEEK' | 'MONTH' | 'ALL';

export const ComparisonView: React.FC<ComparisonViewProps> = ({ logs, exercises, selectedPart }) => {
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
    const [mode, setMode] = useState<ComparisonMode>('SESSION');

    // Reset exercise selection when body part changes
    useEffect(() => {
        setSelectedExerciseId('');
    }, [selectedPart]);

    // Filtered Logs based on selection
    const relevantLogs = useMemo(() => {
        if (!selectedPart) return [];
        let filtered = logs.filter(l => l.bodyPart === selectedPart);
        if (selectedExerciseId) {
            filtered = filtered.filter(l => l.exerciseId === selectedExerciseId);
        }
        return filtered.sort((a, b) => b.timestamp - a.timestamp); // Ensure desc sort
    }, [logs, selectedPart, selectedExerciseId]);

    // Helper: Calculate metrics for a list of logs (Sum Volume, Max Weight)
    const calculateMetrics = (sessionLogs: WorkoutLog[]) => {
        const totalVolume = sessionLogs.reduce((acc, log) => acc + log.sets.reduce((s, set) => s + (set.weight * set.reps), 0), 0);
        const maxWeight = Math.max(...sessionLogs.flatMap(l => l.sets.map(s => s.weight)), 0);
        return { totalVolume, maxWeight };
    };

    // Derived Data for Comparison
    const comparisonData = useMemo(() => {
        if (!selectedPart || relevantLogs.length === 0) return null;

        let currentMetrics = { totalVolume: 0, maxWeight: 0, label: '' };
        let prevMetrics = { totalVolume: 0, maxWeight: 0, label: '' };
        let hasData = false;

        if (mode === 'SESSION') {
            // Group by Date
            const uniqueDates = Array.from(new Set(relevantLogs.map(l => l.date.split('T')[0])));
            if (uniqueDates.length >= 2) {
                const currentDate = uniqueDates[0];
                const prevDate = uniqueDates[1];

                const currentLogs = relevantLogs.filter(l => l.date.startsWith(currentDate));
                const prevLogs = relevantLogs.filter(l => l.date.startsWith(prevDate));

                currentMetrics = { ...calculateMetrics(currentLogs), label: `Latest (${new Date(currentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})` };
                prevMetrics = { ...calculateMetrics(prevLogs), label: `Prev (${new Date(prevDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})` };
                hasData = true;
            }
        } else if (mode === 'WEEK') {
            // Group by ISO Week (Simple approx: start of week)
            const getWeekKey = (d: Date) => {
                const date = new Date(d.getTime());
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
                const week1 = new Date(date.getFullYear(), 0, 4);
                const week = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
                return `${date.getFullYear()}-W${week}`;
            };

            const groupedByWeek: Record<string, WorkoutLog[]> = {};
            relevantLogs.forEach(l => {
                const key = getWeekKey(new Date(l.date));
                if (!groupedByWeek[key]) groupedByWeek[key] = [];
                groupedByWeek[key].push(l);
            });

            const sortedWeeks = Object.keys(groupedByWeek).sort().reverse();
            if (sortedWeeks.length >= 2) {
                const currentKey = sortedWeeks[0];
                const prevKey = sortedWeeks[1];

                currentMetrics = { ...calculateMetrics(groupedByWeek[currentKey]), label: 'This Week' };
                prevMetrics = { ...calculateMetrics(groupedByWeek[prevKey]), label: 'Last Week' };
                hasData = true;
            }
        } else if (mode === 'MONTH') {
            // Group by Month
            const groupedByMonth: Record<string, WorkoutLog[]> = {};
            relevantLogs.forEach(l => {
                const key = l.date.substring(0, 7); // YYYY-MM
                if (!groupedByMonth[key]) groupedByMonth[key] = [];
                groupedByMonth[key].push(l);
            });

            const sortedMonths = Object.keys(groupedByMonth).sort().reverse();
            if (sortedMonths.length >= 2) {
                const currentKey = sortedMonths[0];
                const prevKey = sortedMonths[1];

                currentMetrics = { ...calculateMetrics(groupedByMonth[currentKey]), label: 'This Month' };
                prevMetrics = { ...calculateMetrics(groupedByMonth[prevKey]), label: 'Last Month' };
                hasData = true;
            }
        } else if (mode === 'ALL') {
            // Latest Session vs Average of ALL Previous Sessions
            const uniqueDates = Array.from(new Set(relevantLogs.map(l => l.date.split('T')[0])));
            if (uniqueDates.length >= 2) {
                const currentDate = uniqueDates[0];
                const currentLogs = relevantLogs.filter(l => l.date.startsWith(currentDate));

                // All previous logs
                const prevLogs = relevantLogs.filter(l => !l.date.startsWith(currentDate));
                const prevDates = uniqueDates.slice(1);

                // Calculate metrics for EACH previous session to get a true average
                let totalVolSum = 0;
                let maxWeightMax = 0; // Or average max weight? Usually "Average Max" is better than "Max of Max" for baseline. Let's do Average Max Weight.
                let maxWeightSum = 0;

                prevDates.forEach(d => {
                    const sessionLogs = prevLogs.filter(l => l.date.startsWith(d));
                    const m = calculateMetrics(sessionLogs);
                    totalVolSum += m.totalVolume;
                    maxWeightSum += m.maxWeight;
                    maxWeightMax = Math.max(maxWeightMax, m.maxWeight);
                });

                const avgVol = totalVolSum / prevDates.length;
                const avgMaxWeight = maxWeightSum / prevDates.length;

                currentMetrics = { ...calculateMetrics(currentLogs), label: 'Latest Session' };
                prevMetrics = { totalVolume: avgVol, maxWeight: avgMaxWeight, label: 'All-Time Avg' };
                hasData = true;
            }
        }

        return { current: currentMetrics, previous: prevMetrics, hasData };
    }, [relevantLogs, selectedPart, mode]);

    // Render Logic
    if (!selectedPart) {
        return (
            <div className="bg-surface rounded-3xl p-6 border border-zinc-800 shadow-xl overflow-hidden flex flex-col items-center justify-center text-center min-h-[200px]">
                <div className="bg-zinc-900 p-4 rounded-full mb-3">
                    <BarChart2 size={32} className="text-zinc-600" />
                </div>
                <h3 className="text-lg font-black text-white italic tracking-tighter mb-1">COMPARISON VIEW</h3>
                <p className="text-sm text-muted">Select a muscle group to view insights.</p>
            </div>
        );
    }

    const renderContent = () => {
        if (!comparisonData || !comparisonData.hasData) {
            return (
                <div className="text-center py-12 text-muted border-2 border-dashed border-zinc-800 rounded-3xl bg-surface/50">
                    <p className="font-bold">Not enough data</p>
                    <p className="text-xs mt-1">Need more history for {mode.toLowerCase()} comparison.</p>
                </div>
            );
        }

        const { current, previous } = comparisonData;

        const getDelta = (curr: number, prev: number) => {
            const diff = curr - prev;
            const percent = prev === 0 ? 0 : ((diff / prev) * 100).toFixed(1);
            return { diff, percent, isPositive: diff > 0 };
        };

        const volumeDelta = getDelta(current.totalVolume, previous.totalVolume);
        const weightDelta = getDelta(current.maxWeight, previous.maxWeight);

        // Chart Data
        const chartData = [
            { name: 'Previous', volume: previous.totalVolume, fill: '#27272a' },
            { name: 'Current', volume: current.totalVolume, fill: '#ccff00' },
        ];

        return (
            <div className="space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Previous */}
                    <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                        <div className="flex items-center gap-2 mb-3 text-muted">
                            {mode === 'ALL' ? <Activity size={14} /> : <Calendar size={14} />}
                            <span className="text-xs font-bold uppercase tracking-wider">{previous.label}</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black text-zinc-400">{(previous.totalVolume / 1000).toFixed(1)}k <span className="text-xs font-bold text-zinc-600">VOL</span></p>
                            <p className="text-sm font-bold text-zinc-500">{previous.maxWeight.toFixed(1)}kg Max</p>
                        </div>
                    </div>

                    {/* Current */}
                    <div className="bg-primary/10 p-4 rounded-2xl border border-primary/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-primary">
                            <Activity size={48} />
                        </div>
                        <div className="flex items-center gap-2 mb-3 text-primary">
                            <Calendar size={14} />
                            <span className="text-xs font-bold uppercase tracking-wider">{current.label}</span>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-black text-white">{(current.totalVolume / 1000).toFixed(1)}k</p>
                                <span className={`text-xs font-bold flex items-center ${volumeDelta.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {volumeDelta.isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                    {Math.abs(Number(volumeDelta.percent))}%
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-sm font-bold text-zinc-300">{current.maxWeight.toFixed(1)}kg Max</p>
                                <span className={`text-[10px] font-bold flex items-center ${weightDelta.diff === 0 ? 'text-zinc-500' : weightDelta.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {weightDelta.diff !== 0 && (weightDelta.isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
                                    {weightDelta.diff !== 0 ? `${Math.abs(Number(weightDelta.percent))}%` : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visualization Chart */}
                <div className="h-48 w-full bg-zinc-900/30 rounded-2xl border border-zinc-800/50 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: '#27272a', opacity: 0.4 }}
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                labelStyle={{ display: 'none' }}
                            />
                            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const partExercises = exercises.filter(e => e.bodyPart === selectedPart);

    return (
        <div className="bg-surface rounded-3xl p-6 border border-zinc-800 shadow-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-black text-white italic flex items-center gap-2 tracking-tighter">
                    <Dumbbell size={18} className="text-primary" />
                    <span className="uppercase">{selectedPart} COMPARISON</span>
                </h3>
            </div>

            {/* Controls Row */}
            <div className="flex gap-3 mb-6">
                {/* Mode Selector */}
                <div className="relative flex-1">
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value as ComparisonMode)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none appearance-none transition-colors"
                    >
                        <option value="SESSION">Session vs Session</option>
                        <option value="WEEK">Week vs Week</option>
                        <option value="MONTH">Month vs Month</option>
                        <option value="ALL">All-Time Average</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <Clock size={16} />
                    </div>
                </div>

                {/* Exercise Selector */}
                <div className="relative flex-[2]">
                    <select
                        value={selectedExerciseId}
                        onChange={(e) => setSelectedExerciseId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none appearance-none transition-colors"
                    >
                        <option value="">All {selectedPart} Exercises</option>
                        {partExercises.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <Layers size={16} />
                    </div>
                </div>
            </div>

            {/* Comparison Content */}
            {renderContent()}
        </div>
    );
};
