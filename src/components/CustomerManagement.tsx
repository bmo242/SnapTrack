import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Customer } from '@/types';
import { PlusCircle, Edit, Trash2, User as UserIcon, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerManagementProps {
  customers: Customer[];
  onAddCustomer: (name: string, contactInfo?: string) => void;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerContact, setNewCustomerContact] = useState('');
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerContact, setEditCustomerContact] = useState('');
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomerName.trim()) {
      onAddCustomer(newCustomerName.trim(), newCustomerContact.trim() || undefined);
      setNewCustomerName('');
      setNewCustomerContact('');
      setIsAddCustomerDialogOpen(false);
      toast.success("Customer added successfully!");
    } else {
      toast.error("Customer name cannot be empty.");
    }
  };

  const handleEditCustomerClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditCustomerName(customer.name);
    setEditCustomerContact(customer.contactInfo || '');
    setIsEditCustomerDialogOpen(true);
  };

  const handleUpdateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer && editCustomerName.trim()) {
      onUpdateCustomer({
        ...editingCustomer,
        name: editCustomerName.trim(),
        contactInfo: editCustomerContact.trim() || undefined,
      });
      setIsEditCustomerDialogOpen(false);
      setEditingCustomer(null);
      toast.success("Customer updated successfully!");
    } else {
      toast.error("Customer name cannot be empty.");
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Customer Management</CardTitle>
        <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <CardDescription>Add a new customer to your list.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleAddCustomerSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerContact">Contact Info (Email/Phone)</Label>
                <Input
                  id="customerContact"
                  value={newCustomerContact}
                  onChange={(e) => setNewCustomerContact(e.target.value)}
                  placeholder="e.g., jane.doe@example.com"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Add Customer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="pt-4">
        {customers.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No customers added yet.</p>
        ) : (
          <div className="space-y-3">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    {customer.contactInfo && (
                      <p className="text-sm text-muted-foreground flex items-center">
                        {customer.contactInfo.includes('@') ? <Mail className="h-3 w-3 mr-1" /> : <Phone className="h-3 w-3 mr-1" />}
                        {customer.contactInfo}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditCustomerClick(customer)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit customer</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete customer</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the customer "{customer.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteCustomer(customer.id)}>
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

        {/* Edit Customer Dialog */}
        <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <CardDescription>Update customer details.</CardDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateCustomerSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="editCustomerName">Customer Name</Label>
                <Input
                  id="editCustomerName"
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="editCustomerContact">Contact Info (Email/Phone)</Label>
                <Input
                  id="editCustomerContact"
                  value={editCustomerContact}
                  onChange={(e) => setEditCustomerContact(e.target.value)}
                  placeholder="e.g., jane.doe@example.com"
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

export default CustomerManagement;