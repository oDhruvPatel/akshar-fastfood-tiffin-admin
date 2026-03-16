import { useState, useEffect } from 'react';
import {
    Navigation,
    Plus,
    Star,
    Ban,
    ArrowLeft,
    Search,
    SlidersHorizontal,
    Trash2,
    X,
    Send,
    Package,
} from 'lucide-react';
import { driversApi } from '../services/api';
import type { Driver, Order } from '../services/api';
import './Drivers.css';

const statusBadgeClass: Record<string, string> = {
    'Active': 'badge--success',
    'On Break': 'badge--warning',
    'Offline': 'badge--neutral',
    'Warning': 'badge--danger',
};

const driverTabs = ['All', 'Active', 'On Break', 'Offline'];

export default function Drivers() {
    const [activeTab, setActiveTab] = useState('All');
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [driverStats, setDriverStats] = useState({ totalDrivers: 0, activeNow: 0, avgDeliveryTime: '0m' });

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [formName, setFormName] = useState('');
    const [formCar, setFormCar] = useState('');
    const [formPhone, setFormPhone] = useState('');

    // Driver orders panel
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [driverOrders, setDriverOrders] = useState<Order[]>([]);

    // Send list
    const [sendListText, setSendListText] = useState('');
    const [showSendList, setShowSendList] = useState(false);

    const fetchDrivers = () => {
        const params = activeTab !== 'All' ? { status: activeTab } : undefined;
        driversApi.list(params).then(setDrivers).catch(console.error);
    };

    const refreshStats = () => {
        driversApi.getStats().then(setDriverStats).catch(console.error);
    };

    useEffect(() => {
        fetchDrivers();
        refreshStats();
    }, [activeTab]);

    const handleDelete = (id: string) => {
        driversApi.remove(id).then(() => { fetchDrivers(); refreshStats(); }).catch(console.error);
    };

    // Add driver
    const openAddModal = () => {
        setFormName(''); setFormCar(''); setFormPhone('');
        setShowAddModal(true);
    };

    const handleAdd = () => {
        if (!formName || !formCar || !formPhone) return;
        driversApi.create({ name: formName, car: formCar, phone: formPhone }).then(() => {
            setShowAddModal(false);
            fetchDrivers(); refreshStats();
        }).catch(console.error);
    };

    // Edit driver
    const openEditModal = (driver: Driver) => {
        setEditingDriver(driver);
        setFormName(driver.name);
        setFormCar(driver.car);
        setFormPhone(driver.phone);
    };

    const handleEdit = () => {
        if (!editingDriver || !formName || !formCar || !formPhone) return;
        driversApi.update(editingDriver.id, { name: formName, car: formCar, phone: formPhone }).then(() => {
            setEditingDriver(null);
            fetchDrivers(); refreshStats();
        }).catch(console.error);
    };

    // View orders
    const handleViewOrders = (driver: Driver) => {
        setSelectedDriver(driver);
        driversApi.getOrders(driver.id).then(setDriverOrders).catch(console.error);
    };

    // Send list
    const handleSendList = (driver: Driver) => {
        driversApi.sendList(driver.id).then((res) => {
            setSendListText(res.text || res.message);
            setShowSendList(true);
        }).catch(console.error);
    };

    return (
        <div className="drivers">
            {/* Desktop Breadcrumb */}
            <div className="drivers__breadcrumb desktop-only">
                <Navigation size={14} />
                Fleet Overview
            </div>

            {/* Header */}
            <div className="drivers__header">
                <div className="drivers__header-left">
                    <button className="mobile-only drivers__back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Drivers</h1>
                        <p className="desktop-only">Efficiently manage your delivery logistics and driver performance metrics.</p>
                    </div>
                </div>
                <div className="drivers__header-actions">
                    <button className="btn-primary desktop-only" onClick={openAddModal}>
                        <Plus size={16} />
                        Add New Driver
                    </button>
                    <button className="mobile-only drivers__add-driver-btn" onClick={openAddModal}>
                        <Plus size={18} />
                        <span>Add Driver</span>
                    </button>
                    <button className="mobile-only drivers__action-icon">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Tabs */}
            <div className="mobile-only drivers__tabs">
                {driverTabs.map(tab => (
                    <button
                        key={tab}
                        className={`drivers__tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mobile-only drivers__list-header">
                <span>ACTIVE FLEET ({driverStats.activeNow})</span>
                <SlidersHorizontal size={14} />
            </div>

            {/* Stats - Desktop View */}
            <div className="drivers__stats desktop-only">
                <div className="drivers__stat-card">
                    <div className="drivers__stat-label">Total Drivers</div>
                    <div className="drivers__stat-row">
                        <span className="drivers__stat-value">{driverStats.totalDrivers}</span>
                        <span className="drivers__stat-change drivers__stat-change--up">↑8%</span>
                    </div>
                </div>
                <div className="drivers__stat-card">
                    <div className="drivers__stat-label">Active Now</div>
                    <div className="drivers__stat-row">
                        <span className="drivers__stat-value">{driverStats.activeNow}</span>
                        <span className="drivers__stat-change drivers__stat-change--neutral">~Steady</span>
                    </div>
                </div>
                <div className="drivers__stat-card">
                    <div className="drivers__stat-label">Avg. Delivery Time</div>
                    <div className="drivers__stat-row">
                        <span className="drivers__stat-value">{driverStats.avgDeliveryTime}</span>
                        <span className="drivers__stat-change drivers__stat-change--down">↓2m</span>
                    </div>
                </div>
            </div>

            {/* Drivers table - Desktop View */}
            <div className="drivers__table-card desktop-only">
                <table className="drivers__table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Rating</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => (
                            <tr key={driver.id} className="drivers__table-row--clickable" onClick={() => handleViewOrders(driver)}>
                                <td>
                                    <div className="drivers__name-cell">
                                        <div className="drivers__initials">{driver.initials}</div>
                                        <span className="drivers__driver-name">{driver.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${statusBadgeClass[driver.status]}`}>
                                        {driver.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="drivers__rating">
                                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                                        {driver.rating}
                                    </div>
                                </td>
                                <td>{driver.phone}</td>
                                <td>
                                    <div className="drivers__actions-cell" onClick={(e) => e.stopPropagation()}>
                                        <button className="drivers__edit-btn" onClick={() => openEditModal(driver)}>Edit</button>
                                        <button className="drivers__send-list-btn" onClick={() => handleSendList(driver)}>
                                            <Send size={13} /> Send List
                                        </button>
                                        <button className="drivers__delete-btn" onClick={() => handleDelete(driver.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards List */}
            <div className="mobile-only drivers__cards">
                {drivers.map((driver) => (
                    <div className="driver-card" key={driver.id} onClick={() => handleViewOrders(driver)}>
                        <div className="driver-card__header">
                            <div className="driver-card__profile">
                                <div className="driver-card__avatar">{driver.initials}</div>
                                <div className="driver-card__info">
                                    <div className="driver-card__name">{driver.name}</div>
                                    <div className="driver-card__sub">ID: {driver.driverId} • {driver.car}</div>
                                </div>
                            </div>
                            <div className="driver-card__badges">
                                <span className={`badge badge--sm ${statusBadgeClass[driver.status]}`}>
                                    {driver.status === 'On Break' ? 'BREAK' : driver.status.toUpperCase()}
                                </span>
                                <div className="drivers__rating">
                                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                                    {driver.rating}
                                </div>
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="driver-card__actions" onClick={(e) => e.stopPropagation()}>
                            <button className="driver-card__action-btn driver-card__edit-btn" onClick={() => openEditModal(driver)}>
                                Edit
                            </button>
                            <button className="driver-card__action-btn driver-card__send-btn" onClick={() => handleSendList(driver)}>
                                <Send size={14} /> Send List
                            </button>
                            <button className="driver-card__action-btn driver-card__delete-btn" onClick={() => handleDelete(driver.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Performance Stats */}
            <div className="mobile-only drivers__performance">
                <div className="drivers__performance-label">Fleet performance overview</div>
                <div className="drivers__performance-grid">
                    <div className="performance-item">
                        <div className="performance-item__value">4.8</div>
                        <div className="performance-item__label">AVG RATING</div>
                    </div>
                    <div className="performance-item">
                        <div className="performance-item__value">92%</div>
                        <div className="performance-item__label">UPTIME</div>
                    </div>
                    <div className="performance-item">
                        <div className="performance-item__value">{driverStats.activeNow}</div>
                        <div className="performance-item__label">ACTIVE</div>
                    </div>
                </div>
            </div>

            {/* Empty zone */}
            {drivers.length === 0 && (
                <div className="drivers__empty-zone">
                    <div className="drivers__empty-zone-icon">
                        <Ban size={28} />
                    </div>
                    <h3>No drivers found</h3>
                    <p>
                        No drivers match the current filter. Try a different tab or add a new driver.
                    </p>
                    <button className="btn-primary" onClick={openAddModal}>
                        <Plus size={16} />
                        Register First Driver
                    </button>
                </div>
            )}

            {/* =================== MODALS =================== */}

            {/* Add / Edit Driver Modal */}
            {(showAddModal || editingDriver) && (
                <div className="modal-overlay" onClick={() => { setShowAddModal(false); setEditingDriver(null); }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h2>
                            <button className="modal__close" onClick={() => { setShowAddModal(false); setEditingDriver(null); }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal__body">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" placeholder="e.g. Rajesh Kumar" value={formName} onChange={(e) => setFormName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Vehicle</label>
                                <input type="text" placeholder="e.g. Toyota Prius" value={formCar} onChange={(e) => setFormCar(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" placeholder="e.g. +1-555-1234" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal__footer">
                            <button className="btn-secondary" onClick={() => { setShowAddModal(false); setEditingDriver(null); }}>Cancel</button>
                            <button className="btn-primary" onClick={editingDriver ? handleEdit : handleAdd}>
                                {editingDriver ? 'Save Changes' : 'Add Driver'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Driver Orders Panel */}
            {selectedDriver && (
                <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
                    <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2>
                                <Package size={20} />
                                Orders — {selectedDriver.name}
                            </h2>
                            <button className="modal__close" onClick={() => setSelectedDriver(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal__body">
                            {driverOrders.length === 0 ? (
                                <div className="modal__empty">No orders assigned to this driver.</div>
                            ) : (
                                <div className="driver-orders-list">
                                    {driverOrders.map((order) => (
                                        <div className="driver-order-item" key={order.id}>
                                            <div className="driver-order-item__top">
                                                <strong>{order.orderId}</strong>
                                                <span className={`badge badge--sm ${order.status === 'Pending' ? 'badge--warning' :
                                                    order.status === 'Preparing' ? 'badge--info' :
                                                        order.status === 'Completed' ? 'badge--success' : 'badge--danger'
                                                    }`}>{order.status}</span>
                                            </div>
                                            <div className="driver-order-item__customer">{order.customerName}</div>
                                            <div className="driver-order-item__address">{order.address}</div>
                                            <div className="driver-order-item__bottom">
                                                <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                                                <strong>${order.total.toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Send List Modal */}
            {showSendList && (
                <div className="modal-overlay" onClick={() => setShowSendList(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2><Send size={18} /> Order List for SMS</h2>
                            <button className="modal__close" onClick={() => setShowSendList(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal__body">
                            <pre className="send-list-preview">{sendListText}</pre>
                        </div>
                        <div className="modal__footer">
                            <button className="btn-secondary" onClick={() => setShowSendList(false)}>Close</button>
                            <button className="btn-primary" onClick={() => {
                                navigator.clipboard.writeText(sendListText);
                                setShowSendList(false);
                            }}>
                                Copy & Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
