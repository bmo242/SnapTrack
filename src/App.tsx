import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import JobsPage from "./pages/JobsPage";
import CalendarPage from "./pages/CalendarPage";
import TimerPage from "./pages/TimerPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { useJobsPersistence } from '@/hooks/use-jobs-persistence';
import { useUserPersistence } from '@/hooks/use-user-persistence';
import { useCustomersPersistence } from '@/hooks/use-customers-persistence';
import { useCategoriesPersistence } from '@/hooks/use-categories-persistence'; // Import new hook
import { v4 as uuidv4 } from 'uuid';
import { Job, TodoItem, defaultTodoTemplates, User, Customer } from '@/types';
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [jobs, setJobs] = useJobsPersistence();
  const [user, setUser] = useUserPersistence();
  const [customers, setCustomers] = useCustomersPersistence();
  const [categories, setCategories] = useCategoriesPersistence(); // Initialize category persistence

  const handleAddJob = (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string, customerId?: string) => {
    const newJob: Job = {
      id: uuidv4(),
      title,
      description,
      todos: [],
      startDate,
      deadlineDate,
      startTime,
      endTime,
      templatedTodosAdded: false,
      category: category || "Uncategorized",
      customerId,
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
                  let newCompletedAt: string | undefined = todo.completedAt;

                  switch (todo.status) {
                    case 'empty':
                      newStatus = 'in-progress';
                      newCompletedAt = undefined;
                      break;
                    case 'in-progress':
                      newStatus = 'checked';
                      newCompletedAt = new Date().toISOString();
                      break;
                    case 'checked':
                      newStatus = 'not-needed';
                      newCompletedAt = undefined;
                      break;
                    case 'not-needed':
                      newStatus = 'unsure';
                      newCompletedAt = undefined;
                      break;
                    case 'unsure':
                    default:
                      newStatus = 'empty';
                      newCompletedAt = undefined;
                      break;
                  }
                  return { ...todo, status: newStatus, completedAt: newCompletedAt };
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
                  completedAt: undefined,
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
                  completedAt: undefined,
                },
              ],
            }
          : job
      )
    );
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleAddCustomer = (name: string, contactInfo?: string) => {
    const newCustomer: Customer = {
      id: uuidv4(),
      name,
      contactInfo,
    };
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== customerId));
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.customerId === customerId ? { ...job, customerId: undefined } : job
      )
    );
  };

  const handleAddCategory = (name: string) => {
    setCategories((prevCategories) => [...prevCategories, name]);
  };

  const handleUpdateCategory = (oldName: string, newName: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) => (cat === oldName ? newName : cat))
    );
    // Update all jobs that use the old category name
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.category === oldName ? { ...job, category: newName } : job
      )
    );
  };

  const handleDeleteCategory = (name: string) => {
    setCategories((prevCategories) => prevCategories.filter((cat) => cat !== name));
    // Update all jobs that use the deleted category to "Uncategorized"
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.category === name ? { ...job, category: "Uncategorized" } : job
      )
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Overview jobs={jobs} user={user} onUpdateUser={handleUpdateUser} onAddJob={handleAddJob} />} />
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
                  categories={categories} // Pass categories to JobsPage
                />
              }
            />
            <Route
              path="/calendar"
              element={
                <CalendarPage
                  jobs={jobs}
                  onAddJob={handleAddJob}
                  onToggleTodo={handleToggleTodo}
                  categories={categories} // Pass categories to CalendarPage
                />
              }
            />
            <Route
              path="/timer"
              element={
                <TimerPage
                  jobs={jobs}
                  onAddJob={handleAddJob}
                  onToggleTodo={handleToggleTodo}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  customers={customers}
                  onAddCustomer={handleAddCustomer}
                  onUpdateCustomer={handleUpdateCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
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