import React from 'react';
import { Job } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Import Button component

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
    if (progressValue === 100) return 'bg-green-500';
    if (progressValue >= 75) return 'bg-blue-500';
    if (progressValue >= 50) return 'bg-yellow-500';
    if (progressValue >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const activeJobs = jobs.filter(job => calculateProgress(job) < 100); // Consider jobs with less than 100% progress as active

  // Updated dimensions for a larger circular progress bar
  const radius = 36; // Radius of the circle
  const strokeWidth = 8; // Width of the stroke
  const viewBoxSize = 96; // Corresponds to w-24 h-24
  const center = viewBoxSize / 2; // Center for cx and cy

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
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (progress / 100) * circumference;

                return (
                  <Button
                    key={job.id}
                    variant="ghost"
                    className="flex flex-col items-center justify-center w-32 h-auto p-2 flex-shrink-0" // Adjusted button width
                    onClick={() => onSelectJob(job.id)}
                  >
                    <div className="relative w-24 h-24 mb-2"> {/* Increased container size to w-24 h-24 */}
                      <svg className="w-full h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}> {/* Updated viewBox */}
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
                          className="text-lg font-bold text-foreground" // Increased text size
                        >
                          {progress}%
                        </text>
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-center truncate w-full">{job.title}</p>
                  </Button>
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