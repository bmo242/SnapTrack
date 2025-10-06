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
import { Job } from '@/types';

interface EditJobFormProps {
  job: Job;
  onSave: (updatedJob: Job) => void;
  onCancel: () => void;
}

const EditJobForm: React.FC<EditJobFormProps> = ({ job, onSave, onCancel }) => {
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [startDate, setStartDate] = useState<Date | undefined>(
    job.startDate ? parseISO(job.startDate) : undefined
  );
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(
    job.deadlineDate ? parseISO(job.deadlineDate) : undefined
  );

  useEffect(() => {
    setTitle(job.title);
    setDescription(job.description);
    setStartDate(job.startDate ? parseISO(job.startDate) : undefined);
    setDeadlineDate(job.deadlineDate ? parseISO(job.deadlineDate) : undefined);
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const updatedJob: Job = {
        ...job,
        title,
        description,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        deadlineDate: deadlineDate ? format(deadlineDate, "yyyy-MM-dd") : undefined,
      };
      onSave(updatedJob);
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
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

export default EditJobForm;