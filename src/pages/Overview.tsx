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

interface OverviewProps {
  jobs: Job[];
  user: User; // Add user prop
  onUpdateUser: (updatedUser: User) => void; // Add onUpdateUser prop
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => void; // Add onAddJob prop
}

const Overview: React.FC<OverviewProps> = ({ jobs, user, onUpdateUser, onAddJob }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
        <Header onAddJob={onAddJob} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={true} /> {/* Changed showAddJobButton to true and passed onAddJob */}
        <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

        <div className="w-full space-y-6 px-4">
          <UserProfileHeader user={user} onUpdateUser={onUpdateUser} /> {/* Pass user and onUpdateUser */}
          <TaskSummary jobs={jobs} />
          <Separator />
          <ActiveProjectsCarousel jobs={jobs} />
          <DailyActivityChart jobs={jobs} /> {/* Add the new DailyActivityChart */}
        </div>
        <MadeWithDyad />
      </div>
  );
};

export default Overview;