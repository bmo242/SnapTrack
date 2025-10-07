import React from 'react';
import { Job } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, HelpCircle, Loader2 } from 'lucide-react'; // Import Loader2

interface TaskSummaryProps {
  jobs: Job[];
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ jobs }) => {
  const calculateTaskCounts = () => {
    let todo = 0;
    let checked = 0;
    let notNeeded = 0;
    let unsure = 0;
    let inProgress = 0; // New count for 'in-progress'

    jobs.forEach(job => {
      job.todos.forEach(todoItem => {
        switch (todoItem.status) {
          case 'empty':
            todo++;
            break;
          case 'checked':
            checked++;
            break;
          case 'not-needed':
            notNeeded++;
            break;
          case 'unsure':
            unsure++;
            break;
          case 'in-progress': // Increment inProgress count
            inProgress++;
            break;
        }
      });
    });

    return { todo, checked, notNeeded, unsure, inProgress };
  };

  const { todo, checked, notNeeded, unsure, inProgress } = calculateTaskCounts();

  const summaryItems = [
    { title: "To Do", count: todo, icon: <Clock className="h-5 w-5 text-blue-500" />, color: "text-blue-500" },
    { title: "In Progress", count: inProgress, icon: <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />, color: "text-orange-500" }, // New item
    { title: "Completed", count: checked, icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, color: "text-green-500" },
    { title: "Not Needed", count: notNeeded, icon: <XCircle className="h-5 w-5 text-red-500" />, color: "text-red-500" },
    { title: "Unsure", count: unsure, icon: <HelpCircle className="h-5 w-5 text-yellow-500" />, color: "text-yellow-500" },
  ];

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">My Tasks</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-md">
            {item.icon}
            <div>
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <p className="text-lg font-bold">{item.count}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskSummary;