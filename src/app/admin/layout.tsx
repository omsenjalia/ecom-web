import { Plus_Jakarta_Sans } from 'next/font/google';
import AdminSidebar from './components/AdminSidebar';
import './admin.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Admin Panel | Ram Chashma Ghar',
    template: '%s | RCG Admin',
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${plusJakarta.variable} min-h-screen`} style={{ fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif', backgroundColor: '#F8FAFC' }}>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
