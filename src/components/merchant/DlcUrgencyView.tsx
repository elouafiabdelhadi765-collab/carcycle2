import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  AlertTriangle,
  Clock,
  Flame,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
  Percent,
} from 'lucide-react';

export const DlcUrgencyView: React.FC = () => {
  const {
    dlcAlerts,
    acknowledgeDlcAlert,
    resolveDlcAlert,
    applyDiscountToProduct,
    products,
    merchantUser,
    shops,
  } = useAppStore();

  const myShop = shops.find((s) => s.id === merchantUser.shopId) || shops[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-900/90 via-stone-900 to-stone-950 rounded-3xl p-6 sm:p-8 text-white space-y-2 border border-amber-800/40 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
          <Flame className="w-4 h-4 text-[#FFC940]" />
          <span>Gestionnaire d’Urgence DLC Parapharmacie</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
          Alertes DLC & Risque d’Invendus
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
          Surveillez les dates de péremption de vos stocks d'officine. Appliquez en 1 clic une remise incitative autorisée pour sauver les produits avant mise au pilon.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-900 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Palier Critique J-3</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-red-600">
            {dlcAlerts.filter((a) => a.alertType === 'J-3').length}
          </div>
          <p className="text-[11px] text-red-700">Remise recommandée : -60% à -70%</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Palier Urgent J-7</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-amber-600">
            {dlcAlerts.filter((a) => a.alertType === 'J-7').length}
          </div>
          <p className="text-[11px] text-amber-700">Remise recommandée : -50%</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Palier Préventif J-15</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-mono font-extrabold text-[#005C52]">
            {dlcAlerts.filter((a) => a.alertType === 'J-15').length}
          </div>
          <p className="text-[11px] text-emerald-700">Remise recommandée : -30% à -40%</p>
        </div>
      </div>

      {/* Alerts Queue */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">
          File d’attente des alertes actives ({dlcAlerts.length})
        </h2>

        {dlcAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 text-stone-500 text-xs space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-stone-800">Aucune alerte critique en cours</h3>
            <p>Tous les stocks de votre officine sont sous contrôle.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dlcAlerts.map((alert) => {
              const product = products.find((p) => p.id === alert.productId);
              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-sm space-y-4 ${
                    alert.alertType === 'J-3'
                      ? 'border-red-300 ring-1 ring-red-200'
                      : alert.alertType === 'J-7'
                      ? 'border-amber-300'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          alert.alertType === 'J-3'
                            ? 'bg-red-600 text-white animate-pulse'
                            : alert.alertType === 'J-7'
                            ? 'bg-amber-500 text-stone-900'
                            : 'bg-emerald-100 text-[#005C52]'
                        }`}
                      >
                        Alerte {alert.alertType} ({alert.daysRemaining} jours restants)
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        Échéance DLC : {alert.dlcDate}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500">
                      Stock en rayon :{' '}
                      <strong className="text-stone-900 font-mono">{alert.currentStock} unité(s)</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-[#005C52] font-bold uppercase tracking-wider">
                        {alert.laboName}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 mt-0.5">
                        {alert.productName}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                        <span>
                          Prix initial : <del className="font-mono">{alert.originalPrice.toFixed(2)} €</del>
                        </span>
                        <span>•</span>
                        <span>
                          Prix remisé actuel :{' '}
                          <strong className="font-mono text-[#005C52]">
                            {alert.price.toFixed(2)} € (-{alert.currentDiscountPct}%)
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Remises */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs text-stone-400 mr-1 hidden sm:inline">
                        Ajuster la remise :
                      </span>
                      <button
                        onClick={() => resolveDlcAlert(alert.id, 50)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
                      >
                        Passer à -50%
                      </button>
                      <button
                        onClick={() => resolveDlcAlert(alert.id, 70)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 rounded-xl text-xs font-bold transition-colors"
                      >
                        Passer à -70% (Flash)
                      </button>
                      <button
                        onClick={() => resolveDlcAlert(alert.id)}
                        className="px-3.5 py-1.5 bg-[#005C52] hover:bg-[#00443D] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Marquer traitée</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
