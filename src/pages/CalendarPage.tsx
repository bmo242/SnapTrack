import React, { useState } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import CalendarView from '@/components/CalendarView';
import JobListView from '@/components/JobListView'; // Import the new JobListView
import { Job } from '@/types';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CalendarDays, List } from 'lucide-react';

interface CalendarPageProps {
  jobs: Job[];
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ jobs, onAddJob }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar'); // New state for view mode
  const navigate = useNavigate();

  const handleSelectJob = (job: Job) => {
    toast.info(`Navigating to job: ${job.title}`);
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header onAddJob={onAddJob} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={true} />
      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div className="w-full px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-6">Job Schedule</h1>

        <div className="flex justify-center space-x-2 mb-6">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarDays className="mr-2 h-4 w-4" /> Calendar View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <List className="mr-2 h-4 w-4" /> List View
          </Button>
        </div>

        {viewMode === 'calendar' ? (
          <CalendarView jobs={jobs} onSelectJob={handleSelectJob} onAddJob={onAddJob} />
        ) : (
          <JobListView jobs={jobs} onSelectJob={handleSelectJob} />
        )}
      </div>

      <Separator className="my-8 w-full px-4" />
      <MadeWithDyad />
    </div>
  );
};

export default CalendarPage;