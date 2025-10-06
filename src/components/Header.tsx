import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddJobForm from './AddJobForm';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, category?: string) => void;
  onOpenNav: () => void;
  showAddJobButton?: boolean; // New prop to conditionally show the Add Job button
}

const Header: React.FC<HeaderProps> = ({ onAddJob, onOpenNav, showAddJobButton = true }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddJobAndClose = (title: string, description: string, startDate?: string, deadlineDate?: string, category?: string) => {
    onAddJob(title, description, startDate, deadlineDate, category);
    setIsDialogOpen(false);
  };

  return (
    <header className="w-full flex items-center justify-between mb-8 px-4 py-4 bg-card rounded-b-lg shadow-sm"> {/* Removed max-w-md, adjusted padding */}
      <Button variant="ghost" size="icon" onClick={onOpenNav} className="sm:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open navigation</span>
      </Button>
      <h1 className="text-3xl font-bold text-primary flex-grow text-center sm:text-left">SnapTrack</h1>
      {showAddJobButton && ( // Conditionally render the Add Job button
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-auto">Add Job</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <AddJobForm onAddJob={handleAddJobAndClose} />
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
};

export default Header;