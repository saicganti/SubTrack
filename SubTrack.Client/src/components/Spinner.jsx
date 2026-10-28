export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
      <div className="h-5 w-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}