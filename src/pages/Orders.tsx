import { useState, useEffect } from 'react';
import { Search, RefreshCw, ClipboardList, Phone, MapPin, ChevronDown } from 'lucide-react';
import { ordersApi, driversApi } from '../services/api';
import type { Order, Driver } from '../services/api';
import './Orders.css';

const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Delivered', 'Cancelled'];

export default function Orders() {
    const [activeTab, setActiveTab] = useState('All');
    const [orders, setOrders] = useState<Order[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchOrders = () => {
        const params: { status?: string; search?: string } = {};
        if (activeTab !== 'All') params.status = activeTab;
        if (searchQuery) params.search = searchQuery;
        ordersApi.list(params).then(setOrders).catch(console.error);
    };

    useEffect(() => {
        fetchOrders();
        driversApi.list().then(setDrivers).catch(console.error);
    }, [activeTab]);

    const handleSearch = () => {
        fetchOrders();
    };

    const handleStatusChange = (orderId: string, newStatus: string) => {
        ordersApi.updateStatus(orderId, newStatus).then(() => fetchOrders()).catch(console.error);
    };

    const handleAssignDriver = (orderId: string, driverId: string) => {
        ordersApi.assignDriver(orderId, driverId).then(() => fetchOrders()).catch(console.error);
    };

    return (
        <div className="orders">
            {/* Header */}
            <div className="orders__header">
                <div className="orders__header-left">
                    <h1>Orders</h1>
                    <p>Real-time order queue management</p>
                </div>
                <div className="orders__header-right">
                    <div className="orders__search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <button className="btn-primary" onClick={fetchOrders}>
                        <RefreshCw size={15} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="orders__tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`orders__tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Orders List or Empty State */}
            {orders.length === 0 ? (
                <div className="orders__empty">
                    <div className="orders__empty-icon">
                        <ClipboardList size={36} />
                    </div>
                    <h3>No orders found</h3>
                    <p>
                        Your order queue is currently empty. New incoming orders will appear
                        here automatically.
                    </p>
                    <div className="orders__empty-actions">
                        <button className="btn-secondary">Check Menu Status</button>
                        <button className="btn-secondary">View History</button>
                    </div>
                </div>
            ) : (
                <div className="orders__table-card">
                    {/* Desktop Table */}
                    <table className="orders__table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Driver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td><strong>{order.orderId}</strong></td>
                                    <td>{order.customerName}</td>
                                    <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                                    <td><strong>${order.total.toFixed(2)}</strong></td>
                                    <td>
                                        <div className="orders__status-select-wrap">
                                            <select
                                                className={`orders__status-select orders__status-select--${order.status.toLowerCase()}`}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="orders__driver-select-wrap">
                                            <select
                                                className="orders__driver-select"
                                                value={order.assignedDriverId || ''}
                                                onChange={(e) => handleAssignDriver(order.id, e.target.value)}
                                            >
                                                <option value="">Unassigned</option>
                                                {drivers.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Order Cards */}
                    <div className="orders__mobile-cards">
                        {
                            orders.map((order) => (
                                <div className="order-card" key={order.id}>
                                    {/* Card header */}
                                    <div className="order-card__header">
                                        <div className="order-card__order-label">ORDER {order.orderId}</div>
                                        <span className={`order-card__type-badge ${order.orderType === 'Delivery' ? 'order-card__type-badge--delivery' : 'order-card__type-badge--pickup'}`}>
                                            {order.orderType.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Customer info */}
                                    <div className="order-card__customer-name">{order.customerName}</div>
                                    <div className="order-card__contact">
                                        <span className="order-card__phone">
                                            {order.phone} <Phone size={14} />
                                        </span>
                                    </div>
                                    {order.orderType === 'Delivery' && order.address && (
                                        <div className="order-card__address">
                                            <MapPin size={14} />
                                            <span>{order.address}</span>
                                        </div>
                                    )}

                                    {/* Order items */}
                                    <div className="order-card__items-section">
                                        <div className="order-card__items-label">ORDER ITEMS</div>
                                        <div className="order-card__items-list">
                                            {order.items.map((item, idx) => (
                                                <div className="order-card__item-row" key={idx}>
                                                    <span className="order-card__item-name">{item.name}</span>
                                                    <span className="order-card__item-qty">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="order-card__total-row">
                                        <span className="order-card__total-label">Total Amount</span>
                                        <span className="order-card__total-value">${order.total.toFixed(2)}</span>
                                    </div>

                                    {/* Update Status */}
                                    <div className="order-card__dropdown-section">
                                        <div className="order-card__dropdown-label">UPDATE STATUS</div>
                                        <div className="order-card__select-wrap">
                                            <select
                                                className="order-card__select"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <ChevronDown size={16} className="order-card__select-icon" />
                                        </div>
                                    </div>

                                    {/* Assign Driver */}
                                    <div className="order-card__dropdown-section">
                                        <div className="order-card__dropdown-label">ASSIGN DRIVER</div>
                                        <div className="order-card__select-wrap">
                                            <select
                                                className="order-card__select"
                                                value={order.assignedDriverId || ''}
                                                onChange={(e) => handleAssignDriver(order.id, e.target.value)}
                                            >
                                                <option value="">Select Driver</option>
                                                {drivers.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="order-card__select-icon" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div >
                </div >
            )
            }

            {/* Status bar */}
            <div className="orders__status-bar">
                <div className="orders__status-indicators">
                    <span className="orders__status-dot orders__status-dot--online">
                        Kitchen Online
                    </span>
                    <span className="orders__status-dot orders__status-dot--pending">
                        {orders.filter(o => o.status === 'Pending').length} Pending Today
                    </span>
                </div>
                <span className="orders__status-bar-time">Last Updated: Just Now</span>
            </div>
        </div >
    );
}
