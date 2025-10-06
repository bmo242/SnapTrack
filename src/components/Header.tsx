import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddJobForm from './AddJobForm';

interface HeaderProps {
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, category?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddJob }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddJobAndClose = (title: string, description: string, startDate?: string, deadlineDate?: string, category?: string) => {
    onAddJob(title, description, startDate, deadlineDate, category);
    setIsDialogOpen(false); // Close the dialog after adding the job
  };

  return (
    <header className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between mb-8 p-4 bg-card rounded-lg shadow-sm">
      <h1 className="text-4xl font-bold text-primary mb-4 sm:mb-0">SnapTrack</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full sm:w-auto">Add New Job</Button>
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