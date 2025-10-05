import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job, TodoItem as TodoItemType, defaultTodoTemplates } from '@/types';
import TodoItem from './TodoItem';
import { PlusCircle, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
  onToggleTodo: (jobId: string, todoId: string) => void;
  onAddTemplatedTodos: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onToggleTodo, onAddTemplatedTodos }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.description}</CardDescription>
        {(job.startDate || job.deadlineDate) && (
          <div className="mt-2 text-sm text-muted-foreground flex flex-col space-y-1">
            {job.startDate && (
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Start: {job.startDate}</span>
              </div>
            )}
            {job.deadlineDate && (
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Deadline: {job.deadlineDate}</span>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddTemplatedTodos(job.id)}
          className="w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Templated To-Dos
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobCard;