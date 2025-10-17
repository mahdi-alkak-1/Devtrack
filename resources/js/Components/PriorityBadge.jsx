import Badge from '@/Components/Badge';

export default function PriorityBadge({ priority }) {
  const map = { low: 'green', medium: 'yellow', high: 'rose' };
  const tone = map[priority] || 'gray';
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);
  return <Badge tone={tone}>{label}</Badge>;
}
