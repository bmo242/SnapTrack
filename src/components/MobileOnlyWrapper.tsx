import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOnlyWrapperProps {
  children: React.ReactNode;
}

const MobileOnlyWrapper: React.FC<MobileOnlyWrapperProps> = ({ children }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center bg-gray-50 dark:bg-gray-900 text-foreground">
      <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Mobile Mode Required</h2>
        <p className="text-muted-foreground mb-4">
          This application is designed for mobile devices. Please switch to a mobile device or resize your browser window to a mobile size to use it.
        </p>
        <p className="text-sm text-gray-500">
          (e.g., less than 768px width)
        </p>
      </div>
    </div>
  );
};

export default MobileOnlyWrapper;