import React from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import UserProfileHeader from '@/components/UserProfileHeader';
import TaskSummary from '@/components/TaskSummary';
import ActiveProjectsCarousel from '@/components/ActiveProjectsCarousel';
import { Job } from '@/types';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header'; // Import Header
import MobileNav from '@/components/MobileNav'; // Import MobileNav
import { useState } from 'react'; // Import useState

interface OverviewProps {
  jobs: Job[];
}

const Overview: React.FC<OverviewProps> = ({ jobs }) => {
  const [isNavOpen, setIsNavOpen] = useState(false); // State for mobile nav

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header onAddJob={() => {}} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={false} /> {/* Pass showAddJobButton prop */}
      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div className="w-full space-y-6 px-4"> {/* Removed max-w-md, adjusted padding */}
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