export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg z-40">
      {message}
    </div>
  );
}
