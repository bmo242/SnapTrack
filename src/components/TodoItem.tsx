import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TodoItem as TodoItemType } from "@/types";

interface TodoItemProps {
  todo: TodoItemType;
  onToggleComplete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete }) => {
  return (
    <div className="flex items-center space-x-2 py-1">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggleComplete(todo.id)}
      />
      <Label
        htmlFor={`todo-${todo.id}`}
        className={`text-base ${todo.completed ? "line-through text-muted-foreground" : ""}`}
      >
        {todo.text}
      </Label>
    </div>
  );
};

export default TodoItem;