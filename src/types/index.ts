export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  todos: TodoItem[];
}