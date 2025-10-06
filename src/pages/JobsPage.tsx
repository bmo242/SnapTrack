import React, { useState } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Job, TodoItem, defaultTodoTemplates, defaultCategories } from '@/types';
import Header from '@/components/Header';
import JobCard from '@/components/JobCard';
import { v4 as uuidv4 } from 'uuid';
import { Separator } from '@/components/ui/separator';
import OverallProgressCircle from '@/components/OverallProgressCircle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import MobileNav from '@/components/MobileNav';
// import MobileOnlyWrapper from '@/components/MobileOnlyWrapper'; // Removed MobileOnlyWrapper import

interface JobsPageProps {
  jobs: Job[];
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateJob: (updatedJob: Job) => void;
  onToggleTodo: (jobId: string, todoId: string) => void;
  onAddTemplatedTodos: (jobId: string) => void;
  onAddCustomTodo: (jobId: string, todoTitle: string) => void;
}

const JobsPage: React.FC<JobsPageProps> = ({
  jobs,
  onAddJob,
  onDeleteJob,
  onUpdateJob,
  onToggleTodo,
  onAddTemplatedTodos,
  onAddCustomTodo,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isNavOpen, setIsNavOpen] = useState(false);

  const filteredJobs = selectedCategory === "All"
    ? jobs
    : jobs.filter(job => job.category === selectedCategory);

  return (
    // <MobileOnlyWrapper> {/* Removed MobileOnlyWrapper here */}
      <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
        <Header onAddJob={onAddJob} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={true} />
        <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

        <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-8 px-4 py-4 bg-card rounded-lg shadow-sm">
          <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
            <Label htmlFor="categoryFilter" className="sr-only">Filter by Category</Label>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger id="categoryFilter" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {defaultCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <OverallProgressCircle jobs={jobs} />
        </div>

        <Separator className="my-8 w-full px-4" />

        <div className="container mx-auto grid grid-cols-1 gap-6 px-4">
          {filteredJobs.length === 0 ? (
            <p className="text-center text-lg text-muted-foreground col-span-full">
              {selectedCategory === "All"
                ? "No jobs added yet. Click 'Add Job' to get started!"
                : `No jobs found in the '${selectedCategory}' category.`}
            </p>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onToggleTodo={onToggleTodo}
                onAddTemplatedTodos={onAddTemplatedTodos}
                onAddCustomTodo={onAddCustomTodo}
                onDeleteJob={onDeleteJob}
                onUpdateJob={onUpdateJob}
              />
            ))
          )}
        </div>

        <MadeWithDyad />
      </div>
    // </MobileOnlyWrapper>
  );
};

export default JobsPage;