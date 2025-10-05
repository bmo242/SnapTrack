import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiStateCheckboxProps {
  status: 'empty' | 'checked' | 'not-needed' | 'unsure';
  onStatusChange: () => void;
  id: string;
}

const MultiStateCheckbox: React.FC<MultiStateCheckboxProps> = ({ status, onStatusChange, id }) => {
  const baseClasses = "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const checkedClasses = "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground";

  const renderIcon = () => {
    switch (status) {
      case 'checked':
        return <Check className="h-4 w-4 text-primary-foreground" />;
      case 'not-needed':
        return <X className="h-4 w-4 text-destructive" />;
      case 'unsure':
        return <Minus className="h-4 w-4 text-muted-foreground" />;
      case 'empty':
      default:
        return null;
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={status === 'checked'}
      data-state={status === 'checked' ? 'checked' : 'unchecked'}
      className={cn(baseClasses, checkedClasses, "flex items-center justify-center cursor-pointer")}
      onClick={onStatusChange}
      id={id}
    >
      {renderIcon()}
    </div>
  );
};

export default MultiStateCheckbox;