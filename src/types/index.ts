export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  todos: TodoItem[];
}

export const defaultTodoTemplates: Omit<TodoItem, 'id' | 'completed'>[] = [
  { title: "Client Communication" },
  { title: "Pre-shoot Planning" },
  { title: "Equipment Check" },
  { title: "Photoshoot Execution" },
  { title: "Image Culling" },
  { title: "Photo Editing" },
  { title: "Client Proofing" },
  { title: "Final Deliverables" },
  { title: "Invoicing" },
  { title: "Backup Files" },
];