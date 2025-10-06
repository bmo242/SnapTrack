import React, { useState } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Job, TodoItem, defaultTodoTemplates, defaultCategories } from '@/types';
import Header from '@/components/Header';
import JobCard from '@/components/JobCard';
import { v4 as uuidv4 } from 'uuid';
import { Separator } from '@/components/ui/separator';
import { useJobsPersistence } from '@/hooks/use-jobs-persistence';
import OverallProgressCircle from '@/components/OverallProgressCircle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [jobs, setJobs] = useJobsPersistence();
  const [selectedCategory, setSelectedCategory] = useState("All"); // New state for category filter

  const handleAddJob = (title: string, description: string, startDate?: string, deadlineDate?: string, category?: string) => {
    const newJob: Job = {
      id: uuidv4(),
      title,
      description,
      todos: [],
      startDate,
      deadlineDate,
      templatedTodosAdded: false,
      category: category || "Uncategorized", // Assign category
    };
    setJobs((prevJobs) => [...prevJobs, newJob]);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  const handleToggleTodo = (jobId: string, todoId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              todos: job.todos.map((todo) => {
                if (todo.id === todoId) {
                  let newStatus: TodoItem['status'];
                  switch (todo.status) {
                    case 'empty':
                      newStatus = 'checked';
                      break;
                    case 'checked':
                      newStatus = 'not-needed';
                      break;
                    case 'not-needed':
                      newStatus = 'unsure';
                      break;
                    case 'unsure':
                    default:
                      newStatus = 'empty';
                      break;
                  }
                  return { ...todo, status: newStatus };
                }
                return todo;
              }),
            }
          : job
      )
    );
  };

  const handleAddTemplatedTodos = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              todos: [
                ...job.todos,
                ...defaultTodoTemplates.map((template) => ({
                  id: uuidv4(),
                  title: template.title,
                  status: 'empty',
                })),
              ],
              templatedTodosAdded: true,
            }
          : job
      )
    );
  };

  const handleAddCustomTodo = (jobId: string, todoTitle: string) => {
    if (!todoTitle.trim()) return;
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              todos: [
                ...job.todos,
                {
                  id: uuidv4(),
                  title: todoTitle,
                  status: 'empty',
                },
              ],
            }
          : job
      )
    );
  };

  const filteredJobs = selectedCategory === "All"
    ? jobs
    : jobs.filter(job => job.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header onAddJob={handleAddJob} />

      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between mb-8 p-4 bg-card rounded-lg shadow-sm">
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

      <Separator className="my-8 w-full max-w-4xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {filteredJobs.length === 0 ? (
          <p className="text-center text-lg text-muted-foreground col-span-full">
            {selectedCategory === "All"
              ? "No jobs added yet. Click 'Add New Job' to get started!"
              : `No jobs found in the '${selectedCategory}' category.`}
          </p>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onToggleTodo={handleToggleTodo}
              onAddTemplatedTodos={handleAddTemplatedTodos}
              onAddCustomTodo={handleAddCustomTodo}
              onDeleteJob={handleDeleteJob}
              onUpdateJob={handleUpdateJob}
            />
          ))
        )}
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;