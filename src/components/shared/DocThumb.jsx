import { FileText, X } from 'lucide-react';

/** Miniatura de un documento guardado: imagen si es foto, ícono descargable si es PDF. */
export function DocThumb({ doc, className = 'w-16 h-16', onRemove }) {
  const isPdf = doc.imagen?.startsWith('data:application/pdf');
  return (
    <div className="relative flex-shrink-0">
      {isPdf ? (
        <a
          href={doc.imagen}
          download={doc.nombre || 'documento.pdf'}
          className={`${className} rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-0.5`}
        >
          <FileText size={18} className="text-slate-400" />
          <span className="text-[9px] font-semibold text-slate-400">PDF</span>
        </a>
      ) : (
        <img src={doc.imagen} alt={doc.nombre} className={`${className} object-cover rounded-lg`} />
      )}
      {onRemove && (
        <button type="button" onClick={onRemove} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
          <X size={10} className="text-white" />
        </button>
      )}
    </div>
  );
}
