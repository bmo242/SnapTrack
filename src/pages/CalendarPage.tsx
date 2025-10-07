import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import CalendarView from '@/components/CalendarView';
import JobListView from '@/components/JobListView';
import { Job, Customer } from '@/types'; // Import Customer type
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CalendarDays, List } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import JobQuickView from '@/components/JobQuickView';

interface CalendarPageProps {
  jobs: Job[];
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string, customerId?: string) => void;
  onToggleTodo: (jobId: string, todoId: string) => void;
  categories: string[]; // New prop for dynamic categories
  customers: Customer[]; // New prop for customers
}

const CalendarPage: React.FC<CalendarPageProps> = ({ jobs, onAddJob, onToggleTodo, categories, customers }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedJobForQuickView, setSelectedJobForQuickView] = useState<Job | null>(null);

  useEffect(() => {
    if (isQuickViewOpen && selectedJobForQuickView) {
      const updatedJob = jobs.find(job => job.id === selectedJobForQuickView.id);
      if (updatedJob) {
        setSelectedJobForQuickView(updatedJob);
      } else {
        setIsQuickViewOpen(false);
        setSelectedJobForQuickView(null);
      }
    }
  }, [jobs, isQuickViewOpen, selectedJobForQuickView?.id]);

  const handleSelectJob = (job: Job) => {
    setSelectedJobForQuickView(job);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header onAddJob={onAddJob} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={true} categories={categories} customers={customers} />
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
          <CalendarView jobs={jobs} onSelectJob={handleSelectJob} onAddJob={onAddJob} categories={categories} customers={customers} />
        ) : (
          <JobListView jobs={jobs} onSelectJob={handleSelectJob} customers={customers} />
        )}
      </div>

      <Separator className="my-8 w-full px-4" />

      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {selectedJobForQuickView && (
            <JobQuickView
              job={selectedJobForQuickView}
              onToggleTodo={onToggleTodo}
              customers={customers} // Pass customers to JobQuickView
            />
          )}
        </DialogContent>
      </Dialog>
      <div className="pb-8"></div>
    </div>
  );
};

export default CalendarPage;