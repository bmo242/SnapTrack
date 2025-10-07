import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { getCategoryColor } from '@/lib/category-colors';
import { cn } from '@/lib/utils';

interface CategoryManagementProps {
  categories: string[];
  onAddCategory: (name: string) => void;
  onUpdateCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [editCategoryInput, setEditCategoryInput] = useState('');
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddCategoryDialogOpen(false);
      toast.success("Category added successfully!");
    } else if (categories.includes(newCategoryName.trim())) {
      toast.error("Category already exists.");
    } else {
      toast.error("Category name cannot be empty.");
    }
  };

  const handleEditCategoryClick = (categoryName: string) => {
    setEditingCategoryName(categoryName);
    setEditCategoryInput(categoryName);
    setIsEditCategoryDialogOpen(true);
  };

  const handleUpdateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategoryName && editCategoryInput.trim() && editCategoryInput.trim() !== editingCategoryName) {
      if (categories.includes(editCategoryInput.trim())) {
        toast.error("A category with this name already exists.");
        return;
      }
      onUpdateCategory(editingCategoryName, editCategoryInput.trim());
      setIsEditCategoryDialogOpen(false);
      setEditingCategoryName(null);
      toast.success("Category updated successfully!");
    } else if (editCategoryInput.trim() === editingCategoryName) {
      toast.info("No changes made to category name.");
      setIsEditCategoryDialogOpen(false);
    } else {
      toast.error("Category name cannot be empty.");
    }
  };

  // Filter out "All", "Other", and "Uncategorized" for display in management list
  const manageableCategories = categories.filter(cat => cat !== "All" && cat !== "Other" && cat !== "Uncategorized");

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Category Management</CardTitle>
        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <CardDescription>Add a new job category to your list.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategorySubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Event Photography"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Add Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="pt-4">
        {manageableCategories.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No custom categories added yet.</p>
        ) : (
          <div className="space-y-3">
            {manageableCategories.map((categoryName) => (
              <div key={categoryName} className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center space-x-3">
                  <span className={cn("w-4 h-4 rounded-full", getCategoryColor(categoryName))}></span>
                  <p className="font-medium">{categoryName}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditCategoryClick(categoryName)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit category</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete category</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the category "{categoryName}".
                          Any jobs currently assigned to this category will be moved to "Uncategorized".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteCategory(categoryName)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Category Dialog */}
        <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <CardDescription>Update category name.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateCategorySubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="editCategoryName">Category Name</Label>
                <Input
                  id="editCategoryName"
                  value={editCategoryInput}
                  onChange={(e) => setEditCategoryInput(e.target.value)}
                  placeholder="e.g., Event Photography"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;