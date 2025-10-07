import React, { useState } from 'react';
import { Job, TodoItem } from '@/types'; // Removed defaultTodoTemplates, defaultCategories
import Header from '@/components/Header';
import JobCard from '@/components/JobCard';
import { v4 as uuidv4 } from 'uuid';
import { Separator } from '@/components/ui/separator';
import OverallProgressCircle from '@/components/OverallProgressCircle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import MobileNav from '@/components/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer } from '@/types'; // Import Customer type

interface JobsPageProps {
  jobs: Job[];
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string, customerId?: string) => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateJob: (updatedJob: Job) => void;
  onToggleTodo: (jobId: string, todoId: string) => void;
  onAddTemplatedTodos: (jobId: string) => void;
  onAddCustomTodo: (jobId: string, todoTitle: string) => void;
  categories: string[]; // New prop for dynamic categories
  customers: Customer[]; // New prop for customers
}

const JobsPage: React.FC<JobsPageProps> = ({
  jobs,
  onAddJob,
  onDeleteJob,
  onUpdateJob,
  onToggleTodo,
  onAddTemplatedTodos,
  onAddCustomTodo,
  categories, // Destructure categories
  customers, // Destructure customers
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isNavOpen, setIsNavOpen] = useState(false);

  const filterCategories = ["All", ...categories.filter(cat => cat !== "Other" && cat !== "Uncategorized"), "Other", "Uncategorized"];

  const filteredJobs = selectedCategory === "All"
    ? jobs
    : jobs.filter(job => job.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header onAddJob={onAddJob} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={true} categories={categories} customers={customers} />
      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div className="w-full px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-6">My Jobs</h1>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex-1 w-full sm:w-auto">
            <Label htmlFor="categoryFilter" className="sr-only">Filter by Category</Label>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger id="categoryFilter" className="w-full sm:max-w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {filterCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card className="flex-shrink-0 w-full sm:w-auto">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-semibold text-center">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-4 pt-0">
              <OverallProgressCircle jobs={jobs} />
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 w-full" />

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
                categories={categories} // Pass categories to JobCard
                customers={customers} // Pass customers to JobCard
              />
            ))
          )}
        </div>
      </div>
      <div className="pb-8"></div>
    </div>
  );
};

export default JobsPage;