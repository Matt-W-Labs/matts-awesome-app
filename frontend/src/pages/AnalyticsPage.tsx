import { useState } from 'react';
import { RevenueChart, MembershipChart, KPICard } from '../components';
import {
  useSummary,
  useOrdersOverTime,
  useOrdersByMembership,
  useBackorderRates,
} from '../hooks';

export function AnalyticsPage() {
  const [days, setDays] = useState(30);

  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: ordersOverTime, isLoading: timeLoading } = useOrdersOverTime(days);
  const { data: ordersByMembership, isLoading: membershipLoading } = useOrdersByMembership();
  const { data: backorderRates, isLoading: backorderLoading } = useBackorderRates(10);

  const isLoading = summaryLoading || timeLoading || membershipLoading || backorderLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <div className="flex items-center space-x-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="256" height="256" rx="32" fill="#FFCC00"/>
              <path d="M68 180H44V76h24v104zm40 0H84V76h24v104zm40 0h-24V76h24v104zm40 0h-24V76h24v104zm40 0h-24V76h24v104z" fill="#FFF"/>
            </svg>
            <span className="text-xs text-gray-600 font-medium">Powered by ClickHouse</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Time Range:</label>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Customers"
          value={summary?.total_customers.toLocaleString() ?? 0}
        />
        <KPICard
          title="Total Orders"
          value={summary?.total_orders.toLocaleString() ?? 0}
        />
        <KPICard
          title="Total Revenue"
          value={`$${summary?.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}`}
        />
        <KPICard
          title="Avg Order Value"
          value={`$${summary?.avg_order_value.toFixed(2) ?? '0.00'}`}
        />
        <KPICard
          title="Backorder Rate"
          value={`${((summary?.backorder_rate ?? 0) * 100).toFixed(1)}%`}
        />
      </div>

      {/* Time Series */}
      <div className="grid grid-cols-1 gap-6">
        {ordersOverTime?.data && <RevenueChart data={ordersOverTime.data} />}
      </div>

      {/* Membership */}
      <div className="grid grid-cols-1 gap-6">
        {ordersByMembership?.data && <MembershipChart data={ordersByMembership.data} />}
      </div>

      {/* Backorder Analysis */}
      {backorderRates && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Backorder Analysis</h3>
          <p className="text-sm text-gray-600 mb-4">
            Overall backorder rate: <span className="font-semibold">{(backorderRates.overall_rate * 100).toFixed(1)}%</span>
          </p>
          {backorderRates.by_product.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backordered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {backorderRates.by_product.map((item) => (
                    <tr key={item.product}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.backorder_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.backorder_rate > 0.1 ? 'bg-red-100 text-red-800' :
                          item.backorder_rate > 0.05 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {(item.backorder_rate * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No backorders found.</p>
          )}
        </div>
      )}
    </div>
  );
}
