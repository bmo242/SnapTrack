import React from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import UserProfileHeader from '@/components/UserProfileHeader';
import TaskSummary from '@/components/TaskSummary';
import ActiveProjectsCarousel from '@/components/ActiveProjectsCarousel';
import { Job } from '@/types';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { useState } from 'react';
import MobileOnlyWrapper from '@/components/MobileOnlyWrapper'; // Import MobileOnlyWrapper

interface OverviewProps {
  jobs: Job[];
}

const Overview: React.FC<OverviewProps> = ({ jobs }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <MobileOnlyWrapper> {/* Added MobileOnlyWrapper here */}
      <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
        <Header onAddJob={() => {}} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={false} />
        <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

        <div className="w-full space-y-6 px-4">
          <UserProfileHeader />
          <TaskSummary jobs={jobs} />
          <Separator />
          <ActiveProjectsCarousel jobs={jobs} />
        </div>
        <MadeWithDyad />
      </div>
    </MobileOnlyWrapper>
  );
};

export default Overview;