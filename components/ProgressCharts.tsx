import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkoutLog } from '../types';

interface ProgressChartsProps {
  logs: WorkoutLog[];
  filterType: 'Volume' | 'MaxWeight';
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ logs, filterType }) => {
  // Process data for charts
  const data = logs
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(log => {
      let value = 0;
      if (filterType === 'Volume') {
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

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted border-2 border-dashed border-zinc-800 rounded-3xl bg-surface/50">
        <span className="text-sm font-medium text-zinc-500">No data available</span>
        <span className="text-xs opacity-30 mt-1">Start logging to see progress</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="99%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#52525b" 
            fontSize={10} 
            tickMargin={10} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={10} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
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
      </ResponsiveContainer>
    </div>
  );
};