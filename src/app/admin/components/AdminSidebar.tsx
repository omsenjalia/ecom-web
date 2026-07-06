'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
  Glasses,
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div className="admin-logo-icon">
          <Glasses size={20} />
        </div>
        <div>
          <p className="admin-logo-title">Ram Chashma Ghar</p>
          <p className="admin-logo-subtitle">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`admin-nav-item ${active ? 'admin-nav-item-active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-nav-item" target="_blank">
          <Glasses size={18} />
          <span>View Storefront</span>
        </Link>
        <button onClick={handleLogout} className="admin-nav-item admin-nav-item-danger">
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="admin-mobile-toggle"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <aside className="admin-sidebar admin-sidebar-desktop">
        {navContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} />
          <aside className="admin-sidebar admin-sidebar-mobile">
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}
