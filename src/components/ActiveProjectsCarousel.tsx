import React from 'react';
import { Job } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
// Removed Button import as it's no longer used for individual project items

interface ActiveProjectsCarouselProps {
  jobs: Job[];
  onSelectJob: (jobId: string) => void; // New prop for handling job selection
}

const ActiveProjectsCarousel: React.FC<ActiveProjectsCarouselProps> = ({ jobs, onSelectJob }) => {
  const calculateProgress = (job: Job) => {
    if (job.todos.length === 0) return 0;

    let completedCount = 0;
    let totalCountable = 0;

    job.todos.forEach(todo => {
      // 'not-needed' tasks are not counted towards total progress
      if (todo.status !== 'not-needed') {
        totalCountable++;
        if (todo.status === 'checked') {
          completedCount++;
        }
      }
    });

    if (totalCountable === 0) return 0;
    return Math.round((completedCount / totalCountable) * 100);
  };

  const getProgressBarColorClass = (progressValue: number) => {
    if (progressValue === 100) return 'text-green-500'; // Changed to text- for stroke color
    if (progressValue >= 75) return 'text-blue-500';
    if (progressValue >= 50) return 'text-yellow-500';
    if (progressValue >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const activeJobs = jobs.filter(job => calculateProgress(job) < 100); // Consider jobs with less than 100% progress as active

  // Dimensions for the circular progress bar
  const radius = 36; // Radius of the circle
  const strokeWidth = 8; // Width of the stroke
  const viewBoxSize = 96; // Corresponds to w-24 h-24
  const center = viewBoxSize / 2; // Center for cx and cy
  const circumference = 2 * Math.PI * radius;

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Active Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {activeJobs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No active projects.</p>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className={cn("flex space-x-4", activeJobs.length === 1 && "justify-center")}>
              {activeJobs.map((job) => {
                const progress = calculateProgress(job);
                const progressBarColorClass = getProgressBarColorClass(progress);
                const offset = circumference - (progress / 100) * circumference;

                return (
                  <div
                    key={job.id}
                    className="flex flex-col items-center justify-center w-32 h-auto p-2 flex-shrink-0 cursor-pointer hover:bg-muted rounded-md transition-colors"
                    onClick={() => onSelectJob(job.id)}
                  >
                    <div className="relative w-24 h-24 mb-2">
                      <svg className="w-full h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
                        <circle
                          className="text-gray-200 dark:text-gray-700"
                          strokeWidth={strokeWidth}
                          stroke="currentColor"
                          fill="transparent"
                          r={radius}
                          cx={center}
                          cy={center}
                        />
                        <circle
                          className={cn("stroke-current", progressBarColorClass)}
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          fill="transparent"
                          r={radius}
                          cx={center}
                          cy={center}
                          transform={`rotate(-90 ${center} ${center})`}
                        />
                        <text
                          x="50%"
                          y="50%"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          style={{ fontSize: '1.125rem', fontWeight: 'bold', fill: 'hsl(var(--foreground))' }}
                        >
                          {progress}%
                        </text>
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-center truncate w-full">{job.title}</p>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveProjectsCarousel;