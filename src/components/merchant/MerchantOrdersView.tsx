import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  User,
  Package,
  Calendar,
  Check,
  QrCode,
} from 'lucide-react';
import type { OrderStatus } from '../../types';

export const MerchantOrdersView: React.FC = () => {
  const { orders, merchantUser, shops, updateOrderStatus, setActiveModal } = useAppStore();

  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const myShop = shops.find((s) => s.id === merchantUser.shopId) || shops[0];
  const myOrders = orders.filter((o) => o.shopId === myShop.id);

  const filteredOrders = myOrders.filter((o) => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const counts = {
    all: myOrders.length,
    new: myOrders.filter((o) => o.status === 'new').length,
    preparing: myOrders.filter((o) => o.status === 'preparing').length,
    ready: myOrders.filter((o) => o.status === 'ready').length,
    completed: myOrders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Plus_Jakarta_Sans']">
            Commandes & Retraits Click & Collect
          </h1>
          <p className="text-xs text-stone-500">
            Gestion des réservations comptoir à {myShop.name}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('validation-retrait')}
          className="px-4 py-2.5 bg-[#005C52] hover:bg-[#00443D] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <QrCode className="w-4 h-4 text-[#FFC940]" />
          <span>Saisir Pass Retrait (#CC-XXXX)</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { key: 'all', label: 'Toutes les commandes', count: counts.all },
          { key: 'new', label: 'Nouvelles', count: counts.new },
          { key: 'preparing', label: 'En préparation', count: counts.preparing },
          { key: 'ready', label: 'Prêtes au comptoir', count: counts.ready },
          { key: 'completed', label: 'Retirées', count: counts.completed },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
              filter === tab.key
                ? 'bg-[#005C52] text-white border-[#005C52] shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === tab.key ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-500 text-xs">
            Aucune commande dans cette catégorie.
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-sm text-[#005C52] bg-[#E0F0E4] px-2.5 py-1 rounded-lg">
                    Pass Retrait : {ord.pickupCode}
                  </span>
                  <span className="text-stone-400 font-mono">Ref #{ord.orderCode}</span>
                </div>

                <div className="flex items-center gap-3 text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {new Date(ord.createdAt).toLocaleDateString('fr-FR')} à{' '}
                    {new Date(ord.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Client details & items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Patient & Coordonnées
                  </span>
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-[#005C52]" />
                    <span>{ord.clientName}</span>
                  </div>
                  <div className="text-stone-600 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{ord.clientPhone}</span>
                  </div>
                  {ord.notes && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg">
                      Note patient : {ord.notes}
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Panier Soins Anti-Gaspillage ({ord.itemsCount} unités)
                  </span>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {ord.items.map((i) => (
                      <div key={i.id} className="flex justify-between items-center text-stone-800">
                        <span className="truncate pr-2 font-medium">
                          {i.qty}x {i.name}
                        </span>
                        <span className="font-mono text-stone-600 shrink-0">
                          {(i.price * i.qty).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                    <span>Total réglé par le patient :</span>
                    <span className="font-mono text-[#005C52] text-sm">{ord.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-stone-500">
                  Statut :{' '}
                  <strong className="text-stone-900 capitalize font-medium">
                    {ord.status === 'new'
                      ? 'Nouvelle réservation'
                      : ord.status === 'preparing'
                      ? 'En préparation au préparatoire'
                      : ord.status === 'ready'
                      ? 'Prête au comptoir'
                      : 'Retirée'}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  {ord.status === 'new' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'preparing')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition-colors"
                    >
                      Mettre en préparation
                    </button>
                  )}

                  {ord.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'ready')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
                    >
                      Prête au comptoir !
                    </button>
                  )}

                  {ord.status === 'ready' && (
                    <button
                      onClick={() => setActiveModal('validation-retrait')}
                      className="px-4 py-2 bg-[#005C52] hover:bg-[#00443D] text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#FFC940]" />
                      <span>Valider le Retrait Comptoir</span>
                    </button>
                  )}

                  {ord.status === 'completed' && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      Retiré {ord.pickedUpAt ? `le ${new Date(ord.pickedUpAt).toLocaleDateString('fr-FR')}` : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
