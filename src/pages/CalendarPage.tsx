import React, { useState } from 'react';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import JobCalendarView from '@/components/JobCalendarView';
import { Job } from '@/types';
// import MobileOnlyWrapper from '@/components/MobileOnlyWrapper'; // Removed MobileOnlyWrapper import

interface CalendarPageProps {
  jobs: Job[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ jobs }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    // <MobileOnlyWrapper> {/* Removed MobileOnlyWrapper here */}
      <div className="min-h-screen flex flex-col items-center bg-black text-white">
        <Header onAddJob={() => {}} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={false} />
        <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

        <div className="w-full max-w-md px-4 py-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Job Deadlines Calendar</h1>
          <JobCalendarView jobs={jobs} />
        </div>
      </div>
    // </MobileOnlyWrapper>
  );
};

export default CalendarPage;