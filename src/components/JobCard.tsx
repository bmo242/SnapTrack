import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Job, TodoItem as TodoItemType, defaultTodoTemplates } from '@/types';
import TodoItem from './TodoItem';
import { PlusCircle, CalendarIcon, Edit, Trash2, ChevronDown, ChevronUp, Clock, ListChecks } from 'lucide-react'; // Import Clock and ListChecks icon
import { format, parseISO, differenceInDays, isPast, isToday, parse } from 'date-fns'; // Import parse
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
import EditJobForm from './EditJobForm';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getCategoryColor } from '@/lib/category-colors'; // Import the new utility

interface JobCardProps {
  job: Job;
  onToggleTodo: (jobId: string, todoId: string) => void;
  onAddTemplatedTodos: (jobId: string) => void;
  onAddCustomTodo: (jobId: string, todoTitle: string) => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateJob: (updatedJob: Job) => void;
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
  const [isCollapsed, setIsCollapsed] = useState(true); // Changed to true to load collapsed

  const handleCustomTodoSubmit = () => {
    if (customTodoTitle.trim()) {
      onAddCustomTodo(job.id, customTodoTitle);
      setCustomTodoTitle('');
    }
  };

  // Calculate progress percentage and task counts
  const calculateProgressAndCounts = () => {
    let completedCount = 0;
    let totalCountable = 0;

    job.todos.forEach(todo => {
      if (todo.status !== 'not-needed') { // Exclude 'not-needed' from total countable items
        totalCountable++;
        if (todo.status === 'checked') {
          completedCount++;
        }
      }
    });

    const progress = totalCountable === 0 ? 0 : Math.round((completedCount / totalCountable) * 100);
    return { completedCount, totalCountable, progress };
  };

  const { completedCount, totalCountable, progress } = calculateProgressAndCounts();

  // Determine progress bar color
  const getProgressBarColorClass = (progressValue: number) => {
    if (progressValue === 100) return 'bg-green-500';
    if (progressValue >= 75) return 'bg-blue-500';
    if (progressValue >= 50) return 'bg-yellow-500';
    if (progressValue >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const progressBarColorClass = getProgressBarColorClass(progress);

  // Due Date Counter Logic
  const deadlineDate = job.deadlineDate ? parseISO(job.deadlineDate) : null;
  const today = new Date();
  let dueDateMessage = '';
  let dueDateColorClass = 'text-muted-foreground';

  if (deadlineDate) {
    const daysLeft = differenceInDays(deadlineDate, today);
    if (isPast(deadlineDate) && !isToday(deadlineDate)) {
      dueDateMessage = 'Overdue';
      dueDateColorClass = 'text-destructive';
    } else if (isToday(deadlineDate)) {
      dueDateMessage = 'Due Today';
    } else {
      dueDateMessage = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
    }
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      // Parse the time string (e.g., "14:30") and format it to AM/PM
      return format(parse(timeString, 'HH:mm', new Date()), 'h:mm a');
    } catch (error) {
      console.error("Error formatting time:", timeString, error);
      return timeString; // Fallback to original string if parsing fails
    }
  };

  const categoryColor = getCategoryColor(job.category);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-grow">
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>{job.description}</CardDescription>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Job</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Job</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {(job.startDate || job.deadlineDate || job.startTime || job.endTime || job.category || totalCountable > 0) && (
          <div className="mt-2 text-sm text-muted-foreground flex flex-col space-y-1">
            {job.category && (
              <div className="flex items-center">
                <span className="font-semibold mr-1">Category:</span>
                <span className={cn("w-3 h-3 rounded-full mr-1", categoryColor)}></span> {/* Color dot */}
                {job.category}
              </div>
            )}
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
                {dueDateMessage && (
                  <span className={`ml-2 font-semibold ${dueDateColorClass}`}>
                    ({dueDateMessage})
                  </span>
                )}
              </div>
            )}
            {(job.startTime || job.endTime) && (
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>
                  {job.startTime && `Start: ${formatTime(job.startTime)}`}
                  {job.startTime && job.endTime && ` - `}
                  {job.endTime && `End: ${formatTime(job.endTime)}`}
                </span>
              </div>
            )}
            {totalCountable > 0 && (
              <div className="flex items-center">
                <ListChecks className="mr-2 h-4 w-4" />
                <span>{completedCount} out of {totalCountable} tasks completed</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <Collapsible open={!isCollapsed} onOpenChange={(newOpenState) => setIsCollapsed(!newOpenState)} className="w-full">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center w-full">
              <Progress value={progress} className="w-[calc(100%-60px)]" indicatorClassName={progressBarColorClass} />
              <span className="ml-4 text-sm font-medium">{progress}%</span>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0 ml-2">
                {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="pb-4">
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
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default JobCard;