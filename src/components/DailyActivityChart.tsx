import React, { useMemo } from 'react';
import { Job } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added import for Card components
import { format, parseISO, startOfDay, getHours, setHours, setMinutes, subDays, addDays } from 'date-fns';

interface DailyActivityChartProps {
  jobs: Job[];
}

interface DailyActivityData {
  date: string;
  count: number;
}

interface HourlyActivityData {
  hour: string;
  count: number;
}

const DailyActivityChart: React.FC<DailyActivityChartProps> = ({ jobs }) => {
  const { dailyActivityData, hourlyActivityData } = useMemo(() => {
    const dailyCounts: { [key: string]: number } = {};
    const hourlyCounts: { [key: string]: number } = {}; // Keys '00', '01', ..., '23'

    jobs.forEach(job => {
      job.todos.forEach(todo => {
        if (todo.status === 'checked' && todo.completedAt) {
          const completedDate = parseISO(todo.completedAt);
          const dateKey = format(startOfDay(completedDate), 'yyyy-MM-dd');
          const hourKey = format(completedDate, 'HH');

          dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
          hourlyCounts[hourKey] = (hourlyCounts[hourKey] || 0) + 1;
        }
      });
    });

    // Generate data for the 7-day window: 3 days before, today, 3 days after
    const today = startOfDay(new Date());
    const sevenDayWindow: DailyActivityData[] = [];
    for (let i = -3; i <= 3; i++) {
      const date = addDays(today, i);
      const dateKey = format(date, 'yyyy-MM-dd');
      sevenDayWindow.push({
        date: dateKey,
        count: dailyCounts[dateKey] || 0,
      });
    }

    const sortedHourlyData: HourlyActivityData[] = Array.from({ length: 24 }, (_, i) => {
      const hour24 = String(i).padStart(2, '0');
      // Create a dummy date to format the hour correctly to AM/PM
      const dummyDate = setMinutes(setHours(new Date(), i), 0);
      const hour12 = format(dummyDate, 'h:mm a');
      return { hour: hour12, count: hourlyCounts[hour24] || 0 };
    });

    return { dailyActivityData: sevenDayWindow, hourlyActivityData: sortedHourlyData };
  }, [jobs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Daily Task Completions</CardTitle>
          <CardDescription>Number of tasks completed each day.</CardDescription>
        </CardHeader>
        <CardContent>
          {dailyActivityData.every(data => data.count === 0) ? (
            <p className="text-center text-muted-foreground py-8">No completed tasks to display daily activity for this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(parseISO(value), 'MMM d')}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  stroke="hsl(var(--foreground))"
                />
                <YAxis allowDecimals={false} stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number, name: string, props: any) => [`${value} tasks`, 'Completed']}
                  labelFormatter={(label) => `Date: ${format(parseISO(label), 'PPP')}`}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Hourly Activity Distribution</CardTitle>
          <CardDescription>Distribution of task completions by hour of the day.</CardDescription>
        </CardHeader>
        <CardContent>
          {hourlyActivityData.every(data => data.count === 0) ? (
            <p className="text-center text-muted-foreground py-8">No completed tasks to display hourly activity.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--foreground))" />
                <YAxis allowDecimals={false} stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number, name: string, props: any) => [`${value} tasks`, 'Completed']}
                  labelFormatter={(label) => `Hour: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                  dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyActivityChart;