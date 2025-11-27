import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WorkoutLog } from '../types';

export type ChartType = 'Volume' | 'MaxWeight' | 'WeeklyComparison' | 'OneRM' | 'Frequency';

interface ProgressChartsProps {
  logs: WorkoutLog[];
  chartType: ChartType;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ logs, chartType }) => {

  const data = useMemo(() => {
    if (logs.length === 0) return [];

    const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);

    if (chartType === 'WeeklyComparison') {
      // Group by Week
      const weeklyData: Record<string, number> = {};
      sortedLogs.forEach(log => {
        const date = new Date(log.date);
        // Simple week number: ISO week would be better but for simplicity using start of week date
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const startOfWeek = new Date(date.setDate(diff));
        const key = startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        // Sum volume for the week
        const volume = log.sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
        weeklyData[key] = (weeklyData[key] || 0) + volume;
      });

      return Object.entries(weeklyData).map(([date, value]) => ({ date, value })).slice(-8); // Last 8 weeks
    }

    if (chartType === 'Frequency') {
      // Last 28 days frequency
      const today = new Date();
      const frequencyData: { date: string, value: number, fullDate: string }[] = [];

      for (let i = 27; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const displayDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        // Count workouts on this day
        const count = logs.filter(l => l.date.startsWith(dateStr)).length;
        frequencyData.push({ date: displayDate, value: count, fullDate: dateStr });
      }
      return frequencyData;
    }

    if (chartType === 'OneRM') {
      // Epley Formula: Weight * (1 + Reps / 30)
      return sortedLogs.map(log => {
        const maxOneRM = Math.max(...log.sets.map(s => s.weight * (1 + s.reps / 30)));
        return {
          date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          value: Math.round(maxOneRM),
          exercise: log.exerciseName
        };
      });
    }

    // Default: Volume or MaxWeight (Line Chart)
    return sortedLogs.map(log => {
      let value = 0;
      if (chartType === 'Volume') {
        value = log.sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
      } else {
        value = Math.max(...log.sets.map(s => s.weight));
      }
      return {
        date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value,
        exercise: log.exerciseName
      };
    });
  }, [logs, chartType]);

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted border-2 border-dashed border-zinc-800 rounded-3xl bg-surface/50">
        <span className="text-sm font-medium text-zinc-500">No data available</span>
        <span className="text-xs opacity-30 mt-1">Start logging to see progress</span>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      margin: { top: 10, right: 10, left: -20, bottom: 0 }
    };

    if (chartType === 'WeeklyComparison' || chartType === 'Frequency') {
      return (
        <BarChart data={data} {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
          <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: '#27272a', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
            itemStyle={{ color: '#ccff00', fontSize: '12px', fontWeight: 'bold' }}
            labelStyle={{ color: '#a1a1aa', fontSize: '10px', marginBottom: '4px' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ccff00' : '#27272a'} />
            ))}
          </Bar>
        </BarChart>
      );
    }

    return (
      <LineChart data={data} {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
        <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
          itemStyle={{ color: '#ccff00', fontSize: '12px', fontWeight: 'bold' }}
          labelStyle={{ color: '#a1a1aa', fontSize: '10px', marginBottom: '4px' }}
          cursor={{ stroke: '#ccff00', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#ccff00"
          strokeWidth={3}
          dot={{ r: 4, fill: '#09090b', stroke: '#ccff00', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#ccff00', stroke: '#fff' }}
          animationDuration={1000}
        />
      </LineChart>
    );
  };

  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="99%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};