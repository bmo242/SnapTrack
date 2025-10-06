import React, { useMemo } from 'react';
import { Job } from '@/types';
import { format, parseISO, parse } from 'date-fns'; // Import parse
import { Briefcase, Clock } from 'lucide-react'; // Removed CalendarIcon
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface JobListViewProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

const JobListView: React.FC<JobListViewProps> = ({ jobs, onSelectJob }) => {
  const sortedAndGroupedJobs = useMemo(() => {
    const grouped: { [key: string]: Job[] } = {};

    // Group jobs by their start date or deadline date
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

    // Sort dates and then sort jobs within each date
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-card rounded-lg shadow-md">
      {sortedAndGroupedJobs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No jobs scheduled. Add a new job to see it here!</p>
      ) : (
        sortedAndGroupedJobs.map((group) => (
          <div key={group.date} className="mb-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" /> {/* Changed to Briefcase icon for consistency */}
              {format(parseISO(group.date), 'PPP')}
            </h3>
            <Separator className="mb-4" />
            <div className="space-y-2"> {/* Reduced space-y for a more compact list */}
              {group.jobs.map((job) => (
                <Button
                  key={job.id}
                  variant="outline"
                  className="w-full h-auto p-3 flex items-center justify-between text-left" // Adjusted padding and layout
                  onClick={() => onSelectJob(job)}
                >
                  <p className="font-medium text-base">{job.title}</p>
                  {(job.startTime || job.endTime) && (
                    <div className="flex items-center text-sm text-muted-foreground ml-auto"> {/* Moved to ml-auto for right alignment */}
                      <Clock className="mr-1 h-3 w-3" />
                      <span>
                        {job.startTime && `${formatTime(job.startTime)}`}
                        {job.startTime && job.endTime && ` - `}
                        {job.endTime && `${formatTime(job.endTime)}`}
                      </span>
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JobListView;