import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { defaultCategories } from '@/types';

interface AddJobFormProps {
  onAddJob: (title: string, description: string, startDate?: string, deadlineDate?: string, startTime?: string, endTime?: string, category?: string) => void;
  initialStartDate?: Date | null; // New prop for initial start date
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onAddJob, initialStartDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate || undefined); // Initialize with prop
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState(defaultCategories[0]);
  const [customCategory, setCustomCategory] = useState('');

  // Update startDate if initialStartDate prop changes
  useEffect(() => {
    setStartDate(initialStartDate || undefined);
  }, [initialStartDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const finalCategory = category === "Other" ? customCategory.trim() : category;
      onAddJob(
        title,
        description,
        startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        deadlineDate ? format(deadlineDate, "yyyy-MM-dd") : undefined,
        startTime.trim() || undefined,
        endTime.trim() || undefined,
        finalCategory || "Uncategorized"
      );
      setTitle('');
      setDescription('');
      setStartDate(initialStartDate || undefined); // Reset to initialStartDate or undefined
      setDeadlineDate(undefined);
      setStartTime('');
      setEndTime('');
      setCategory(defaultCategories[0]);
      setCustomCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Wedding Photoshoot"
          required
        />
      </div>
      <div>
        <Label htmlFor="jobDescription">Description</Label>
        <Textarea
          id="jobDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the job"
        />
      </div>
      <div>
        <Label htmlFor="jobCategory">Category</Label>
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger id="jobCategory">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {defaultCategories.map((cat) => (
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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="startDate">Start Date</Label>
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
          <Label htmlFor="deadlineDate">Deadline Date</Label>
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
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Add Job</Button>
    </form>
  );
};

export default AddJobForm;