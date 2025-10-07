import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddJobForm from './AddJobForm';
import { Menu, FilePlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Customer } from '@/types'; // Import Customer type

interface HeaderProps {
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string, customerId?: string) => void;
  onOpenNav: () => void;
  showAddJobButton?: boolean;
  categories: string[]; // New prop for dynamic categories
  customers: Customer[]; // New prop for customers
}

const Header: React.FC<HeaderProps> = ({ onAddJob, onOpenNav, showAddJobButton = true, categories, customers }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddJobAndClose = (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string, customerId?: string) => {
    onAddJob(title, description, startDate, deadlineDate, startTime, endTime, category, customerId);
    setIsDialogOpen(false);
  };

  return (
    <header className="w-full flex items-center justify-between mb-8 px-4 py-4 bg-card rounded-b-lg shadow-sm">
      <Button variant="ghost" size="icon" onClick={onOpenNav} className="sm:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open navigation</span>
      </Button>
      <h1 className="text-3xl font-bold text-primary flex-grow text-center sm:text-left">SnapTrack</h1>
      {showAddJobButton && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button size="icon" className="ml-auto">
                  <FilePlus className="h-5 w-5" />
                  <span className="sr-only">Add New Job</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add New Job</p>
            </TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <AddJobForm onAddJob={handleAddJobAndClose} categories={categories} customers={customers} />
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
};

export default Header;