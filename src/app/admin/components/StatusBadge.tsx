interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment' | 'stock' | 'active';
}

const statusColors: Record<string, string> = {
  // Order statuses
  pending: 'admin-badge-warning',
  confirmed: 'admin-badge-info',
  processing: 'admin-badge-info',
  shipped: 'admin-badge-primary',
  delivered: 'admin-badge-success',
  cancelled: 'admin-badge-danger',
  refunded: 'admin-badge-danger',
  // Payment statuses
  paid: 'admin-badge-success',
  failed: 'admin-badge-danger',
  // Stock
  'in-stock': 'admin-badge-success',
  'low-stock': 'admin-badge-warning',
  'out-of-stock': 'admin-badge-danger',
  // Active
  active: 'admin-badge-success',
  inactive: 'admin-badge-muted',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
  paid: 'Paid',
  failed: 'Failed',
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
  active: 'Active',
  inactive: 'Inactive',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = statusColors[status] || 'admin-badge-muted';
  const label = statusLabels[status] || status;

  return (
    <span className={`admin-badge ${colorClass}`}>
      {label}
    </span>
  );
}
