import React from 'react';
import UserProfileHeader from '@/components/UserProfileHeader';
import TaskSummary from '@/components/TaskSummary';
import ActiveProjectsCarousel from '@/components/ActiveProjectsCarousel';
import DailyActivityChart from '@/components/DailyActivityChart';
import { Job, User, Customer } from '@/types'; // Import Customer type
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OverviewProps {
  jobs: Job[];
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string, customerId?: string) => void;
  categories: string[]; // New prop for dynamic categories
  customers: Customer[]; // New prop for customers
}

const Overview: React.FC<OverviewProps> = ({ jobs, user, onUpdateUser, onAddJob, categories, customers }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectJob = (jobId: string) => {
    const selectedJob = jobs.find(job => job.id === jobId);
    if (selectedJob) {
      toast.info(`Navigating to job: ${selectedJob.title}`);
      navigate('/jobs');
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
        <Header onAddJob={onAddJob} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={true} categories={categories} customers={customers} />
        <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

        <div className="w-full space-y-6 px-4">
          <UserProfileHeader user={user} onUpdateUser={onUpdateUser} jobs={jobs} />
          <TaskSummary jobs={jobs} />
          <Separator />
          <ActiveProjectsCarousel jobs={jobs} onSelectJob={handleSelectJob} />
          <DailyActivityChart jobs={jobs} />
        </div>
        <div className="pb-8"></div>
      </div>
  );
};

export default Overview;