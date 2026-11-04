import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { QRCodeView } from '../common/QRCodeView';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CreditCard,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  Store,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import type { Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    cart,
    clientUser,
    createOrder,
    products,
    setCurrentTab,
    appliedPromo,
  } = useAppStore();

  const [phone, setPhone] = useState(clientUser.phone);
  const [pickupSlot, setPickupSlot] = useState('Dans 2 heures (au comptoir)');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrders, setConfirmedOrders] = useState<Order[] | null>(null);

  if (activeModal !== 'checkout') return null;

  // Group items by pharmacy
  const shopsInCart = Array.from(new Set(cart.map((i) => i.shopId))).map((shopId) => {
    const items = cart.filter((i) => i.shopId === shopId);
    const shopName = items[0]?.shopName || 'Pharmacie';
    return { shopId, shopName, items };
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountPct) / 100 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const generated: Order[] = [];

      // Create one order per pharmacy
      shopsInCart.forEach((sg) => {
        const orderItems = sg.items.map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.productId)!;
          return { product, quantity: cartItem.quantity };
        });

        const newOrder = createOrder({
          shopId: sg.shopId,
          items: orderItems,
          notes: notes ? `${notes} (Retrait prévu : ${pickupSlot})` : `Retrait prévu : ${pickupSlot}`,
        });
        generated.push(newOrder);
      });

      // Confetti celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#005C52', '#FFC940', '#00443D', '#E0F0E4'],
        });
      } catch {}

      setIsProcessing(false);
      setConfirmedOrders(generated);
    }, 1200);
  };

  const handleClose = () => {
    setConfirmedOrders(null);
    setActiveModal(null);
  };

  const handleGoToOrders = () => {
    handleClose();
    setCurrentTab('orders');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#005C52] text-white flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#FFC940]" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-stone-900">
                {confirmedOrders ? 'Réservation Confirmée !' : 'Validation du Retrait Click & Collect'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {confirmedOrders
                  ? 'Votre Pass Retrait est prêt pour le comptoir'
                  : 'Paiement sécurisé et réservation immédiate en pharmacie'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrders ? (
          /* Success Screen with generated QR Code and Pass */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#005C52] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
                Merci pour votre geste anti-gaspillage !
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Votre commande a été transmise à l'officine. Présentez votre Pass Retrait au comptoir dès que vous recevez la notification.
              </p>
            </div>

            {/* Passes for each pharmacy order */}
            <div className="space-y-4">
              {confirmedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-stone-50 rounded-3xl p-5 border border-stone-200 text-left space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#005C52]" />
                      <span className="font-bold text-xs text-stone-900">{ord.shopName}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#005C52] bg-[#E0F0E4] px-2.5 py-0.5 rounded-full">
                      Code : {ord.pickupCode}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <QRCodeView
                      value={ord.pickupCode}
                      size={150}
                      label="QR Code de Retrait"
                      sublabel="À scanner par le pharmacien"
                      className="shadow-sm"
                    />

                    <div className="flex-1 space-y-2 text-xs">
                      <div className="text-stone-500">
                        <strong>Lieu :</strong> {ord.shopAddress}
                      </div>
                      <div className="text-stone-500">
                        <strong>Articles réservés :</strong> {ord.itemsCount} soin(s)
                      </div>
                      <div className="text-stone-500">
                        <strong>Total réglé :</strong> {ord.total.toFixed(2)} €
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                        Ce code garantit la réservation immédiate de vos soins anti-gaspi au prix indiqué.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleGoToOrders}
              className="w-full py-3.5 bg-[#005C52] hover:bg-[#00443D] text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Accéder à mes commandes en cours</span>
              <ArrowRight className="w-4 h-4 text-[#FFC940]" />
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div className="p-6 space-y-6">
            {/* Orders Summary */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Récapitulatif des Soins & Officines
              </h3>
              {shopsInCart.map((sg) => (
                <div key={sg.shopId} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                  <div className="font-bold text-stone-900 flex items-center gap-2 mb-2">
                    <Store className="w-4 h-4 text-[#005C52]" />
                    <span>{sg.shopName}</span>
                  </div>
                  <div className="space-y-1 text-stone-600">
                    {sg.items.map((i) => (
                      <div key={i.productId} className="flex justify-between">
                        <span>{i.quantity}x {i.productName}</span>
                        <span className="font-mono font-medium">{(i.price * i.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Client Info & Pickup Slot */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Informations Patient & Retrait
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Nom du client</label>
                  <input
                    type="text"
                    disabled
                    value={clientUser.fullName}
                    className="w-full px-3 py-2 bg-stone-100 rounded-xl border border-stone-200 text-stone-700"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Téléphone de notification</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 focus:border-[#005C52] text-stone-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-600 font-medium mb-1">
                  Créneau de passage estimé en pharmacie
                </label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#005C52]"
                >
                  <option value="Dans 2 heures (au comptoir)">Dans 2 heures (retrait express)</option>
                  <option value="Aujourd'hui entre 12h et 14h">Aujourd'hui entre 12h et 14h</option>
                  <option value="Aujourd'hui entre 17h et 19h30">Aujourd'hui entre 17h et 19h30</option>
                  <option value="Demain matin (dès l'ouverture)">Demain matin (dès l'ouverture)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-600 font-medium mb-1">
                  Consigne particulière pour le pharmacien (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Je viendrai avec ma mère, sac déjà prévu..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#005C52]"
                />
              </div>
            </div>

            {/* Payment simulation */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                  <CreditCard className="w-4 h-4 text-[#005C52]" />
                  <span>Paiement sécurisé Stripe Click & Collect</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-[#005C52] font-extrabold px-2 py-0.5 rounded-full">
                  SSL 256-bit
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Le montant de <strong>{finalTotal.toFixed(2)} €</strong> est réservé. Votre commande est immédiatement préparée par l'équipe officinale.
              </p>
            </div>

            {/* Bottom Button */}
            <div className="pt-2">
              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing || !phone.trim()}
                className="w-full py-3.5 bg-[#005C52] hover:bg-[#00443D] text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-101 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Génération de votre Pass Retrait...</span>
                ) : (
                  <>
                    <span>Confirmer & Payer {finalTotal.toFixed(2)} €</span>
                    <ArrowRight className="w-4 h-4 text-[#FFC940]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
