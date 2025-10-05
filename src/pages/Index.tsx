import React, { useState } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Job, TodoItem, defaultTodoTemplates } from '@/types';
import AddJobForm from '@/components/AddJobForm';
import JobCard from '@/components/JobCard';
import { v4 as uuidv4 } from 'uuid';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleAddJob = (title: string, description: string) => {
    const newJob: Job = {
      id: uuidv4(),
      title,
      description,
      todos: [],
    };
    setJobs((prevJobs) => [...prevJobs, newJob]);
  };

  const handleToggleTodo = (jobId: string, todoId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              todos: job.todos.map((todo) =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
              ),
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
                  completed: false,
                })),
              ],
            }
          : job
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 text-foreground">
      <h1 className="text-4xl font-bold mb-8 text-center">Photographer's Job List</h1>

      <div className="w-full max-w-md mb-8">
        <AddJobForm onAddJob={handleAddJob} />
      </div>

      <Separator className="my-8 w-full max-w-2xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {jobs.length === 0 ? (
          <p className="text-center text-lg text-muted-foreground col-span-full">
            No jobs added yet. Create your first job above!
          </p>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onToggleTodo={handleToggleTodo}
              onAddTemplatedTodos={handleAddTemplatedTodos}
            />
          ))
        )}
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;