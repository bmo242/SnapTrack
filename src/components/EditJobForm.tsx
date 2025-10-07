import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Job, Customer } from '@/types'; // Import Customer type

interface EditJobFormProps {
  job: Job;
  onUpdateJob: (updatedJob: Job) => void;
  onClose: () => void;
  categories: string[]; // New prop for dynamic categories
  customers: Customer[]; // New prop for customers
}

const EditJobForm: React.FC<EditJobFormProps> = ({ job, onUpdateJob, onClose, categories, customers }) => {
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [startDate, setStartDate] = useState<Date | undefined>(
    job.startDate ? parseISO(job.startDate) : undefined
  );
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(
    job.deadlineDate ? parseISO(job.deadlineDate) : undefined
  );
  const [startTime, setStartTime] = useState(job.startTime || '');
  const [endTime, setEndTime] = useState(job.endTime || '');
  const [category, setCategory] = useState(job.category);
  const [customCategory, setCustomCategory] = useState(
    !categories.includes(job.category) && job.category !== "Uncategorized" ? job.category : ''
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(job.customerId); // New state for customer

  useEffect(() => {
    setTitle(job.title);
    setDescription(job.description);
    setStartDate(job.startDate ? parseISO(job.startDate) : undefined);
    setDeadlineDate(job.deadlineDate ? parseISO(job.deadlineDate) : undefined);
    setStartTime(job.startTime || '');
    setEndTime(job.endTime || '');
    // Set category, handling cases where job.category might be a custom one not in the current list
    if (categories.includes(job.category)) {
      setCategory(job.category);
      setCustomCategory('');
    } else if (job.category === "Uncategorized") {
      setCategory("Uncategorized");
      setCustomCategory('');
    } else {
      setCategory("Other");
      setCustomCategory(job.category);
    }
    setSelectedCustomerId(job.customerId);
  }, [job, categories]); // Added categories to dependency array

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const finalCategory = category === "Other" ? customCategory.trim() : category;
      const updatedJob: Job = {
        ...job,
        title,
        description,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        deadlineDate: deadlineDate ? format(deadlineDate, "yyyy-MM-dd") : undefined,
        startTime: startTime.trim() || undefined,
        endTime: endTime.trim() || undefined,
        category: finalCategory || "Uncategorized",
        customerId: selectedCustomerId === "none" ? undefined : selectedCustomerId, // Handle "No Customer" option
      };
      onUpdateJob(updatedJob);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <Label htmlFor="editJobTitle">Job Title</Label>
        <Input
          id="editJobTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Wedding Photoshoot"
          required
        />
      </div>
      <div>
        <Label htmlFor="editJobDescription">Description</Label>
        <Textarea
          id="editJobDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the job"
        />
      </div>
      <div>
        <Label htmlFor="editJobCategory">Category</Label>
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger id="editJobCategory">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.filter(cat => cat !== "All").map((cat) => ( // Filter "All" from add/edit forms
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {category === "Other" && (
          <Input
            className="mt-2"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="editCustomerSelect">Customer</Label>
        <Select onValueChange={setSelectedCustomerId} value={selectedCustomerId || "none"}>
          <SelectTrigger id="editCustomerSelect">
            <SelectValue placeholder="Select a customer (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Customer</SelectItem>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.companyName ? `${customer.companyName} (${customer.name})` : customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="editStartDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1">
          <Label htmlFor="editDeadlineDate">Deadline Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !deadlineDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadlineDate ? format(deadlineDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={deadlineDate}
                onSelect={setDeadlineDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="editStartTime">Start Time</Label>
          <Input
            id="editStartTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="editEndTime">End Time</Label>
          <Input
            id="editEndTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
};

export default EditJobForm;