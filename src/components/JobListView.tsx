import React, { useMemo } from 'react';
import { Job, Customer } from '@/types'; // Import Customer type
import { format, parseISO, parse, differenceInDays, isPast, isToday } from 'date-fns';
import { Briefcase, CalendarIcon, ListChecks, User as UserIcon } from 'lucide-react'; // Import UserIcon
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getCategoryColor } from '@/lib/category-colors';
import { cn } from '@/lib/utils';

interface JobListViewProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  customers: Customer[]; // New prop for customers
}

const JobListView: React.FC<JobListViewProps> = ({ jobs, onSelectJob, customers }) => {
  const sortedAndGroupedJobs = useMemo(() => {
    const grouped: { [key: string]: Job[] } = {};

    jobs.forEach(job => {
      const dateKey = job.startDate || job.deadlineDate;
      if (dateKey) {
        const formattedDate = format(parseISO(dateKey), 'yyyy-MM-dd');
        if (!grouped[formattedDate]) {
          grouped[formattedDate] = [];
        }
        grouped[formattedDate].push(job);
      }
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const result: { date: string; jobs: Job[] }[] = [];
    sortedDates.forEach(date => {
      const sortedJobs = grouped[date].sort((a, b) => {
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        return timeA.localeCompare(timeB);
      });
      result.push({ date, jobs: sortedJobs });
    });

    return result;
  }, [jobs]);

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      return format(parse(timeString, 'HH:mm', new Date()), 'h:mm a');
    } catch (error) {
      console.error("Error formatting time:", timeString, error);
      return timeString;
    }
  };

  const calculateProgressAndCounts = (job: Job) => {
    let completedCount = 0;
    let totalCountable = 0;

    job.todos.forEach(todo => {
      if (todo.status !== 'not-needed') {
        totalCountable++;
        if (todo.status === 'checked') {
          completedCount++;
        }
      }
    });

    const progress = totalCountable === 0 ? 0 : Math.round((completedCount / totalCountable) * 100);
    return { completedCount, totalCountable, progress };
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-card rounded-lg shadow-md">
      {sortedAndGroupedJobs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No jobs scheduled. Add a new job to see it here!</p>
      ) : (
        sortedAndGroupedJobs.map((group) => (
          <div key={group.date} className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              {format(parseISO(group.date), 'PPP')}
            </h3>
            <Separator className="mb-4" />
            <div className="space-y-2">
              {group.jobs.map((job) => {
                const { completedCount, totalCountable, progress } = calculateProgressAndCounts(job);

                const deadlineDate = job.deadlineDate ? parseISO(job.deadlineDate) : null;
                const today = new Date();
                let dueDateMessage = '';
                let dueDateColorClass = 'text-muted-foreground';

                if (deadlineDate) {
                  const daysLeft = differenceInDays(deadlineDate, today);
                  if (isPast(deadlineDate) && !isToday(deadlineDate)) {
                    dueDateMessage = 'Overdue';
                    dueDateColorClass = 'text-destructive';
                  } else if (isToday(deadlineDate)) {
                    dueDateMessage = 'Due Today';
                    dueDateColorClass = 'text-orange-500';
                  } else if (daysLeft <= 7 && daysLeft > 0) {
                    dueDateMessage = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
                    dueDateColorClass = 'text-orange-500';
                  } else if (daysLeft > 0) {
                    dueDateMessage = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
                  }
                }

                const categoryColor = getCategoryColor(job.category);
                const customer = job.customerId ? customers.find(c => c.id === job.customerId) : undefined;

                return (
                  <Button
                    key={job.id}
                    variant="outline"
                    className="w-full h-auto p-3 flex flex-col items-start justify-center text-left"
                    onClick={() => onSelectJob(job)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <p className="font-medium text-base">{job.title}</p>
                      {(job.startTime || job.endTime) && (
                        <span className="text-sm text-muted-foreground ml-auto">
                          {job.startTime && `${formatTime(job.startTime)}`}
                          {job.startTime && job.endTime && ` - `}
                          {job.endTime && `${formatTime(job.endTime)}`}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground w-full mt-1">
                      {job.category && (
                        <div className="flex items-center">
                          <span className={cn("w-2 h-2 rounded-full mr-1", categoryColor)}></span>
                          <span>{job.category}</span>
                        </div>
                      )}
                      {customer && (
                        <div className="flex items-center">
                          <UserIcon className="mr-1 h-3 w-3" />
                          <span>{customer.name}</span>
                        </div>
                      )}
                      {job.deadlineDate && (
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          <span>{format(parseISO(job.deadlineDate), "MMM d")}</span>
                          {dueDateMessage && (
                            <span className={`ml-1 font-semibold ${dueDateColorClass}`}>
                              ({dueDateMessage})
                            </span>
                          )}
                        </div>
                      )}
                      {totalCountable > 0 && (
                        <div className="flex items-center">
                          <ListChecks className="mr-1 h-3 w-3" />
                          <span>{progress}%</span>
                        </div>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JobListView;