import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Store,
  ShieldCheck,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Save,
  Building,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import type { ShopHours } from '../../types';
import { signOutFromSupabase } from '../../services/supabase';

export const MerchantSettingsView: React.FC = () => {
  const { shops, merchantUser, updateShop, showToast, setRole, setActiveModal } = useAppStore();

  const myShop = shops.find((s) => s.id === merchantUser.shopId) || shops[0];

  const [name, setName] = useState(myShop.name);
  const [description, setDescription] = useState(myShop.description);
  const [address, setAddress] = useState(myShop.address);
  const [phone, setPhone] = useState(myShop.phone);
  const [email, setEmail] = useState(myShop.email);
  const [instructions, setInstructions] = useState(myShop.instructions);
  const [rppsNumber, setRppsNumber] = useState(myShop.rppsNumber);
  const [arsAgreement, setArsAgreement] = useState(myShop.arsAgreement);
  const [pharmacistName, setPharmacistName] = useState(myShop.pharmacistName);
  const [iban, setIban] = useState(myShop.bankIban || 'FR76 3000 4000 5000 6000 7000 123');
  const [hours, setHours] = useState<ShopHours[]>(myShop.hours);

  const handleHourChange = (index: number, field: keyof ShopHours, value: any) => {
    const updated = [...hours];
    updated[index] = { ...updated[index], [field]: value };
    setHours(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop(myShop.id, {
      name,
      description,
      address,
      phone,
      email,
      instructions,
      rppsNumber,
      arsAgreement,
      pharmacistName,
      bankIban: iban,
      hours,
    });
    showToast('Paramètres de l’officine mis à jour avec succès', 'success');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Plus_Jakarta_Sans']">
              Paramètres & Conformité Officine
            </h1>
            <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
              RPPS : {merchantUser.rppsNumber || myShop.rppsNumber}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Connecté en tant que <strong className="text-stone-700">{merchantUser.fullName}</strong> ({merchantUser.email}) — {myShop.name}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveModal('auth')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-[#005C52]" />
            <span>Changer de compte</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await signOutFromSupabase();
              showToast('Déconnecté de Supabase', 'info');
              setActiveModal('auth');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('client')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#005C52] hover:bg-[#00443D] text-white text-xs font-semibold transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Vue Client / Patient</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity & Legal */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm pb-2 border-b border-stone-100">
            <Building className="w-4 h-4 text-[#005C52]" />
            <span>Identité de l’Établissement</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-600 font-medium mb-1">Raison sociale / Nom de l'officine</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Pharmacien titulaire responsable</label>
              <input
                type="text"
                value={pharmacistName}
                onChange={(e) => setPharmacistName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-600 font-medium mb-1">Numéro RPPS (11 chiffres)</label>
              <input
                type="text"
                value={rppsNumber}
                onChange={(e) => setRppsNumber(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">Numéro d’agrément ARS</label>
              <input
                type="text"
                value={arsAgreement}
                onChange={(e) => setArsAgreement(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">Description publique de l'officine</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
            />
          </div>
        </div>

        {/* Contact & Click & Collect instructions */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm pb-2 border-b border-stone-100">
            <MapPin className="w-4 h-4 text-[#005C52]" />
            <span>Accès & Instructions de Retrait</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-stone-600 font-medium mb-1">Adresse postale</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium mb-1">Téléphone de l'officine</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium mb-1">Email professionnel</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">
              Instructions précises pour le retrait patient (borne, caisse prioritaire...)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
              required
            />
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm pb-2 border-b border-stone-100">
            <Clock className="w-4 h-4 text-[#005C52]" />
            <span>Horaires d’Ouverture Hebdomadaires</span>
          </div>

          <div className="space-y-2">
            {hours.map((h, idx) => (
              <div
                key={h.day}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 gap-4"
              >
                <div className="w-24 font-bold text-stone-800">{h.day}</div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                    <input
                      type="checkbox"
                      checked={h.open}
                      onChange={(e) => handleHourChange(idx, 'open', e.target.checked)}
                      className="rounded text-[#005C52]"
                    />
                    <span>Ouvert</span>
                  </label>
                </div>

                {h.open ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={h.openTime}
                      onChange={(e) => handleHourChange(idx, 'openTime', e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-stone-300 rounded text-center font-mono"
                    />
                    <span>à</span>
                    <input
                      type="text"
                      value={h.closeTime}
                      onChange={(e) => handleHourChange(idx, 'closeTime', e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-stone-300 rounded text-center font-mono"
                    />
                  </div>
                ) : (
                  <span className="text-stone-400 font-medium italic">Fermé toute la journée</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Banking Info for Revalorization Payouts */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm pb-2 border-b border-stone-100">
            <CreditCard className="w-4 h-4 text-[#005C52]" />
            <span>Compte Bancaire de Reversement Officinal (IBAN / BIC)</span>
          </div>
          <div>
            <label className="block text-stone-600 font-medium mb-1">IBAN de versement</label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-none"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Les fonds perçus lors des retraits Click & Collect sont automatiquement reversés sous 48h ouvrées.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#005C52] hover:bg-[#00443D] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#FFC940]" />
            <span>Enregistrer tous les paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );
};
