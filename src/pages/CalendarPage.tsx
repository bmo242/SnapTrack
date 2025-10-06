import React, { useState } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import CalendarView from '@/components/CalendarView';
import { Job } from '@/types';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CalendarPageProps {
  jobs: Job[];
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ jobs, onAddJob }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectJob = (job: Job) => {
    // Navigate to the jobs page and potentially highlight the job
    // For now, we'll just show a toast and navigate to /jobs
    toast.info(`Navigating to job: ${job.title}`);
    navigate('/jobs');
    // In a more advanced setup, you might pass state to /jobs to scroll to or open the specific job card
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header onAddJob={onAddJob} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={true} />
      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div className="w-full px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-6">Job Calendar</h1>
        <CalendarView jobs={jobs} onSelectJob={handleSelectJob} />
      </div>

      <Separator className="my-8 w-full px-4" />
      <MadeWithDyad />
    </div>
  );
};

export default CalendarPage;