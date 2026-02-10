import { useState } from 'react';
import { DataTable } from '../components';
import { useCustomers, useDeleteCustomer } from '../hooks';
import type { Customer } from '../types';

export function CustomersPage() {
  const { data: customers, isLoading } = useCustomers({ limit: 1000 });
  const deleteMutation = useDeleteCustomer();

  const handleDelete = async (customer: Customer) => {
    if (confirm(`Delete customer ${customer.name}?`)) {
      await deleteMutation.mutateAsync(customer.customer_id);
    }
  };

  const columns = [
    { key: 'customer_id', header: 'Customer ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'membership_level',
      header: 'Membership',
      render: (c: Customer) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          c.membership_level === 'elite' ? 'bg-purple-100 text-purple-800' :
          c.membership_level === 'pro' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {c.membership_level}
        </span>
      ),
    },
    {
      key: 'direct_subscription',
      header: 'Subscription',
      render: (c: Customer) => c.direct_subscription ? 'Yes' : 'No',
    },
    {
      key: 'activation_date',
      header: 'Activated',
      render: (c: Customer) => c.activation_date ? new Date(c.activation_date).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c: Customer) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(c); }}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={customers ?? []} />
      </div>
    </div>
  );
}
