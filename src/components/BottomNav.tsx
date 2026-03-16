import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    Truck,
    UtensilsCrossed,
    CreditCard,
} from 'lucide-react';
import './BottomNav.css';

const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard /> },
    { path: '/orders', label: 'Orders', icon: <ClipboardList /> },
    { path: '/drivers', label: 'Drivers', icon: <Truck /> },
    { path: '/menu', label: 'Menu', icon: <UtensilsCrossed /> },
    { path: '/payments', label: 'Payments', icon: <CreditCard /> },
];

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `bottom-nav__item ${isActive ? 'active' : ''}`
                    }
                    end={item.path === '/'}
                >
                    {item.icon}
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}
