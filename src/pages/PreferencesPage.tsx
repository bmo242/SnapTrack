import React, { useState } from 'react';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { Separator } from '@/components/ui/separator';
import { Customer } from '@/types';
import CustomerManagement from '@/components/CustomerManagement';
import CategoryManagement from '@/components/CategoryManagement';

interface PreferencesPageProps {
  customers: Customer[];
  onAddCustomer: (companyName: string | undefined, name: string, contactInfo?: string) => void;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  categories: string[];
  onAddCategory: (name: string) => void;
  onUpdateCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
}

const PreferencesPage: React.FC<PreferencesPageProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header onAddJob={() => {}} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={false} />
      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div className="w-full px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Preferences</h1>

        <div className="space-y-8">
          <CustomerManagement
            customers={customers}
            onAddCustomer={onAddCustomer}
            onUpdateCustomer={onUpdateCustomer}
            onDeleteCustomer={onDeleteCustomer}
          />
          <Separator />
          <CategoryManagement
            categories={categories}
            onAddCategory={onAddCategory}
            onUpdateCategory={onUpdateCategory}
            onDeleteCategory={onDeleteCategory}
          />
        </div>
      </div>
      <div className="pb-8"></div>
    </div>
  );
};

export default PreferencesPage;