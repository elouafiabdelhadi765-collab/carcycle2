import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { QRCodeView } from '../common/QRCodeView';
import {
  ShoppingBag,
  Store,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  MapPin,
  ChevronRight,
  XCircle,
  FileText,
  Calendar,
} from 'lucide-react';
import type { OrderStatus, Order } from '../../types';

export const ClientOrdersView: React.FC = () => {
  const { orders, cancelOrder, setSelectedShopId, setCurrentTab } = useAppStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status visual map
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Enregistrée
          </span>
        );
      case 'preparing':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            En préparation
          </span>
        );
      case 'ready':
        return (
          <span className="bg-emerald-100 text-[#005C52] text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-300 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Prête au comptoir !
          </span>
        );
      case 'completed':
        return (
          <span className="bg-stone-100 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Retirée
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Annulée
          </span>
        );
    }
  };

  const activeOrders = orders.filter((o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready');
  const pastOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F0E4] text-[#005C52] text-xs font-semibold">
          <ShoppingBag className="w-4 h-4 text-[#005C52]" />
          <span>Suivi de vos réservations Click & Collect</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Plus_Jakarta_Sans']">
          Mes Commandes & Pass Retrait
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Présentez votre QR Code ou votre numéro de commande au comptoir de votre pharmacie pour retirer vos soins.
        </p>
      </div>

      {/* Active Orders Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <span>Commandes en cours</span>
          <span className="text-xs bg-[#E0F0E4] text-[#005C52] px-2.5 py-0.5 rounded-full font-bold">
            {activeOrders.length}
          </span>
        </h2>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500 text-xs space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto text-stone-300" />
            <p>Aucune réservation en cours pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  {/* Pharmacy and Status Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#005C52] font-bold">
                        <Store className="w-3.5 h-3.5" />
                        <span>{ord.shopName}</span>
                      </div>
                      <h3 className="font-mono text-base font-extrabold text-stone-900 mt-0.5">
                        Commande #{ord.orderCode}
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        Passée le {new Date(ord.createdAt).toLocaleDateString('fr-FR')} à{' '}
                        {new Date(ord.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div>{getStatusBadge(ord.status)}</div>
                  </div>

                  {/* QR Code Pass Box */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                    <QRCodeView
                      value={ord.pickupCode}
                      size={120}
                      label="Pass Retrait"
                      className="border-none p-0 bg-transparent shadow-none"
                    />

                    <div className="flex-1 space-y-1.5 text-xs">
                      <div className="text-stone-700">
                        <span className="font-semibold text-stone-900">Adresse de retrait :</span>
                        <div className="text-stone-500">{ord.shopAddress}</div>
                      </div>
                      <div className="text-stone-700">
                        <span className="font-semibold text-stone-900">Articles :</span>
                        <div className="text-stone-500">{ord.itemsCount} soin(s) anti-gaspi</div>
                      </div>
                      <div className="text-stone-700">
                        <span className="font-semibold text-stone-900">Total :</span>
                        <div className="font-mono font-bold text-[#005C52]">{ord.total.toFixed(2)} €</div>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="font-bold text-stone-800 text-[11px] uppercase tracking-wider">
                      Détail des soins :
                    </div>
                    {ord.items.map((i) => (
                      <div key={i.id} className="flex justify-between items-center py-1 border-b border-stone-50">
                        <span className="truncate pr-2">
                          {i.qty}x {i.name}
                        </span>
                        <span className="font-mono font-medium whitespace-nowrap">
                          {(i.price * i.qty).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>

                  {ord.notes && (
                    <div className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg italic">
                      Note : {ord.notes}
                    </div>
                  )}
                </div>

                {/* Footer action */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                  {ord.status === 'new' && (
                    <button
                      onClick={() => cancelOrder(ord.id)}
                      className="text-stone-400 hover:text-red-600 font-semibold transition-colors"
                    >
                      Annuler la commande
                    </button>
                  )}
                  <div className="ml-auto flex items-center gap-1.5 text-[#005C52] font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>À présenter au comptoir</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Orders Section */}
      <div className="space-y-4 pt-6 border-t border-stone-200">
        <h2 className="text-lg font-bold text-stone-900">Historique des commandes</h2>

        {pastOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-stone-200 text-stone-500 text-xs">
            Aucune commande passée dans l'historique.
          </div>
        ) : (
          <div className="space-y-3">
            {pastOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">#{ord.orderCode}</span>
                    <span className="text-stone-400">•</span>
                    <span className="font-medium text-stone-700">{ord.shopName}</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-500">
                      {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <p className="text-stone-500">
                    {ord.itemsCount} article(s) • Total : <strong className="font-mono text-stone-800">{ord.total.toFixed(2)} €</strong>
                    {ord.savingsTotal && (
                      <span className="text-emerald-700 ml-2">
                        (Économies : +{ord.savingsTotal.toFixed(2)} €)
                      </span>
                    )}
                  </p>

                  {ord.pickedUpAt && (
                    <p className="text-[11px] text-emerald-800">
                      ✓ Retiré en officine le {new Date(ord.pickedUpAt).toLocaleDateString('fr-FR')} auprès de {ord.pickedUpBy || 'votre pharmacien'}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(ord.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
