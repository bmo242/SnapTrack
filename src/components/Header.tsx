import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddJobForm from './AddJobForm';
import { Menu } from 'lucide-react'; // Import Menu icon

interface HeaderProps {
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, category?: string) => void;
  onOpenNav: () => void; // New prop to open mobile nav
}

const Header: React.FC<HeaderProps> = ({ onAddJob, onOpenNav }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddJobAndClose = (title: string, description: string, startDate?: string, deadlineDate?: string, category?: string) => {
    onAddJob(title, description, startDate, deadlineDate, category);
    setIsDialogOpen(false); // Close the dialog after adding the job
  };

  return (
    <header className="w-full max-w-md flex items-center justify-between mb-8 p-4 bg-card rounded-lg shadow-sm">
      <Button variant="ghost" size="icon" onClick={onOpenNav} className="sm:hidden"> {/* Only show on small screens */}
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open navigation</span>
      </Button>
      <h1 className="text-3xl font-bold text-primary flex-grow text-center sm:text-left">SnapTrack</h1>
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
    </header>
  );
};

export default Header;