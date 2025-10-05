import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Job as JobType, TodoItem as TodoItemType } from "@/types";
import TodoItem from "./TodoItem";
import { PlusCircle } from "lucide-react";

interface JobCardProps {
  job: JobType;
  onToggleTodoComplete: (jobId: string, todoId: string) => void;
  onAddTodo: (jobId: string, todoText: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onToggleTodoComplete, onAddTodo }) => {
  const [newTodoText, setNewTodoText] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(job.id, newTodoText);
      setNewTodoText("");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">To-Do Items:</h3>
          {job.todos.length === 0 ? (
            <p className="text-muted-foreground">No to-do items yet. Add one below!</p>
          ) : (
            <div className="space-y-1">
              {job.todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={(todoId) => onToggleTodoComplete(job.id, todoId)}
                />
              ))}
            </div>
          )}
        </div>
        <form onSubmit={handleAddTodo} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Add a new to-do item"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobCard;