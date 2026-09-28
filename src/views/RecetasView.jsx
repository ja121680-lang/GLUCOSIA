import { useState } from 'react';
import { Star, UtensilsCrossed } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';
import { Modal } from '../components/shared/Modal';

export function RecetasView({ recipes, favorites, onSelect, onToggleFavorite }) {
  const [filter, setFilter] = useState('todas');
  const shown = filter === 'favoritas' ? recipes.filter((r) => favorites.includes(r.id)) : recipes;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setFilter('todas')} className={`flex-1 py-2 rounded-xl text-sm font-medium ${filter === 'todas' ? 'bg-yellow-400 text-slate-900' : 'bg-white text-slate-500 border border-slate-200'}`}>Todas</button>
        <button onClick={() => setFilter('favoritas')} className={`flex-1 py-2 rounded-xl text-sm font-medium ${filter === 'favoritas' ? 'bg-yellow-400 text-slate-900' : 'bg-white text-slate-500 border border-slate-200'}`}>Favoritas</button>
      </div>

      {shown.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} text="Aún no tienes recetas favoritas. Explora el catálogo y guarda las que más te gusten." />
      ) : (
        <div className="space-y-2.5">
          {shown.map((r) => {
            const isFav = favorites.includes(r.id);
            return (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(r)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(r); }}
                className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5 flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{r.nombre}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.tiempo} · {r.calorias} kcal · {r.carbohidratos} g carbs</p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); onToggleFavorite(r.id); }} className="flex-shrink-0">
                  <Star size={18} className={isFav ? 'text-yellow-400' : 'text-slate-200'} fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RecipeDetail({ recipe, isFavorite, onToggleFavorite, onClose }) {
  return (
    <Modal title={recipe.nombre} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {recipe.tags.map((tag) => <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-600">{tag}</span>)}
          </div>
          <button type="button" onClick={() => onToggleFavorite()} className="flex-shrink-0">
            <Star size={20} className={isFavorite ? 'text-yellow-400' : 'text-slate-200'} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-50 rounded-xl py-2.5">
            <p className="text-sm font-bold text-slate-900">{recipe.calorias}</p>
            <p className="text-[10px] text-slate-400">kcal</p>
          </div>
          <div className="bg-slate-50 rounded-xl py-2.5">
            <p className="text-sm font-bold text-slate-900">{recipe.carbohidratos}g</p>
            <p className="text-[10px] text-slate-400">carbs</p>
          </div>
          <div className="bg-slate-50 rounded-xl py-2.5">
            <p className="text-sm font-bold text-slate-900">{recipe.proteina}g</p>
            <p className="text-[10px] text-slate-400">proteína</p>
          </div>
          <div className="bg-slate-50 rounded-xl py-2.5">
            <p className="text-sm font-bold text-slate-900">{recipe.grasas}g</p>
            <p className="text-[10px] text-slate-400">grasas</p>
          </div>
        </div>

        <p className="text-xs text-slate-400">{recipe.tiempo} · {recipe.porciones} porciones</p>

        <div>
          <p className="font-semibold text-slate-900 text-sm mb-2">Ingredientes</p>
          <ul className="space-y-1.5">
            {recipe.ingredientes.map((ing, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900 text-sm mb-2">Preparación</p>
          <ol className="space-y-2.5">
            {recipe.instrucciones.map((step, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}
