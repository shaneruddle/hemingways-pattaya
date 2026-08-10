import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { LayoutDashboard, Wallet, LogOut } from 'lucide-react';
import FinanceOverview from '../finance/FinanceOverview';
import DailyBalances from '../finance/DailyBalances';
import { getFinanceRole } from '../finance/FinanceDashboard';

// ─── Design tokens (matches the Finance dashboard's light admin theme) ────────
const T = {
  ink850: '#141414',
  ink700: '#1C1C1C',
  teal500: '#1DA0A8',
  teal400: '#34B2BA',
  cream50: '#F6F1E6',
  border: 'rgba(246,241,230,0.12)',
};

const MANIFEST_HREF = '/manifest-manager.json';
const ICON_192 = '/assets/manager-icons/icon-192.png';

/**
 * Injects the /manager-scoped PWA manifest + iOS home-screen meta tags into
 * <head> only while this app is mounted, so "Add to Home Screen" installs
 * "Hemingways Manager" (scope: /manager/) rather than making the whole
 * public site installable. Cleaned up on unmount.
 */
function useManagerPwaTags() {
  useEffect(() => {
    const added: HTMLElement[] = [];

    const addTag = (tag: string, attrs: Record<string, string>) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      added.push(el);
      return el;
    };

    addTag('link', { rel: 'manifest', href: MANIFEST_HREF });
    addTag('link', { rel: 'apple-touch-icon', href: '/assets/manager-icons/apple-touch-icon.png' });
    addTag('meta', { name: 'theme-color', content: T.teal500 });
    addTag('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
    addTag('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' });
    addTag('meta', { name: 'apple-mobile-web-app-title', content: 'HW Manager' });
    addTag('meta', { name: 'mobile-web-app-capable', content: 'yes' });

    return () => added.forEach(el => el.remove());
  }, []);
}

type Tab = 'overview' | 'daily-balances';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'daily-balances', label: 'Balances', icon: <Wallet size={20} /> },
];

export default function ManagerApp({ user }: { user: any }) {
  useManagerPwaTags();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'companyProfile', 'config'), snap => {
      setLogoUrl((snap.data()?.logoUrl as string) || null);
    }, () => setLogoUrl(null));
    return () => unsub();
  }, []);

  const financeRole = getFinanceRole(user);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F9FAFB', // matches the Finance dashboard's light content area (bg-gray-50)
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          background: T.ink850,
          borderBottom: `1px solid ${T.border}`,
          padding: '14px 16px',
          paddingTop: 'max(14px, env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <img
            src={ICON_192}
            alt=""
            style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: T.cream50,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Hemingways Manager
            </div>
            <div
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 11,
                color: 'rgba(246,241,230,0.55)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          aria-label="Sign out"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(246,241,230,0.55)',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Content */}
      <main style={{ flex: 1, paddingBottom: 84 }}>
        {activeTab === 'overview' && <FinanceOverview financeRole={financeRole} />}
        {activeTab === 'daily-balances' && <DailyBalances user={user} />}
      </main>

      {/* Bottom tab bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: 20,
        }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '10px 0 8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? T.teal500 : '#9CA3AF',
              }}
            >
              {tab.icon}
              <span
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 600,
                  fontSize: 11,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
