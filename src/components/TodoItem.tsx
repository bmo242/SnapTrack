import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TodoItem as TodoItemType } from '@/types';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  return (
    <div className="flex items-center space-x-2 py-1">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
      />
      <Label
        htmlFor={`todo-${todo.id}`}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
          todo.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {todo.title}
      </Label>
    </div>
  );
};

export default TodoItem;