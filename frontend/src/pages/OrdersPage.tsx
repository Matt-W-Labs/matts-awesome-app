import { DataTable } from '../components';
import { useOrders, useDeleteOrder } from '../hooks';
import type { Order } from '../types';

export function OrdersPage() {
  const { data: orders, isLoading } = useOrders({ limit: 1000 });
  const deleteMutation = useDeleteOrder();

  const handleDelete = async (order: Order) => {
    if (confirm(`Delete order ${order.order_id}?`)) {
      await deleteMutation.mutateAsync(order.order_id);
    }
  };

  const columns = [
    { key: 'order_id', header: 'Order ID' },
    { key: 'product', header: 'Product' },
    {
      key: 'cost',
      header: 'Cost',
      render: (o: Order) => o.cost ? `$${o.cost.toFixed(2)}` : '-',
    },
    {
      key: 'backordered',
      header: 'Status',
      render: (o: Order) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          o.backordered ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {o.backordered ? 'Backordered' : 'Available'}
        </span>
      ),
    },
    {
      key: 'create_ts',
      header: 'Date',
      render: (o: Order) => o.create_ts ? new Date(o.create_ts).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (o: Order) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(o); }}
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
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={orders ?? []} />
      </div>
    </div>
  );
}
