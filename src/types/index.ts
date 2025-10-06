export interface TodoItem {
  id: string;
  title: string;
  status: 'empty' | 'checked' | 'not-needed' | 'unsure';
  completedAt?: string; // New field to store completion timestamp
}

export interface Job {
  id: string;
  title: string;
  description: string;
  todos: TodoItem[];
  startDate?: string; // Added for start date
  deadlineDate?: string; // Added for deadline date
  startTime?: string; // New field for start time
  endTime?: string; // New field for end time
  templatedTodosAdded?: boolean; // New flag to track if templated todos have been added
  category: string; // New field for job category
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export const defaultUser: User = {
  id: "user-1",
  name: "John Doe",
  role: "Photographer",
  avatarUrl: "https://cdn.vectorstock.com/i/500p/05/27/user-icon-silhouette-head-and-body-vector-59820527.jpg",
};

export const defaultTodoTemplates: Omit<TodoItem, 'id' | 'status' | 'completedAt'>[] = [
  { title: "Client Communication" },
  { title: "Pre-shoot Planning" },
  { title: "Equipment Check" },
  { title: "Photoshoot Execution" },
  { title: "Gallery Upload" }, // New item
  { title: "Client Selections" }, // New item
  { title: "Image Culling" },
  { title: "Photo Editing" },
  { title: "Client Proofing" },
  { title: "Final Deliverables" },
  { title: "Invoicing" },
  { title: "Backup Files" },
];

export const defaultCategories = [
  "All", // Added for filtering
  "Food Photography",
  "Corporate Portraits",
  "Commercial Photography",
  "Weddings",
  "Product Photography",
  "Other", // Option for custom categories
];