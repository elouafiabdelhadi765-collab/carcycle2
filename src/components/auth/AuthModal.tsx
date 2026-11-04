import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  signInWithSupabase,
  signUpWithSupabase,
  signOutFromSupabase,
} from '../../services/supabase';
import {
  X,
  User,
  Store,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DEFAULT_CLIENT_USER, DEFAULT_MERCHANT_USER } from '../../data/initialData';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    activeModal,
    setActiveModal,
    role,
    setRole,
    clientUser,
    merchantUser,
    updateClientUser,
    updateMerchantUser,
    showToast,
  } = useAppStore();

  const isModalOpen = isOpen !== undefined ? isOpen : activeModal === 'auth';

  const [authRole, setAuthRole] = useState<'client' | 'merchant'>(role);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [rppsNumber, setRppsNumber] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isModalOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (onClose) {
      onClose();
    } else {
      setActiveModal(null);
    }
  };

  // Demo 1-click login
  const handleDemoLogin = (targetRole: 'client' | 'merchant') => {
    setRole(targetRole);
    if (targetRole === 'client') {
      updateClientUser(DEFAULT_CLIENT_USER);
      showToast(`Connecté en tant que Patient (${DEFAULT_CLIENT_USER.fullName})`, 'success');
    } else {
      updateMerchantUser(DEFAULT_MERCHANT_USER);
      showToast(`Connecté à l'Espace Officine (${DEFAULT_MERCHANT_USER.fullName})`, 'success');
    }
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (authMode === 'signin') {
        // Direct Supabase authentication
        const { data, error } = await signInWithSupabase(email, password);

        if (error) {
          // If Supabase returns error, display friendly message
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('Identifiants incorrects. Vérifiez votre email et mot de passe.');
          } else if (error.message.includes('Email not confirmed')) {
            setErrorMessage('Votre email n’a pas encore été confirmé par le lien reçu.');
          } else {
            setErrorMessage(error.message || 'Erreur lors de la connexion à la base Supabase.');
          }
          setIsLoading(false);
          return;
        }

        // Successfully authenticated with Supabase
        const user = data.user;
        const userRole = (user?.user_metadata?.role as 'client' | 'merchant') || authRole;
        setRole(userRole);

        if (userRole === 'merchant') {
          updateMerchantUser({
            id: user.id,
            email: user.email || email,
            fullName: user.user_metadata?.full_name || email.split('@')[0],
            shopName: user.user_metadata?.shop_name || 'Pharmacie Partenaire',
            rppsNumber: user.user_metadata?.rpps_number || '10004928192',
          });
          showToast('Connexion pharmacien réussie avec Supabase !', 'success');
        } else {
          updateClientUser({
            id: user.id,
            email: user.email || email,
            fullName: user.user_metadata?.full_name || email.split('@')[0],
            phone: user.user_metadata?.phone || '',
          });
          showToast('Connexion patient réussie avec Supabase !', 'success');
        }

        handleClose();
      } else {
        // Sign Up with Supabase
        const { data, error } = await signUpWithSupabase(email, password, {
          fullName: fullName || email.split('@')[0],
          role: authRole,
          phone,
          shopName: authRole === 'merchant' ? shopName : undefined,
          rppsNumber: authRole === 'merchant' ? rppsNumber : undefined,
        });

        if (error) {
          setErrorMessage(error.message || "Erreur lors de l'inscription.");
          setIsLoading(false);
          return;
        }

        const user = data?.user;
        setSuccessMessage(
          'Compte créé avec succès dans la base Supabase ! Vous pouvez maintenant vous connecter.'
        );
        showToast('Compte enregistré dans Supabase !', 'success');

        // Automatically configure state
        setRole(authRole);
        if (authRole === 'merchant') {
          updateMerchantUser({
            id: user?.id || 'new-merchant',
            email,
            fullName: fullName || 'Pharmacien Titulaire',
            shopName: shopName || 'Pharmacie Partenaire',
            rppsNumber: rppsNumber || '10004928192',
          });
        } else {
          updateClientUser({
            id: user?.id || 'new-client',
            email,
            fullName: fullName || 'Client CareCycle',
            phone,
          });
        }

        setTimeout(() => {
          handleClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erreur inattendue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#005C52] to-[#00443D] flex items-center justify-center text-white shadow-md">
              <span className="font-extrabold text-base font-['Plus_Jakarta_Sans'] text-[#FFC940]">C</span>
              <span className="font-extrabold text-base font-['Plus_Jakarta_Sans'] -ml-0.5 text-white">C</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-stone-900 text-base font-['Plus_Jakarta_Sans'] leading-tight">
                <span>Care</span>
                <span className="text-[#E5A812]">Cycle</span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium">Espace Sécurisé Supabase</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* ── 1. Role Segmented Toggle ─────────────────────────────────── */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              Je me connecte en tant que :
            </label>
            <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200/80">
              <button
                type="button"
                onClick={() => setAuthRole('client')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  authRole === 'client'
                    ? 'bg-white text-[#005C52] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <User className="w-4 h-4 text-[#005C52]" />
                <span>Patient / Client</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthRole('merchant')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  authRole === 'merchant'
                    ? 'bg-[#005C52] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Store className="w-4 h-4 text-[#FFC940]" />
                <span>Pharmacien</span>
              </button>
            </div>
          </div>

          {/* ── 2. Sign In vs Sign Up Tabs ───────────────────────────────── */}
          <div className="flex border-b border-stone-200">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all ${
                authMode === 'signin'
                  ? 'border-[#005C52] text-[#005C52]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all ${
                authMode === 'signup'
                  ? 'border-[#005C52] text-[#005C52]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ── 3. Main Auth Form ────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Sign Up extra fields */}
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {authRole === 'merchant' ? 'Nom du pharmacien titulaire' : 'Prénom et Nom'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={authRole === 'merchant' ? 'Dr. Jean-Marc Dumont' : 'Claire Renaud'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#005C52]"
                      required
                    />
                  </div>
                </div>

                {authRole === 'merchant' && (
                  <>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Nom de l'officine / pharmacie
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Pharmacie Centrale de Dijon"
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#005C52]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Numéro RPPS (11 chiffres)
                      </label>
                      <div className="relative">
                        <ShieldCheck className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="10004928192"
                          value={rppsNumber}
                          onChange={(e) => setRppsNumber(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-[#005C52]"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#005C52]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {authRole === 'merchant' ? 'Email professionnel' : 'Adresse email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder={authRole === 'merchant' ? 'officine@pharmacie.fr' : 'patient@gmail.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#005C52]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#005C52]"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-[#005C52] hover:bg-[#00443D] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Connexion avec Supabase...</span>
              ) : (
                <>
                  <span>
                    {authMode === 'signin'
                      ? `Se connecter (${authRole === 'merchant' ? 'Officine' : 'Patient'})`
                      : `Créer mon compte (${authRole === 'merchant' ? 'Officine' : 'Patient'})`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#FFC940]" />
                </>
              )}
            </button>
          </form>

          {/* ── 4. Quick Demo One-Click Access ───────────────────────────── */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              <Zap className="w-3.5 h-3.5 text-[#FFC940]" />
              <span>Accès Démo 1-Clic Immédiat :</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('client')}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-500/50 text-left transition-colors flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-[#E0F0E4] text-[#005C52] flex items-center justify-center font-bold text-xs shrink-0">
                  C
                </div>
                <div className="text-[11px] min-w-0">
                  <div className="font-bold text-stone-800 truncate">Patient : Claire Renaud</div>
                  <div className="text-stone-400 text-[10px]">Espace Click & Collect</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('merchant')}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-500/50 text-left transition-colors flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FFF5D6] text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                  P
                </div>
                <div className="text-[11px] min-w-0">
                  <div className="font-bold text-stone-800 truncate">Dr. J-M Dumont</div>
                  <div className="text-stone-400 text-[10px]">Espace Officine & Comptoir</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
