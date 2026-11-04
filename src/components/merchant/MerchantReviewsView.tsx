import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  MessageSquare,
  Star,
  CornerDownRight,
  Send,
  User,
  Calendar,
} from 'lucide-react';

export const MerchantReviewsView: React.FC = () => {
  const { reviews, replyToReview, merchantUser, shops } = useAppStore();

  const myShop = shops.find((s) => s.id === merchantUser.shopId) || shops[0];
  const myReviews = reviews.filter((r) => r.shopId === myShop.id);

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText);
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-['Plus_Jakarta_Sans']">
          Avis Patients & Retours d'Expérience
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {myReviews.length} avis reçus pour {myShop.name} • Note moyenne : {myShop.rating} / 5
        </p>
      </div>

      <div className="space-y-4">
        {myReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500 text-xs">
            Aucun avis patient reçu pour l'instant.
          </div>
        ) : (
          myReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-700">
                    {rev.clientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900">{rev.clientName}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-500' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-stone-400">{rev.createdAt}</span>
              </div>

              <p className="text-stone-700 leading-relaxed text-sm bg-stone-50 p-3 rounded-xl border border-stone-100">
                "{rev.comment}"
              </p>

              {/* Existing reply */}
              {rev.reply ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#005C52]">
                    <CornerDownRight className="w-4 h-4" />
                    <span>Réponse de {myShop.pharmacistName} :</span>
                  </div>
                  <p className="text-xs">{rev.reply}</p>
                </div>
              ) : (
                <div>
                  {activeReplyId === rev.id ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        rows={2}
                        placeholder="Rédigez votre réponse officielle en tant que pharmacien titulaire..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#005C52]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="px-3 py-1.5 text-stone-500 hover:text-stone-700 font-semibold"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleSendReply(rev.id)}
                          className="px-4 py-1.5 bg-[#005C52] hover:bg-[#00443D] text-white font-bold rounded-xl flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Publier la réponse</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReplyId(rev.id);
                        setReplyText('');
                      }}
                      className="text-[#005C52] hover:underline font-bold flex items-center gap-1"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Répondre à ce patient</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
