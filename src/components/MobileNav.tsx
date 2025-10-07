import React from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Home, Briefcase, CalendarDays, Timer as TimerIcon } from 'lucide-react'; // Added TimerIcon

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[240px] sm:w-[280px] p-4">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-primary">SnapTrack</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-2">
          <Button asChild variant="ghost" className="justify-start text-lg h-12">
            <Link to="/" onClick={onClose}>
              <Home className="mr-3 h-5 w-5" />
              Overview
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start text-lg h-12">
            <Link to="/jobs" onClick={onClose}>
              <Briefcase className="mr-3 h-5 w-5" />
              My Jobs
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start text-lg h-12">
            <Link to="/calendar" onClick={onClose}>
              <CalendarDays className="mr-3 h-5 w-5" />
              Calendar View
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start text-lg h-12">
            <Link to="/timer" onClick={onClose}>
              <TimerIcon className="mr-3 h-5 w-5" />
              Task Timer
            </Link>
          </Button>
          {/* Add more navigation links here if needed */}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;