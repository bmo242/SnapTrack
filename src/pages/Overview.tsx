import React from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import UserProfileHeader from '@/components/UserProfileHeader';
import TaskSummary from '@/components/TaskSummary';
import ActiveProjectsCarousel from '@/components/ActiveProjectsCarousel';
import { Job } from '@/types';
import { Separator } from '@/components/ui/separator';

interface OverviewProps {
  jobs: Job[];
}

const Overview: React.FC<OverviewProps> = ({ jobs }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 text-foreground">
      <div className="w-full max-w-md space-y-6">
        <UserProfileHeader />
        <TaskSummary jobs={jobs} />
        <Separator />
        <ActiveProjectsCarousel jobs={jobs} />
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Overview;