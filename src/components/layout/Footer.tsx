import React, { useEffect } from 'react';
import { ShieldCheck, HeartHandshake, Leaf, Lock, CheckCircle2, Database, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Footer: React.FC = () => {
  const { supabaseStatus, initSupabaseSync } = useAppStore();

  return (
    <footer className="bg-[#1E2A28] text-stone-300 mt-20 border-t border-stone-800">
      {/* Live Supabase Connection Bar */}
      <div className="bg-[#15201E] border-b border-stone-800/80 px-4 py-2.5 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Base Supabase Connectée</span>
            </div>
            <span className="text-stone-600">•</span>
            <span className="font-mono text-[11px] text-stone-400 truncate max-w-xs sm:max-w-md">
              {supabaseStatus.url}
            </span>
            {supabaseStatus.latencyMs !== undefined && (
              <span className="text-stone-500 font-mono text-[11px]">
                ({supabaseStatus.latencyMs}ms)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {supabaseStatus.lastSyncedAt && (
              <span className="text-[11px] text-stone-500">
                Dernière synchro : {supabaseStatus.lastSyncedAt}
              </span>
            )}
            <button
              onClick={() => initSupabaseSync()}
              disabled={supabaseStatus.isSyncing}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${supabaseStatus.isSyncing ? 'animate-spin' : ''}`} />
              <span>{supabaseStatus.isSyncing ? 'Synchronisation...' : 'Re-synchroniser'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#005C52] flex items-center justify-center text-white font-extrabold text-sm">
                <span className="text-[#FFC940]">C</span>C
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                Care<span className="text-[#FFC940]">Cycle</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              La 1ère plateforme française dédiée à l’anti-gaspillage en officine et parapharmacie.
              Chaque année, des millions de soins cosmétiques et produits d’hygiène sont détruits pour simple proximité de date. Ensemble, sauvons-les.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Leaf className="w-4 h-4" />
              <span>Plus de 500g de CO₂ évités par produit sauvé</span>
            </div>
          </div>

          {/* Col 2: Engagements & Déontologie */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Cadre Pharmaceutique
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pharmacies et parapharmacies agréées ARS</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Exclusion stricte des médicaments sur ordonnance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Traçabilité des lots et codes CIP obligatoires</span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Click & Collect sécurisé au comptoir</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Catégories anti-gaspi */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Rayons & Soins
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>Dermocosmétique (La Roche-Posay, Avène, Caudalie)</li>
              <li>Soins visage & anti-imperfections</li>
              <li>Solaire haute protection SPF50+</li>
              <li>Bébé & Maternité (Mustela, liniments bio)</li>
              <li>Compléments alimentaires & micronutrition</li>
              <li>Hygiène corporelle & bucco-dentaire</li>
            </ul>
          </div>

          {/* Col 4: Villes & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Officines à Dijon & Métropole
            </h4>
            <p className="text-xs text-stone-400">
              Déploiement actif dans l’agglomération dijonnaise (Place de la Libération, Rue de la Liberté, Place Darcy, Les Halles, Toison d'Or).
            </p>
            <div className="pt-2 border-t border-stone-800 text-xs text-stone-400">
              <p className="font-medium text-stone-300">Support Officines & Patients :</p>
              <p className="text-[#FFC940]">contact@carecycle.fr</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 CareCycle France. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4">
            <span className="hover:text-stone-300 transition-colors">Mentions Légales</span>
            <span className="hover:text-stone-300 transition-colors">Charte Anti-Gaspillage</span>
            <span className="hover:text-stone-300 transition-colors">Données Personnelles & RGPD</span>
            <span className="hover:text-stone-300 transition-colors">Ordre National des Pharmaciens</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
