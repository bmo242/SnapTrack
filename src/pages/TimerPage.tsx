import React, { useState, useEffect, useRef } from 'react';
import { Job, TodoItem } from '@/types';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface TimerPageProps {
  jobs: Job[];
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => void;
  onToggleTodo: (jobId: string, todoId: string) => void;
}

const TimerPage: React.FC<TimerPageProps> = ({ jobs, onAddJob, onToggleTodo }) => {
  const [elapsedTime, setElapsedTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0); // To store the start time of the current interval

  const selectedJob = jobs.find(job => job.id === selectedJobId);
  const selectedTodo = selectedJob?.todos.find(todo => todo.id === selectedTodoId);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime; // Adjust start time for accurate elapsed time
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10); // Update every 10 milliseconds for millisecond accuracy
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, elapsedTime]); // Added elapsedTime to dependencies to re-evaluate interval on pause/resume

  const formatTime = (totalMilliseconds: number) => {
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((totalMilliseconds % 1000) / 10); // Display two digits for milliseconds

    return [hours, minutes, seconds]
      .map(unit => String(unit).padStart(2, '0'))
      .join(':') + `.${String(milliseconds).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (!selectedJobId || !selectedTodoId) {
      toast.error("Please select a job and a task to start the timer.");
      return;
    }
    setIsRunning((prev) => !prev);
    if (!isRunning) {
      toast.info(`Timer started for "${selectedTodo?.title}" in "${selectedJob?.title}"`);
    } else {
      toast.info(`Timer paused for "${selectedTodo?.title}"`);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    toast.info("Timer reset.");
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    setSelectedTodoId(null); // Reset todo selection when job changes
    setIsRunning(false); // Pause timer if running
    setElapsedTime(0); // Reset timer when job changes
  };

  const handleTodoSelect = (todoId: string) => {
    setSelectedTodoId(todoId);
    setIsRunning(false); // Pause timer if running
    setElapsedTime(0); // Reset timer when todo changes
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header onAddJob={onAddJob} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={false} />
      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div className="w-full px-4 py-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Task Timer</h1>

        <Card className="mb-6 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-extrabold tracking-tight">
              {formatTime(elapsedTime)}
            </CardTitle>
            <CardDescription className="mt-2">
              {selectedJob && selectedTodo ? (
                <>
                  Timing: <span className="font-semibold text-primary">{selectedTodo.title}</span> from <span className="font-semibold text-primary">{selectedJob.title}</span>
                </>
              ) : (
                "Select a job and task to begin"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center space-x-4">
            <Button onClick={handleStartPause} disabled={!selectedJobId || !selectedTodoId}>
              {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={elapsedTime === 0}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Select Task to Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="job-select">Job</Label>
              <Select onValueChange={handleJobSelect} value={selectedJobId || ""}>
                <SelectTrigger id="job-select">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.length === 0 ? (
                    <SelectItem value="no-jobs" disabled>No jobs available</SelectItem>
                  ) : (
                    jobs.map(job => (
                      <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedJob && (
              <div>
                <Label htmlFor="todo-select">Task</Label>
                <Select onValueChange={handleTodoSelect} value={selectedTodoId || ""}>
                  <SelectTrigger id="todo-select">
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedJob.todos.length === 0 ? (
                      <SelectItem value="no-todos" disabled>No tasks for this job</SelectItem>
                    ) : (
                      selectedJob.todos.map(todo => (
                        <SelectItem key={todo.id} value={todo.id}>{todo.title}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="pb-8"></div>
    </div>
  );
};

export default TimerPage;