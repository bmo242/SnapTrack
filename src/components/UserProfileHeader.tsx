import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfileHeader: React.FC = () => {
  // Placeholder data for user profile
  const user = {
    name: "John Doe",
    role: "Photographer",
    avatarUrl: "https://github.com/shadcn.png", // Example avatar
  };

  return (
    <div className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md">
      <Avatar className="h-16 w-16 border-2 border-white">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-sm opacity-90">{user.role}</p>
      </div>
    </div>
  );
};

export default UserProfileHeader;