import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import CalendarView from '@/components/CalendarView';
import JobListView from '@/components/JobListView'; // Import the new JobListView
import { Job } from '@/types';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CalendarDays, List } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components
import JobQuickView from '@/components/JobQuickView'; // Import the new JobQuickView component

interface CalendarPageProps {
  jobs: Job[];
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => void;
  onToggleTodo: (jobId: string, todoId: string) => void; // Add onToggleTodo prop
}

const CalendarPage: React.FC<CalendarPageProps> = ({ jobs, onAddJob, onToggleTodo }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false); // State for quick view dialog
  const [selectedJobForQuickView, setSelectedJobForQuickView] = useState<Job | null>(null); // State for selected job

  // Effect to update selectedJobForQuickView when jobs array changes
  useEffect(() => {
    if (isQuickViewOpen && selectedJobForQuickView) {
      const updatedJob = jobs.find(job => job.id === selectedJobForQuickView.id);
      if (updatedJob) {
        setSelectedJobForQuickView(updatedJob);
      } else {
        // If the job was deleted while quick view was open
        setIsQuickViewOpen(false);
        setSelectedJobForQuickView(null);
      }
    }
  }, [jobs, isQuickViewOpen, selectedJobForQuickView?.id]); // Depend on jobs, dialog open state, and selected job ID

  const handleSelectJob = (job: Job) => {
    setSelectedJobForQuickView(job);
    setIsQuickViewOpen(true);
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

      {/* Job Quick View Dialog */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {selectedJobForQuickView && (
            <JobQuickView
              job={selectedJobForQuickView}
              onToggleTodo={onToggleTodo} // Pass onToggleTodo to JobQuickView
            />
          )}
        </DialogContent>
      </Dialog>
      <div className="pb-8"></div> {/* Added bottom spacing */}
    </div>
  );
};

export default CalendarPage;