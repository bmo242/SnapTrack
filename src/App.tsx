import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import JobsPage from "./pages/JobsPage";
import NotFound from "./pages/NotFound";
// import MobileOnlyWrapper from "./components/MobileOnlyWrapper"; // Removed MobileOnlyWrapper
import { useJobsPersistence } from '@/hooks/use-jobs-persistence';
import { v4 as uuidv4 } from 'uuid';
import { Job, TodoItem, defaultTodoTemplates } from '@/types';
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [jobs, setJobs] = useJobsPersistence();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleAddJob = (title: string, description: string, startDate?: string, deadlineDate?: string, category?: string) => {
    const newJob: Job = {
      id: uuidv4(),
      title,
      description,
      todos: [],
      startDate,
      deadlineDate,
      templatedTodosAdded: false,
      category: category || "Uncategorized",
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* MobileOnlyWrapper removed */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Overview jobs={jobs} />} />
            <Route
              path="/jobs"
              element={
                <JobsPage
                  jobs={jobs}
                  onAddJob={handleAddJob}
                  onDeleteJob={handleDeleteJob}
                  onUpdateJob={handleUpdateJob}
                  onToggleTodo={handleToggleTodo}
                  onAddTemplatedTodos={handleAddTemplatedTodos}
                  onAddCustomTodo={handleAddCustomTodo}
                />
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;