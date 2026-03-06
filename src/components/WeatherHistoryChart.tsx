import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { Thermometer, CloudRain } from 'lucide-react';

interface WeatherHistoryData {
  date: string;
  temperature: number;
  rainfall: number;
  humidity: number;
}

interface WeatherHistoryChartProps {
  data: WeatherHistoryData[];
}

const WeatherHistoryChart: React.FC<WeatherHistoryChartProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {/* Temperature Chart */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Thermometer className="w-5 h-5 text-secondary" />
          <h4 className="font-semibold text-foreground">Temperature Trend (°C)</h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--secondary))' }}
              name="Temperature"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Rainfall & Humidity Chart */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <CloudRain className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground">Rainfall (mm) & Humidity (%)</h4>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="rainfall" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              name="Rainfall (mm)"
            />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="hsl(145 40% 60%)" 
              strokeWidth={2}
              dot={{ fill: 'hsl(145 40% 60%)' }}
              strokeDasharray="5 5"
              name="Humidity (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default WeatherHistoryChart;