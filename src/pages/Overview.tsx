import React from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import UserProfileHeader from '@/components/UserProfileHeader';
import TaskSummary from '@/components/TaskSummary';
import ActiveProjectsCarousel from '@/components/ActiveProjectsCarousel';
import DailyActivityChart from '@/components/DailyActivityChart'; // Import the new chart component
import { Job, User } from '@/types'; // Import User type
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'sonner'; // Import toast for notifications

interface OverviewProps {
  jobs: Job[];
  user: User; // Add user prop
  onUpdateUser: (updatedUser: User) => void; // Add onUpdateUser prop
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => void; // Add onAddJob prop
}

const Overview: React.FC<OverviewProps> = ({ jobs, user, onUpdateUser, onAddJob }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSelectJob = (jobId: string) => {
    // For now, we'll just navigate to the jobs page.
    // In a more advanced scenario, you might pass the jobId as state or a URL parameter
    // to highlight the specific job on the /jobs page.
    const selectedJob = jobs.find(job => job.id === jobId);
    if (selectedJob) {
      toast.info(`Navigating to job: ${selectedJob.title}`);
      navigate('/jobs');
    }
  };

  return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
        <Header onAddJob={onAddJob} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={true} /> {/* Changed showAddJobButton to true and passed onAddJob */}
        <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

        <div className="w-full space-y-6 px-4">
          <UserProfileHeader user={user} onUpdateUser={onUpdateUser} jobs={jobs} /> {/* Pass user, onUpdateUser, and jobs */}
          <TaskSummary jobs={jobs} />
          <Separator />
          <ActiveProjectsCarousel jobs={jobs} onSelectJob={handleSelectJob} /> {/* Pass onSelectJob */}
          <DailyActivityChart jobs={jobs} /> {/* Add the new DailyActivityChart */}
        </div>
        <MadeWithDyad />
      </div>
  );
};

export default Overview;