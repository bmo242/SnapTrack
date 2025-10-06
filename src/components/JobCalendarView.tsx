import React from 'react';
import { Job } from '@/types';
import { format, parseISO, isToday, getDaysInMonth, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';

interface JobCalendarViewProps {
  jobs: Job[];
}

const JobCalendarView: React.FC<JobCalendarViewProps> = ({ jobs }) => {
  // Group jobs by their deadline date
  const jobsByDate: { [key: string]: Job[] } = {};
  jobs.forEach(job => {
    if (job.deadlineDate) {
      const dateKey = format(parseISO(job.deadlineDate), 'yyyy-MM-dd');
      if (!jobsByDate[dateKey]) {
        jobsByDate[dateKey] = [];
      }
      jobsByDate[dateKey].push(job);
    }
  });

  // Get all unique months that have jobs with deadlines, plus the current month if no jobs
  const today = new Date();
  const currentMonthKey = format(today, 'yyyy-MM');

  const allRelevantMonthKeys = new Set<string>();
  jobs.forEach(job => {
    if (job.deadlineDate) {
      allRelevantMonthKeys.add(format(parseISO(job.deadlineDate), 'yyyy-MM'));
    }
  });
  if (allRelevantMonthKeys.size === 0) { // If no jobs, still show current month
    allRelevantMonthKeys.add(currentMonthKey);
  }

  const sortedMonthKeys = Array.from(allRelevantMonthKeys).sort();

  // Determine the maximum number of jobs on any single day for bar scaling
  const maxJobsPerDay = Math.max(0, ...Object.values(jobsByDate).map(jobs => jobs.length));

  const renderMonth = (monthKey: string) => {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1; // Month is 0-indexed in Date constructor

    const firstDayOfMonth = startOfMonth(new Date(year, monthIndex));
    const lastDayOfMonth = endOfMonth(new Date(year, monthIndex));
    const allDaysInMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth
    });

    return (
      <div key={monthKey} className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">{format(firstDayOfMonth, 'MMMM yyyy')}</h2>
        <div className="space-y-2">
          {allDaysInMonth.map(date => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const dailyJobs = jobsByDate[dateKey] || [];
            const jobCount = dailyJobs.length;
            const isCurrentDay = isToday(date);

            // Calculate bar width based on job count, relative to maxJobsPerDay
            // If maxJobsPerDay is 0 (no jobs at all), barWidthPercentage will be 0.
            // If jobCount is 0, barWidthPercentage will be 0.
            const barWidthPercentage = maxJobsPerDay > 0 ? (jobCount / maxJobsPerDay) * 100 : 0;

            return (
              <div key={dateKey} className="flex items-center">
                <span className={cn(
                  "w-32 text-sm font-medium flex-shrink-0", // Increased width for date text
                  isCurrentDay ? "text-orange-500" : "text-gray-400"
                )}>
                  {format(date, 'MMMM d')}
                </span>
                <div className="flex-grow h-4 ml-4 relative">
                  <div
                    className={cn(
                      "h-full rounded-sm",
                      isCurrentDay ? "bg-orange-500" : "bg-gray-700"
                    )}
                    style={{ width: `${barWidthPercentage}%`, minWidth: jobCount > 0 ? '10px' : '0px' }} // Ensure a minimum width for visibility if there are jobs
                  ></div>
                  {jobCount > 0 && (
                    <span className={cn(
                      "absolute left-full ml-2 text-xs font-medium",
                      isCurrentDay ? "text-orange-500" : "text-gray-400"
                    )}>
                      {jobCount} job{jobCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-black min-h-screen text-white">
      {sortedMonthKeys.length === 0 ? (
        <p className="text-center text-muted-foreground">No jobs with deadlines to display in the calendar view.</p>
      ) : (
        sortedMonthKeys.map(renderMonth)
      )}
    </div>
  );
};

export default JobCalendarView;