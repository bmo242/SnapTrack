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
import { ChevronLeft, ChevronRight, Briefcase, PlusCircle } from 'lucide-react';
import { Job } from '@/types';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, // Import DialogFooter
  DialogTrigger, // Import DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddJobForm from './AddJobForm'; // Import AddJobForm

interface CalendarViewProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => void; // Add onAddJob prop
}

const CalendarView: React.FC<CalendarViewProps> = ({ jobs, onSelectJob, onAddJob }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isJobDetailsDialogOpen, setIsJobDetailsDialogOpen] = useState(false);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false); // New state for Add Event dialog
  const [selectedDayJobs, setSelectedDayJobs] = useState<Job[]>([]);

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
    const map = new Map<string, Job[]>();
    jobs.forEach(job => {
      if (job.startDate) {
        const dateKey = format(new Date(job.startDate), 'yyyy-MM-dd');
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)?.push(job);
      }
      if (job.deadlineDate && job.startDate !== job.deadlineDate) { // Also show on deadline if different
        const dateKey = format(new Date(job.deadlineDate), 'yyyy-MM-dd');
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)?.push(job);
      }
    });
    return map;
  }, [jobs]);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const dateKey = format(day, 'yyyy-MM-dd');
    const jobsForDay = jobsByDate.get(dateKey) || [];
    setSelectedDayJobs(jobsForDay);
    setIsJobDetailsDialogOpen(true);
  };

  const handleAddJobAndClose = (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => {
    onAddJob(title, description, startDate, deadlineDate, startTime, endTime, category);
    setIsAddEventDialogOpen(false); // Close the Add Event dialog
    setIsJobDetailsDialogOpen(false); // Also close the job details dialog
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
              {selectedDayJobs.length > 0 ? "Here are the jobs scheduled for this day." : "No jobs scheduled for this day."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {selectedDayJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer flex items-center space-x-3"
                  onClick={() => {
                    onSelectJob(job);
                    setIsJobDetailsDialogOpen(false);
                  }}
                >
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-base">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.category}</p>
                    {(job.startTime || job.endTime) && (
                      <p className="text-xs text-muted-foreground">
                        {job.startTime && `Start: ${formatTime(job.startTime)}`}
                        {job.startTime && job.endTime && ` - `}
                        {job.endTime && `End: ${formatTime(job.endTime)}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add an Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Job for {selectedDate ? format(selectedDate, 'PPP') : ''}</DialogTitle>
                </DialogHeader>
                <AddJobForm
                  onAddJob={handleAddJobAndClose}
                  initialStartDate={selectedDate} // Pass the selected date
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