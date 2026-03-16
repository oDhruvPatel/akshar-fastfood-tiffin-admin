import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  Tag,
  CreditCard,
  Settings,
  Download,
  LogOut,
  ChefHat,
} from 'lucide-react';
import './Sidebar.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard /> },
  { path: '/orders', label: 'Orders', icon: <ShoppingBag /> },
  { path: '/drivers', label: 'Drivers', icon: <Truck /> },
  { path: '/menu', label: 'Menu', icon: <UtensilsCrossed /> },
  { path: '/discounts', label: 'Discounts', icon: <Tag /> },
  { path: '/payments', label: 'Payments', icon: <CreditCard /> },
];

const accountNavItems: NavItem[] = [
  { path: '/settings', label: 'Settings', icon: <Settings /> },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <ChefHat size={22} />
        </div>
        <div className="sidebar__brand-info">
          <h3>Akshar</h3>
          <span>MERCHANT</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="sidebar__nav">
        <div className="sidebar__section-label">Main Menu</div>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? 'active' : ''}`
            }
            end={item.path === '/'}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        <div className="sidebar__divider" />

        <div className="sidebar__section-label">Account</div>
        {accountNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
        <button className="sidebar__nav-item" style={{ color: '#EF4444' }}>
          <LogOut />
          Logout
        </button>
      </nav>

      {/* Export */}
      <div className="sidebar__support">
        <h4>Support</h4>
        <p>Need help managing your store? Contact our help center.</p>
      </div>

      {/* User */}
      <div className="sidebar__footer">
        <div className="sidebar__avatar">AF</div>
        <div className="sidebar__user-info">
          <div className="sidebar__user-name">Akshar Fast Food</div>
          <div className="sidebar__user-role">Store Manager</div>
        </div>
      </div>
    </aside>
  );
}
