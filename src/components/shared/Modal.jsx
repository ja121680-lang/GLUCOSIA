import { X } from 'lucide-react';

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-30 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="font-bold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
