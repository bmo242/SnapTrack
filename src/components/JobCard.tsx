import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Job, TodoItem as TodoItemType, defaultTodoTemplates } from '@/types';
import TodoItem from './TodoItem';
import { PlusCircle, CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditJobForm from './EditJobForm'; // Import the new EditJobForm

interface JobCardProps {
  job: Job;
  onToggleTodo: (jobId: string, todoId: string) => void;
  onAddTemplatedTodos: (jobId: string) => void;
  onAddCustomTodo: (jobId: string, todoTitle: string) => void;
  onDeleteJob: (jobId: string) => void; // New prop for deleting jobs
  onUpdateJob: (updatedJob: Job) => void; // New prop for updating jobs
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onToggleTodo,
  onAddTemplatedTodos,
  onAddCustomTodo,
  onDeleteJob,
  onUpdateJob,
}) => {
  const [customTodoTitle, setCustomTodoTitle] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleCustomTodoSubmit = () => {
    if (customTodoTitle.trim()) {
      onAddCustomTodo(job.id, customTodoTitle);
      setCustomTodoTitle('');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>{job.description}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Job</DialogTitle>
                </DialogHeader>
                <EditJobForm job={job} onUpdateJob={onUpdateJob} onClose={() => setIsEditDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your job
                    and all associated to-do items.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteJob(job.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {(job.startDate || job.deadlineDate) && (
          <div className="mt-2 text-sm text-muted-foreground flex flex-col space-y-1">
            {job.startDate && (
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Start: {format(parseISO(job.startDate), "PPP")}</span>
              </div>
            )}
            {job.deadlineDate && (
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Deadline: {format(parseISO(job.deadlineDate), "PPP")}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">To-Do List:</h3>
        {job.todos.length === 0 ? (
          <p className="text-muted-foreground text-sm mb-2">No to-do items yet. Add some!</p>
        ) : (
          <div className="space-y-1 mb-4">
            {job.todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={(todoId) => onToggleTodo(job.id, todoId)} />
            ))}
          </div>
        )}

        {!job.templatedTodosAdded ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddTemplatedTodos(job.id)}
            className="w-full mb-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project Extras
          </Button>
        ) : (
          <div className="flex space-x-2 mb-2">
            <Input
              placeholder="Add custom to-do"
              value={customTodoTitle}
              onChange={(e) => setCustomTodoTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCustomTodoSubmit();
                }
              }}
            />
            <Button onClick={handleCustomTodoSubmit} size="sm">
              Add
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;