import React from 'react';
import { Job, Customer } from '@/types'; // Import Customer type
import { CalendarIcon, Clock, ListChecks, User as UserIcon, Building, NotebookText } from 'lucide-react'; // Import Building and NotebookText icon
import { format, parseISO, differenceInDays, isPast, isToday, parse } from 'date-fns';
import { Progress } from "@/components/ui/progress";
import { getCategoryColor } from '@/lib/category-colors';
import { cn } from '@/lib/utils';
import TodoItem from './TodoItem';

interface JobQuickViewProps {
  job: Job;
  onToggleTodo: (jobId: string, todoId: string) => void;
  customers: Customer[]; // New prop for customers
}

const JobQuickView: React.FC<JobQuickViewProps> = ({ job, onToggleTodo, customers }) => {
  const calculateProgressAndCounts = () => {
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

  const { completedCount, totalCountable, progress } = calculateProgressAndCounts();

  const getProgressBarColorClass = (progressValue: number) => {
    if (progressValue === 100) return 'bg-green-500';
    if (progressValue >= 75) return 'bg-blue-500';
    if (progressValue >= 50) return 'bg-yellow-500';
    if (progressValue >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const progressBarColorClass = getProgressBarColorClass(progress);

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
    } else {
      dueDateMessage = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
    }
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      return format(parse(timeString, 'HH:mm', new Date()), 'h:mm a');
    } catch (error) {
      console.error("Error formatting time:", timeString, error);
      return timeString;
    }
  };

  const categoryColor = getCategoryColor(job.category);
  const customer = job.customerId ? customers.find(c => c.id === job.customerId) : undefined;

  return (
    <div className="space-y-4 py-4">
      <h3 className="text-2xl font-bold">{job.title}</h3>
      <p className="text-muted-foreground">{job.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {job.category && (
          <div className="flex items-center">
            <span className="font-semibold mr-1">Category:</span>
            <span className={cn("w-3 h-3 rounded-full mr-1", categoryColor)}></span>
            {job.category}
          </div>
        )}
        {customer && (
          <div className="flex items-center">
            {customer.companyName && <Building className="mr-2 h-4 w-4" />}
            <span>
              {customer.companyName && <span className="font-semibold">{customer.companyName}</span>}
              {customer.companyName && customer.name && ` - `}
              {customer.name}
            </span>
          </div>
        )}
        {job.startDate && (
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Start: {format(parseISO(job.startDate), "PPP")}</span>
          </div>
        )}
        {job.deadlineDate && (
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Deadline: {format(parseISO(job.deadlineDate), "PPP")}</span>
            {dueDateMessage && (
              <span className={`ml-2 font-semibold ${dueDateColorClass}`}>
                ({dueDateMessage})
              </span>
            )}
          </div>
        )}
        {(job.startTime || job.endTime) && (
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {job.startTime && `Start: ${formatTime(job.startTime)}`}
              {job.startTime && job.endTime && ` - `}
              {job.endTime && `End: ${formatTime(job.endTime)}`}
            </span>
          </div>
        )}
      </div>

      {job.notes && (
        <div className="space-y-2">
          <h4 className="text-lg font-semibold mt-4 flex items-center">
            <NotebookText className="mr-2 h-5 w-5 text-muted-foreground" />
            Project Notes:
          </h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.notes}</p>
        </div>
      )}

      {totalCountable > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ListChecks className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {completedCount} out of {totalCountable} tasks completed
              </span>
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" indicatorClassName={progressBarColorClass} />
        </div>
      )}

      {job.todos.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-lg font-semibold mt-4">To-Do List:</h4>
          {job.todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={(todoId) => onToggleTodo(job.id, todoId)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobQuickView;