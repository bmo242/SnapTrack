import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Job } from '@/types'; // Import Job type
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit } from 'lucide-react';
import EditProfileForm from './EditProfileForm';
import { ThemeToggle } from './ThemeToggle';
import { format, parseISO, differenceInDays, isPast, isToday } from 'date-fns'; // Import date-fns utilities

interface UserProfileHeaderProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  jobs: Job[]; // Add jobs prop
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user, onUpdateUser, jobs }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const firstName = user.name.split(' ')[0];

  // Helper to calculate job progress (reusing logic from JobCard/ActiveProjectsCarousel)
  const calculateProgress = (job: Job) => {
    if (job.todos.length === 0) return 0;
    let completedCount = 0;
    let totalCountable = 0;
    job.todos.forEach(todo => {
      if (todo.status !== 'not-needed') {
        totalCountable++;
        if (todo.status === 'checked') {
          completedCount++;
        }
      }
    });
    if (totalCountable === 0) return 0;
    return Math.round((completedCount / totalCountable) * 100);
  };

  const getPriorityInsight = (allJobs: Job[]) => {
    const activeJobsWithDeadlines = allJobs.filter(job =>
      job.deadlineDate && calculateProgress(job) < 100 // Only active jobs with deadlines
    ).sort((a, b) => {
      const dateA = a.deadlineDate ? new Date(a.deadlineDate).getTime() : Infinity;
      const dateB = b.deadlineDate ? new Date(b.deadlineDate).getTime() : Infinity;
      return dateA - dateB;
    });

    if (activeJobsWithDeadlines.length > 0) {
      const nearestJob = activeJobsWithDeadlines[0];
      const deadline = nearestJob.deadlineDate ? parseISO(nearestJob.deadlineDate) : null;
      const today = new Date();

      if (deadline) {
        const daysLeft = differenceInDays(deadline, today);
        if (isPast(deadline) && !isToday(deadline)) {
          return `Priority: "${nearestJob.title}" is overdue!`;
        } else if (isToday(deadline)) {
          return `Priority: "${nearestJob.title}" is due today!`;
        } else if (daysLeft <= 7 && daysLeft > 0) {
          return `Priority: "${nearestJob.title}" due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`;
        } else if (daysLeft > 7) {
          return `Next deadline: "${nearestJob.title}" on ${format(deadline, 'PPP')}.`;
        }
      }
    }
    return "No urgent deadlines. Keep up the great work!";
  };

  const priorityInsight = getPriorityInsight(jobs);

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md">
      <div className="flex items-center">
        <Avatar className="h-16 w-16 border-2 border-white">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h2 className="text-xl font-bold">Hi, {firstName}!</h2>
          <p className="text-sm opacity-90">{priorityInsight}</p> {/* Display priority insight here */}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Edit className="h-5 w-5" />
                  <span className="sr-only">Edit Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <EditProfileForm currentUser={user} onUpdateUser={onUpdateUser} onClose={() => setIsEditDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Profile</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default UserProfileHeader;