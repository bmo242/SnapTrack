export interface TodoItem {
  id: string;
  title: string;
  status: 'empty' | 'checked' | 'not-needed' | 'unsure';
}

export interface Job {
  id: string;
  title: string;
  description: string;
  todos: TodoItem[];
  startDate?: string; // Added for start date
  deadlineDate?: string; // Added for deadline date
}

export const defaultTodoTemplates: Omit<TodoItem, 'id' | 'status'>[] = [
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