import { useState, useEffect } from 'react';
import {
    Calendar,
    ClipboardList,
    Clock,
    ChefHat,
    DollarSign,
    FileText,
    Menu,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { dashboardApi } from '../services/api';
import type { Order } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
    const [stats, setStats] = useState({ totalOrders: 0, pending: 0, preparing: 0, revenue: 0 });
    const [chartData, setChartData] = useState<{ day: string; revenue: number }[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    useEffect(() => {
        dashboardApi.getStats().then(setStats).catch(console.error);
        dashboardApi.getRevenue().then(setChartData).catch(console.error);
        dashboardApi.getRecentOrders().then(setRecentOrders).catch(console.error);
    }, []);

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="dashboard">
            {/* Mobile Brand Header */}
            <div className="dashboard__mobile-header">
                <div className="dashboard__mobile-brand">
                    <div className="dashboard__mobile-brand-icon">A</div>
                    <span>Akshar</span>
                </div>
                <button className="dashboard__menu-toggle">
                    <Menu size={24} />
                </button>
            </div>

            {/* Page header */}
            <div className="dashboard__header">
                <div className="dashboard__header-left">
                    <h1>Dashboard Overview</h1>
                    <p className="desktop-only">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="dashboard__date-badge">
                    <Calendar size={18} />
                    <span>{today}</span>
                </div>
            </div>

            {/* Today's Performance */}
            <h2 className="dashboard__section-title">Today's Performance</h2>

            <div className="dashboard__stats">
                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Total Orders</span>
                        <div className="stat-card__icon stat-card__icon--primary">
                            <ClipboardList size={16} />
                        </div>
                    </div>
                    <div className="stat-card__value">{stats.totalOrders}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Pending</span>
                        <div className="stat-card__icon stat-card__icon--warning">
                            <Clock size={16} />
                        </div>
                    </div>
                    <div className="stat-card__value">{stats.pending}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Preparing</span>
                        <div className="stat-card__icon stat-card__icon--info">
                            <ChefHat size={16} />
                        </div>
                    </div>
                    <div className="stat-card__value">{stats.preparing}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <span className="stat-card__label">Revenue</span>
                        <div className="stat-card__icon stat-card__icon--success">
                            <DollarSign size={16} />
                        </div>
                    </div>
                    <div className="stat-card__value">${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="dashboard__bottom">
                {/* Revenue Chart */}
                <div className="dashboard__chart-card">
                    <div className="dashboard__chart-header">
                        <h3>Revenue Analytics</h3>
                        <span className="dashboard__chart-period">Last 7 Days</span>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData} barSize={36}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 13, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#9CA3AF', fontFamily: 'Space Grotesk' }}
                                tickFormatter={(v: number) => `$${v}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '10px',
                                    fontFamily: 'Space Grotesk',
                                    fontSize: '13px',
                                }}
                                formatter={(v: any) => [`$${Number(v || 0).toLocaleString()}`, 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="#49694A" radius={[6, 6, 0, 0]} opacity={0.85} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Orders */}
                <div className="dashboard__recent-orders">
                    <div className="dashboard__recent-header">
                        <h3>Recent Orders</h3>
                        <a href="/orders">View All</a>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state__icon">
                                <FileText size={28} />
                            </div>
                            <h4>No recent orders</h4>
                            <p>Orders will appear here once customers start purchasing.</p>
                        </div>
                    ) : (
                        <div className="dashboard__orders-list">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="dashboard__order-item">
                                    <div className="dashboard__order-info">
                                        <span className="dashboard__order-id">{order.orderId}</span>
                                        <span className="dashboard__order-customer">{order.customerName}</span>
                                    </div>
                                    <div className="dashboard__order-right">
                                        <span className="dashboard__order-total">${order.total.toFixed(2)}</span>
                                        <span className={`badge badge--sm ${order.status === 'Completed' ? 'badge--success' : order.status === 'Pending' ? 'badge--warning' : order.status === 'Cancelled' ? 'badge--danger' : 'badge--info'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
