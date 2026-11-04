import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Bell, Check, ShoppingBag, AlertTriangle, MessageSquare, Tag, X, Clock } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { role, notifications, markNotificationRead, markAllNotificationsRead, setActiveModal } = useAppStore();

  const userNotifications = notifications.filter(
    (n) => n.recipientRole === role || !n.recipientRole
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'dlc':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'review':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'promo':
        return <Tag className="w-4 h-4 text-teal-600" />;
      default:
        return <Bell className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-[#FAF7F2]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#005C52]" />
          <h3 className="font-semibold text-sm text-stone-900">Notifications</h3>
          <span className="text-xs bg-[#E0F0E4] text-[#005C52] font-semibold px-2 py-0.5 rounded-full">
            {userNotifications.filter((n) => !n.read).length} non lues
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-[#005C52] hover:underline font-medium p-1"
            title="Tout marquer comme lu"
          >
            Tout lire
          </button>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
        {userNotifications.length === 0 ? (
          <div className="py-10 text-center text-stone-400 text-sm">
            Aucune notification pour le moment.
          </div>
        ) : (
          userNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.type === 'dlc' && role === 'merchant') {
                  setActiveModal('dlc-alerts');
                  onClose();
                } else if (notif.type === 'order') {
                  onClose();
                }
              }}
              className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                notif.read ? 'bg-white hover:bg-stone-50' : 'bg-emerald-50/50 hover:bg-emerald-50/80'
              }`}
            >
              <div className="mt-0.5 p-2 rounded-xl bg-stone-100 shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs font-semibold ${notif.read ? 'text-stone-800' : 'text-[#005C52]'}`}>
                    {notif.title}
                  </h4>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-[#005C52] shrink-0" />}
                </div>
                <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">{notif.message}</p>
                <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Récemment</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
