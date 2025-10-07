import React, { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  addDays,
  isToday,
  parse,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Briefcase, PlusCircle, User as UserIcon, Building } from 'lucide-react'; // Import Building icon
import { Job, Customer } from '@/types'; // Import Customer type
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddJobForm from './AddJobForm';
import { getCategoryColor } from '@/lib/category-colors';

interface CalendarViewProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string, customerId?: string, notes?: string) => void;
  categories: string[]; // New prop for dynamic categories
  customers: Customer[]; // New prop for customers
}

interface JobEvent {
  job: Job;
  type: 'start' | 'deadline';
}

const CalendarView: React.FC<CalendarViewProps> = ({ jobs, onSelectJob, onAddJob, categories, customers }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isJobDetailsDialogOpen, setIsJobDetailsDialogOpen] = useState(false);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<JobEvent[]>([]);

  const headerFormat = 'MMMM yyyy';
  const dateFormat = 'd';
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const daysInMonth = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const jobsByDate = useMemo(() => {
    const map = new Map<string, JobEvent[]>();
    jobs.forEach(job => {
      if (job.startDate) {
        const dateKey = format(new Date(job.startDate), 'yyyy-MM-dd');
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)?.push({ job, type: 'start' });
      }
      if (job.deadlineDate && job.startDate !== job.deadlineDate) {
        const dateKey = format(new Date(job.deadlineDate), 'yyyy-MM-dd');
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)?.push({ job, type: 'deadline' });
      }
    });
    return map;
  }, [jobs]);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const dateKey = format(day, 'yyyy-MM-dd');
    const eventsForDay = jobsByDate.get(dateKey) || [];
    setSelectedDayEvents(eventsForDay);
    setIsJobDetailsDialogOpen(true);
  };

  const handleAddJobAndClose = (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string, customerId?: string, notes?: string) => {
    onAddJob(title, description, startDate, deadlineDate, startTime, endTime, category, customerId, notes);
    setIsAddEventDialogOpen(false);
    setIsJobDetailsDialogOpen(false);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      return format(parse(timeString, 'HH:mm', new Date()), 'h:mm a');
    } catch (error) {
      console.error("Error formatting time:", timeString, error);
      return timeString;
    }
  };

  const calculateProgress = (job: Job) => {
    if (job.todos.length === 0) return 0;

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

    if (totalCountable === 0) return 0;
    return Math.round((completedCount / totalCountable) * 100);
  };

  const getProgressBarColorClass = (progressValue: number) => {
    if (progressValue === 100) return 'text-green-500';
    if (progressValue >= 75) return 'text-blue-500';
    if (progressValue >= 50) return 'text-yellow-500';
    if (progressValue >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold">{format(currentMonth, headerFormat)}</h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const hasJobs = jobsByDate.has(dayKey);
          return (
            <div
              key={index}
              className={cn(
                "relative p-2 h-16 flex flex-col items-center justify-center rounded-md cursor-pointer transition-colors",
                !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50",
                isSameDay(day, selectedDate || new Date()) && "bg-primary text-primary-foreground",
                isToday(day) && "border border-blue-500",
                hasJobs && "bg-accent/50 hover:bg-accent",
                "hover:bg-muted"
              )}
              onClick={() => handleDayClick(day)}
            >
              <span className="text-sm font-medium">{format(day, dateFormat)}</span>
              {hasJobs && (
                <div className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-xs">
                  {jobsByDate.get(dayKey)?.length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={isJobDetailsDialogOpen} onOpenChange={setIsJobDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Jobs on {selectedDate ? format(selectedDate, 'PPP') : ''}</DialogTitle>
            <DialogDescription>
              {selectedDayEvents.length > 0 ? "Here are the jobs scheduled for this day." : "No jobs scheduled for this day."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {selectedDayEvents.map((event) => {
                const progress = calculateProgress(event.job);
                const progressBarColorClass = getProgressBarColorClass(progress);
                const radius = 18;
                const strokeWidth = 4;
                const viewBoxSize = 48;
                const center = viewBoxSize / 2;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (progress / 100) * circumference;
                const customer = event.job.customerId ? customers.find(c => c.id === event.job.customerId) : undefined;

                return (
                  <div
                    key={`${event.job.id}-${event.type}`}
                    className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer flex items-center justify-between space-x-3"
                    onClick={() => {
                      onSelectJob(event.job);
                      setIsJobDetailsDialogOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-base">
                          {event.job.title} <span className="text-xs text-muted-foreground ml-1">({event.type === 'start' ? 'Start Date' : 'Deadline'})</span>
                        </p>
                        {event.job.category && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className={cn("w-2 h-2 rounded-full mr-1", getCategoryColor(event.job.category))}></span>
                            <span>{event.job.category}</span>
                          </div>
                        )}
                        {customer && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            {customer.companyName && <Building className="h-3 w-3 mr-1" />}
                            <span>
                              {customer.companyName && <span className="font-semibold">{customer.companyName}</span>}
                              {customer.companyName && customer.name && ` - `}
                              {customer.name}
                            </span>
                          </div>
                        )}
                        {(event.job.startTime || event.job.endTime) && (
                          <p className="text-xs text-muted-foreground">
                            {event.job.startTime && `Start: ${formatTime(event.job.startTime)}`}
                            {event.job.startTime && event.job.endTime && ` - `}
                            {event.job.endTime && `End: ${formatTime(event.job.endTime)}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 relative w-12 h-12">
                      <svg className="w-full h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
                        <circle
                          className="text-gray-200 dark:text-gray-700"
                          strokeWidth={strokeWidth}
                          stroke="currentColor"
                          fill="transparent"
                          r={radius}
                          cx={center}
                          cy={center}
                        />
                        <circle
                          className={cn("stroke-current", progressBarColorClass)}
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          fill="transparent"
                          r={radius}
                          cx={center}
                          cy={center}
                          transform={`rotate(-90 ${center} ${center})`}
                        />
                        <text
                          x="50%"
                          y="50%"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          className="text-xs font-bold text-foreground"
                        >
                          {progress}%
                        </text>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add an Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Job for {selectedDate ? format(selectedDate, 'PPP') : ''}</DialogTitle>
                </DialogHeader>
                <AddJobForm
                  onAddJob={handleAddJobAndClose}
                  initialStartDate={selectedDate}
                  categories={categories}
                  customers={customers}
                />
              </DialogContent>
            </Dialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;