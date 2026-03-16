import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import './Layout.css';

export default function Layout() {
    return (
        <div className="layout">
            <Sidebar />
            <main className="layout__content">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
