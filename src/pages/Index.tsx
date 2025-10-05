import React, { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Job as JobType, TodoItem as TodoItemType } from "@/types";
import AddJobForm from "@/components/AddJobForm";
import JobCard from "@/components/JobCard";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "@/components/ui/separator";

// Define templated to-do items
const TEMPLATED_TODOS: Omit<TodoItemType, "id" | "completed">[] = [
  { text: "Client Communication" },
  { text: "Pre-shoot Planning" },
  { text: "Equipment Check" },
  { text: "Photoshoot Execution" },
  { text: "Image Culling & Selection" },
  { text: "Photo Editing" },
  { text: "Invoicing" },
  { text: "Deliverables (Gallery, Prints, etc.)" },
  { text: "Backup Files" },
];

const Index: React.FC = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);

  const handleAddJob = (title: string, description: string) => {
    const newJob: JobType = {
      id: uuidv4(),
      title,
      description,
      todos: TEMPLATED_TODOS.map((todo) => ({
        ...todo,
        id: uuidv4(),
        completed: false,
      })),
    };
    setJobs((prevJobs) => [...prevJobs, newJob]);
  };

  const handleToggleTodoComplete = (jobId: string, todoId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              todos: job.todos.map((todo) =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
              ),
            }
          : job,
      ),
    );
  };

  const handleAddTodoToJob = (jobId: string, todoText: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              todos: [...job.todos, { id: uuidv4(), text: todoText, completed: false }],
            }
          : job,
      ),
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-50 mb-8">
          Photographer's Job To-Do List
        </h1>

        <AddJobForm onAddJob={handleAddJob} />

        <Separator />

        <div className="space-y-6">
          {jobs.length === 0 ? (
            <p className="text-center text-xl text-gray-600 dark:text-gray-400">
              No jobs added yet. Start by adding your first photoshoot!
            </p>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onToggleTodoComplete={handleToggleTodoComplete}
                onAddTodo={handleAddTodoToJob}
              />
            ))
          )}
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;