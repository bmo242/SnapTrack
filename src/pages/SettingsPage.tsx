import React, { useState } from 'react';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { Separator } from '@/components/ui/separator';
import { Customer } from '@/types';
import CustomerManagement from '@/components/CustomerManagement'; // Will create this next

interface SettingsPageProps {
  customers: Customer[];
  onAddCustomer: (name: string, contactInfo?: string) => void;
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-foreground">
      <Header onAddJob={() => {}} onOpenNav={() => setIsNavOpen(true)} showAddJobButton={false} />
      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div className="w-full px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Settings</h1>

        <div className="space-y-8">
          <CustomerManagement
            customers={customers}
            onAddCustomer={onAddCustomer}
            onUpdateCustomer={onUpdateCustomer}
            onDeleteCustomer={onDeleteCustomer}
          />
          {/* Category management will go here later */}
        </div>
      </div>
      <div className="pb-8"></div>
    </div>
  );
};

export default SettingsPage;