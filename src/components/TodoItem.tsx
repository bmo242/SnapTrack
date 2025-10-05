import React from 'react';
import { Label } from "@/components/ui/label";
import { TodoItem as TodoItemType } from '@/types';
import MultiStateCheckbox from './MultiStateCheckbox'; // Import the new component

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  const isCompleted = todo.status === 'checked';

  return (
    <div className="flex items-center space-x-2 py-1">
      <MultiStateCheckbox
        id={`todo-${todo.id}`}
        status={todo.status}
        onStatusChange={() => onToggle(todo.id)}
      />
      <Label
        htmlFor={`todo-${todo.id}`}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
          isCompleted ? "line-through text-muted-foreground" : ""
        }`}
      >
        {todo.title}
      </Label>
    </div>
  );
};

export default TodoItem;