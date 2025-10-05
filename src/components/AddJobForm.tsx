import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddJobFormProps {
  onAddJob: (title: string, description: string) => void;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onAddJob }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddJob(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full">Add Job</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddJobForm;