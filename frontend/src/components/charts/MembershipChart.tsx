import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MembershipData } from '../../types';

interface Props {
  data: MembershipData[];
}

const COLORS: Record<string, string> = {
  free: '#94a3b8',
  pro: '#3b82f6',
  elite: '#8b5cf6',
};

export function MembershipChart({ data }: Props) {
  const formattedData = data.map((d) => ({
    ...d,
    membership_level: d.membership_level.charAt(0).toUpperCase() + d.membership_level.slice(1),
    fill: COLORS[d.membership_level] || '#3b82f6',
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue by Membership</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="membership_level" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'total_revenue' ? `$${value.toLocaleString()}` : value,
                name === 'total_revenue' ? 'Revenue' : 'Orders',
              ]}
            />
            <Legend />
            <Bar dataKey="total_revenue" name="Revenue" fill="#3b82f6" />
            <Bar dataKey="order_count" name="Orders" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
