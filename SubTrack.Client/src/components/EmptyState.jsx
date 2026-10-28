export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 border border-dashed border-slate-300 rounded-lg bg-white">
      <h3 className="text-lg font-medium text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}