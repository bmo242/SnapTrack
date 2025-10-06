import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit } from 'lucide-react';
import EditProfileForm from './EditProfileForm';
import { ThemeToggle } from './ThemeToggle';

interface UserProfileHeaderProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user, onUpdateUser }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md">
      <div className="flex items-center">
        <Avatar className="h-16 w-16 border-2 border-white">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm opacity-90">{user.role}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Edit className="h-5 w-5" />
                  <span className="sr-only">Edit Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <EditProfileForm currentUser={user} onUpdateUser={onUpdateUser} onClose={() => setIsEditDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Profile</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default UserProfileHeader;