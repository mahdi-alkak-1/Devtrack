export default function StatCard({ label, value, accent }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />
      <div className="p-5">
        <div className="text-sm text-gray-600">{label}</div>
        <div className="mt-1 text-3xl font-semibold">{value}</div>
      </div>
    </div>
  );
}