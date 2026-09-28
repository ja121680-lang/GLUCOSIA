export function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <Icon size={24} className="text-slate-400" />
      </div>
      <p className="text-sm text-slate-400 max-w-[220px]">{text}</p>
    </div>
  );
}
