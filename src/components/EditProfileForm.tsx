import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from '@/types';
import { toast } from 'sonner';

interface EditProfileFormProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ currentUser, onUpdateUser, onClose }) => {
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState(currentUser.role);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

  useEffect(() => {
    setName(currentUser.name);
    setRole(currentUser.role);
    setAvatarUrl(currentUser.avatarUrl);
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && role.trim()) {
      const updatedUser: User = {
        ...currentUser,
        name: name.trim(),
        role: role.trim(),
        avatarUrl: avatarUrl.trim() || "https://cdn.vectorstock.com/i/500p/05/27/user-icon-silhouette-head-and-body-vector-59820527.jpg", // Fallback avatar
      };
      onUpdateUser(updatedUser);
      toast.success("Profile updated successfully!");
      onClose();
    } else {
      toast.error("Name and Role cannot be empty.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <Label htmlFor="profileName">Name</Label>
        <Input
          id="profileName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
        />
      </div>
      <div>
        <Label htmlFor="profileRole">Role</Label>
        <Input
          id="profileRole"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Your Role (e.g., Photographer)"
          required
        />
      </div>
      <div>
        <Label htmlFor="profileAvatarUrl">Avatar URL</Label>
        <Input
          id="profileAvatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="URL to your avatar image"
        />
        <p className="text-sm text-muted-foreground mt-1">
          For actual image uploads, you would need a backend service.
        </p>
      </div>
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
};

export default EditProfileForm;