import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CARECYCLE_CATEGORIES } from '../../constants/categories';
import type { ProductCategory, Product } from '../../types';
import {
  X,
  Package,
  Check,
  Plus,
  Clock,
  Barcode,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';

interface ProductFormModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  productToEdit,
  onClose,
}) => {
  const { addProduct, updateProduct, merchantUser, shops, showToast } = useAppStore();

  const myShop = shops.find((s) => s.id === merchantUser.shopId) || shops[0];

  const [name, setName] = useState(productToEdit?.name || '');
  const [laboName, setLaboName] = useState(productToEdit?.laboName || 'La Roche-Posay');
  const [category, setCategory] = useState<ProductCategory>(productToEdit?.category || 'soins_visage');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [originalPrice, setOriginalPrice] = useState(productToEdit?.originalPrice?.toString() || '15.00');
  const [price, setPrice] = useState(productToEdit?.price?.toString() || '7.50');
  const [stock, setStock] = useState(productToEdit?.stock?.toString() || '5');
  const [dlcDate, setDlcDate] = useState(productToEdit?.dlcDate || '25/05/2026');
  const [cipCode, setCipCode] = useState(productToEdit?.cipCode || '6019284');
  const [eanCode, setEanCode] = useState(productToEdit?.eanCode || '3337875777414');
  const [lotNumber, setLotNumber] = useState(productToEdit?.lotNumber || 'L2026-B');
  const [image, setImage] = useState(
    productToEdit?.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
  );

  const sampleImages = [
    { label: 'Solaire', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80' },
    { label: 'Nettoyant', url: 'https://images.unsplash.com/photo-1556228722-d0b5ed0b30ef?w=800&q=80' },
    { label: 'Micellaire', url: 'https://images.unsplash.com/photo-1608248597359-009772c1c9c7?w=800&q=80' },
    { label: 'Huile', url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&q=80' },
    { label: 'Sérum', url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80' },
    { label: 'Bébé', url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80' },
    { label: 'Compléments', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const origP = parseFloat(originalPrice) || 10;
    const antiP = parseFloat(price) || 5;
    const st = parseInt(stock) || 1;

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name,
        laboName,
        category,
        description,
        originalPrice: origP,
        price: antiP,
        stock: st,
        dlcDate,
        cipCode,
        eanCode,
        lotNumber,
        image,
      });
      showToast('Fiche produit mise à jour', 'success');
    } else {
      addProduct({
        shopId: myShop.id,
        shopName: myShop.name,
        name,
        laboName,
        category,
        description,
        originalPrice: origP,
        price: antiP,
        stock: st,
        dlcDate,
        dlcDaysLeft: 14,
        cipCode,
        eanCode,
        lotNumber,
        image,
        available: true,
        promo: true,
        maxDiscountPct: 70,
        productType: 'parapharmacie',
        isDlcShort: (origP - antiP) / origP >= 0.5,
      });
    }

    onClose();
  };

  const discountCalculated = Math.round(
    ((parseFloat(originalPrice || '0') - parseFloat(price || '0')) /
      Math.max(1, parseFloat(originalPrice || '1'))) *
      100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#005C52] text-white flex items-center justify-center">
              <Package className="w-4 h-4 text-[#FFC940]" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-sm">
                {productToEdit ? 'Modifier le Soin' : 'Nouveau Soin Anti-Gaspillage'}
              </h2>
              <p className="text-[11px] text-stone-500">Officine : {myShop.name}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Labo and Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Laboratoire / Marque</label>
              <input
                type="text"
                placeholder="Ex : Avène, La Roche-Posay, Caudalie..."
                value={laboName}
                onChange={(e) => setLaboName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Rayon / Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
              >
                {CARECYCLE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">Désignation complète du produit</label>
            <input
              type="text"
              placeholder="Ex : Anthelios UVMune 400 SPF50+ Fluide Invisible 50ml"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
              required
            />
          </div>

          <div>
            <label className="block text-stone-600 font-semibold mb-1">Description & Conseils</label>
            <textarea
              rows={2}
              placeholder="Indications dermatologiques, texture, format..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
            />
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Prix public (€)</label>
              <input
                type="number"
                step="0.05"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono text-xs focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#005C52] font-bold mb-1">Prix anti-gaspi (€)</label>
              <input
                type="number"
                step="0.05"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-[#005C52] rounded-xl font-mono font-bold text-xs focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Stock disponible</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono text-xs focus:outline-none"
                required
              />
            </div>

            <div className="col-span-3 text-right text-[11px] font-bold text-emerald-800">
              Remise appliquée au patient : -{discountCalculated}%
            </div>
          </div>

          {/* Traceability: CIP, EAN, Lot, DLC */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">Code CIP (7 ch.)</label>
              <input
                type="text"
                placeholder="6019284"
                value={cipCode}
                onChange={(e) => setCipCode(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Code EAN-13</label>
              <input
                type="text"
                placeholder="3337875..."
                value={eanCode}
                onChange={(e) => setEanCode(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">Numéro de Lot</label>
              <input
                type="text"
                placeholder="LOT-882"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-amber-900 font-bold mb-1">Échéance DLC</label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={dlcDate}
                onChange={(e) => setDlcDate(e.target.value)}
                className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl font-mono text-xs focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Photo sample choice */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="block text-stone-600 font-semibold">Choisir une image de soin</label>
            <div className="grid grid-cols-7 gap-2">
              {sampleImages.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setImage(s.url)}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer p-1 bg-stone-50 aspect-square flex items-center justify-center ${
                    image === s.url ? 'border-[#005C52] ring-2 ring-emerald-200' : 'border-stone-200'
                  }`}
                >
                  <img src={s.url} alt={s.label} className="w-full h-full object-contain mix-blend-multiply" />
                  {image === s.url && (
                    <div className="absolute top-1 right-1 bg-[#005C52] text-white rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4 border-t border-stone-100">
            <button
              type="submit"
              className="w-full py-3 bg-[#005C52] hover:bg-[#00443D] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-[#FFC940]" />
              <span>
                {productToEdit ? 'Enregistrer les modifications' : 'Mettre en vente sur CareCycle'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
