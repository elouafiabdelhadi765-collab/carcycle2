import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProductFormModal } from './ProductFormModal';
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import type { Product } from '../../types';

export const MerchantProductsView: React.FC = () => {
  const {
    products,
    merchantUser,
    shops,
    toggleProductAvailable,
    deleteProduct,
    updateProduct,
    setActiveModal,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const myShop = shops.find((s) => s.id === merchantUser.shopId) || shops[0];
  const myProducts = products.filter((p) => p.shopId === myShop.id);

  const filtered = myProducts.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.laboName.toLowerCase().includes(q) ||
        p.cipCode?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Plus_Jakarta_Sans']">
            Catalogue & Stocks de l'Officine
          </h1>
          <p className="text-xs text-stone-500">
            {myProducts.length} référence(s) anti-gaspillage enregistrée(s) chez {myShop.name}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2.5 bg-[#005C52] hover:bg-[#00443D] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FFC940]" />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-stone-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 ml-2" />
        <input
          type="text"
          placeholder="Rechercher par nom, laboratoire ou code CIP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
        />
      </div>

      {/* Products Table / Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500 text-xs">
            Aucun produit ne correspond à votre recherche.
          </div>
        ) : (
          filtered.map((prod) => {
            const discountPct = Math.round(
              ((prod.originalPrice - prod.price) / prod.originalPrice) * 100
            );
            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-stone-50 border border-stone-100 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#005C52] uppercase">
                        {prod.laboName}
                      </span>
                      {prod.cipCode && (
                        <span className="text-[10px] text-stone-400 font-mono">
                          CIP {prod.cipCode}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          prod.available
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {prod.available ? 'En ligne' : 'Masqué'}
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm truncate">{prod.name}</h3>

                    <div className="flex items-center gap-3 text-stone-500">
                      <span>
                        Prix :{' '}
                        <strong className="text-[#005C52] font-mono">{prod.price.toFixed(2)} €</strong>{' '}
                        <span className="line-through text-stone-400">
                          ({prod.originalPrice.toFixed(2)} €)
                        </span>
                      </span>
                      <span>•</span>
                      <span className="text-amber-800 font-medium">
                        DLC : {prod.dlcDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                  {/* Stock adjuster */}
                  <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-xl border border-stone-200">
                    <span className="text-stone-500 text-[11px]">Stock :</span>
                    <button
                      onClick={() =>
                        updateProduct(prod.id, { stock: Math.max(0, prod.stock - 1) })
                      }
                      className="w-5 h-5 rounded bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold font-mono text-stone-800">
                      {prod.stock}
                    </span>
                    <button
                      onClick={() => updateProduct(prod.id, { stock: prod.stock + 1 })}
                      className="w-5 h-5 rounded bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Visibility toggle */}
                  <button
                    onClick={() => toggleProductAvailable(prod.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      prod.available
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-stone-200 bg-stone-50 text-stone-400 hover:bg-stone-100'
                    }`}
                    title={prod.available ? 'Masquer du rayon' : 'Rendre visible'}
                  >
                    {prod.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsFormOpen(true);
                    }}
                    className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteProduct(prod.id)}
                    className="p-2 rounded-xl border border-stone-200 hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isFormOpen && (
        <ProductFormModal
          productToEdit={editingProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};
