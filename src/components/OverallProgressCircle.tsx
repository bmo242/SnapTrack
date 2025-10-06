import React from 'react';
import { Job } from '@/types';

interface OverallProgressCircleProps {
  jobs: Job[];
}

const OverallProgressCircle: React.FC<OverallProgressCircleProps> = ({ jobs }) => {
  const calculateOverallProgress = () => {
    let totalCountableTodos = 0;
    let totalCompletedTodos = 0;

    jobs.forEach(job => {
      job.todos.forEach(todo => {
        if (todo.status !== 'not-needed') {
          totalCountableTodos++;
          if (todo.status === 'checked') {
            totalCompletedTodos++;
          }
        }
      });
    });

    if (totalCountableTodos === 0) return 0;
    return Math.round((totalCompletedTodos / totalCountableTodos) * 100);
  };

  const progress = calculateOverallProgress();
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Determine color based on overall progress
  const getCircleColorClass = (progressValue: number) => {
    if (progressValue === 100) return 'text-green-500';
    if (progressValue >= 75) return 'text-blue-500';
    if (progressValue >= 50) return 'text-yellow-500';
    if (progressValue >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const circleColorClass = getCircleColorClass(progress);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card rounded-lg shadow-sm mb-8 w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 96 96">
          {/* Background circle */}
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="48"
            cy="48"
          />
          {/* Progress circle */}
          <circle
            className={circleColorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="48"
            cy="48"
            transform="rotate(-90 48 48)"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-lg font-bold text-foreground"
          >
            {progress}%
          </text>
        </svg>
      </div>
    </div>
  );
};

export default OverallProgressCircle;