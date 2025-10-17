import Badge from '@/Components/Badge';

export default function StatusBadge({ status }) {
  const tone = status === 'done' ? 'green' : status === 'in_progress' ? 'blue' : 'gray';
  const label = status === 'in_progress' ? 'In Progress' : status === 'todo' ? 'To-do' : 'Done';
  return <Badge tone={tone}>{label}</Badge>;
}