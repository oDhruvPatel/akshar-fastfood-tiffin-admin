import { useState, useEffect } from 'react';
import {
    Plus,
    ClipboardList,
    AlertTriangle,
    TrendingUp,
    Search,
    ChevronRight,
    ArrowLeft,
    X,
} from 'lucide-react';
import { menuApi } from '../services/api';
import type { MenuItem } from '../services/api';
import './Menu.css';

export default function Menu() {
    const [categories, setCategories] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('');
    const [items, setItems] = useState<MenuItem[]>([]);
    const [stats, setStats] = useState({ totalItems: 0, lowStock: 0, mostOrdered: 'N/A' });
    const [searchQuery, setSearchQuery] = useState('');

    // Add Item Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [formName, setFormName] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formCategory, setFormCategory] = useState('');
    const [formVeg, setFormVeg] = useState(true);
    const [formComment, setFormComment] = useState('');
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        menuApi.getCategories().then((cats) => {
            setCategories(cats);
            if (cats.length > 0) {
                setActiveTab(cats[0]);
                setFormCategory(cats[0]);
            }
        }).catch(console.error);
        menuApi.getStats().then(setStats).catch(console.error);
    }, []);

    // Fetch items when tab or search changes
    useEffect(() => {
        if (!activeTab) return;
        const params: { category?: string; search?: string } = { category: activeTab };
        if (searchQuery) params.search = searchQuery;
        menuApi.list(params).then(setItems).catch(console.error);
    }, [activeTab, searchQuery]);

    const handleToggle = (id: string) => {
        menuApi.toggleAvailability(id).then(() => {
            setItems(prev => prev.map(item =>
                item.id === id ? { ...item, available: !item.available, outOfStock: item.available } : item
            ));
            menuApi.getStats().then(setStats).catch(console.error);
        }).catch(console.error);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        menuApi.remove(id).then(() => {
            setItems(prev => prev.filter(item => item.id !== id));
            menuApi.getStats().then(setStats).catch(console.error);
        }).catch(console.error);
    };

    const openAddModal = () => {
        setFormName('');
        setFormPrice('');
        if (categories.length > 0 && !formCategory) {
            setFormCategory(categories[0]);
        }
        setFormVeg(true);
        setFormComment('');
        setEditingItem(null);
        setShowAddModal(true);
    };

    const handleEdit = (item: MenuItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingItem(item);
        setFormName(item.name);
        setFormPrice(item.price.toString());
        setFormCategory(item.category);
        setFormVeg(item.veg);
        setFormComment(item.comment || '');
        setShowAddModal(true);
    };

    const handleAdd = () => {
        if (!formName || !formPrice || !formCategory) return;
        const colors = ['#e8d5b7', '#f5e6cc', '#d4e5d0', '#e3d4c0', '#f0e4d7', '#c9dbc4'];

        const payload: Partial<MenuItem> = {
            name: formName,
            price: parseFloat(formPrice),
            category: formCategory,
            veg: formVeg,
            comment: formComment || undefined,
        };

        if (editingItem) {
            menuApi.update(editingItem.id, payload).then(() => {
                setShowAddModal(false);
                setEditingItem(null);
                refreshMenu();
            }).catch(console.error);
        } else {
            menuApi.create({
                ...payload,
                available: true,
                outOfStock: false,
                bestseller: false,
                color: colors[Math.floor(Math.random() * colors.length)],
            }).then(() => {
                setShowAddModal(false);
                refreshMenu();
            }).catch(console.error);
        }
    };

    const refreshMenu = () => {
        const params: { category?: string; search?: string } = { category: activeTab };
        if (searchQuery) params.search = searchQuery;
        menuApi.list(params).then(setItems).catch(console.error);
        menuApi.getStats().then(setStats).catch(console.error);
    };

    return (
        <div className="menu">
            {/* Header */}
            <div className="menu__header">
                <div className="menu__header-left">
                    <button className="mobile-only menu__back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <h1>Menu Management</h1>
                </div>
                <div className="menu__header-actions">
                    <button className="btn-primary desktop-only" onClick={openAddModal}>
                        <Plus size={16} />
                        Add Item
                    </button>
                    <button className="mobile-only menu__action-icon" onClick={openAddModal}>
                        <Plus size={20} />
                    </button>
                    <button className="mobile-only menu__action-icon">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="mobile-only menu__search-container">
                <div className="menu__search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="menu__tabs">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`menu__tab ${activeTab === cat ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Bottom stats */}
            <div className="menu__bottom-stats">
                <div className="menu__bottom-stat">
                    <div className="menu__bottom-stat-icon menu__bottom-stat-icon--primary">
                        <ClipboardList size={18} />
                    </div>
                    <div>
                        <div className="menu__bottom-stat-label">Total Items</div>
                        <div className="menu__bottom-stat-value">{stats.totalItems} Items</div>
                    </div>
                </div>
                <div className="menu__bottom-stat">
                    <div className="menu__bottom-stat-icon menu__bottom-stat-icon--warning">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <div className="menu__bottom-stat-label">Low Stock</div>
                        <div className="menu__bottom-stat-value">{stats.lowStock} Items</div>
                    </div>
                </div>
                <div className="menu__bottom-stat desktop-only">
                    <div className="menu__bottom-stat-icon menu__bottom-stat-icon--success">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <div className="menu__bottom-stat-label">Most Ordered</div>
                        <div className="menu__bottom-stat-value">{stats.mostOrdered}</div>
                    </div>
                </div>
            </div>

            {/* Food grid */}
            <div className="menu__content">
                <div className="menu__grid">
                    {items.map((item) => (
                        <div className={`menu__food-card ${item.outOfStock ? 'is-out-of-stock' : ''}`} key={item.id}>
                            <div className="menu__food-image">
                                <div
                                    className="menu__food-image-placeholder"
                                    style={{ background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}99 100%)` }}
                                >
                                    🍽
                                </div>
                                {item.veg && <div className="menu__veg-badge">VEG</div>}
                                {item.bestseller && <div className="menu__bestseller-badge mobile-only">BESTSELLER</div>}
                                {item.outOfStock && <div className="menu__out-of-stock desktop-only">Out of Stock</div>}
                            </div>
                            <div className="menu__food-info">
                                <div className="menu__food-primary">
                                    <div className="menu__food-name">
                                        {item.name}
                                        {item.outOfStock && <span className="mobile-only menu__status-text">Out of Stock</span>}
                                    </div>
                                    <div className="menu__food-price">${item.price.toFixed(2)}</div>
                                </div>
                                <div className="menu__food-toggle">
                                    <span className="desktop-only">{item.available ? 'Available' : 'Unavailable'}</span>
                                    <div
                                        className={`toggle ${item.available ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); handleToggle(item.id); }}
                                    />
                                </div>
                                {item.comment && (
                                    <div className="menu__food-comment">
                                        "{item.comment}"
                                    </div>
                                )}
                                <div className="menu__food-actions">
                                    <button className="btn-icon" onClick={(e) => handleEdit(item, e)} title="Edit">
                                        <ChevronRight size={18} />
                                    </button>
                                    <button className="btn-icon btn-icon--danger" onClick={(e) => handleDelete(item.id, e)} title="Delete">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add new dish - Desktop only */}
                    <div className="menu__add-card desktop-only" onClick={openAddModal}>
                        <div className="menu__add-icon">
                            <Plus size={22} />
                        </div>
                        <h4>Add New Dish</h4>
                        <p>Expand your menu with new tasty creations</p>
                    </div>
                </div>
            </div>

            {/* =================== ADD ITEM MODAL =================== */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                            <button className="modal__close" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal__body">
                            <div className="form-group">
                                <label>Dish Name</label>
                                <input type="text" placeholder="e.g. Paneer Butter Masala" value={formName} onChange={(e) => setFormName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input type="number" step="0.01" placeholder="e.g. 12.99" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Dietary</label>
                                <div className="form-toggle-row">
                                    <span>{formVeg ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}</span>
                                    <div className={`toggle ${formVeg ? 'active' : ''}`} onClick={() => setFormVeg(!formVeg)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea
                                    placeholder="e.g. Spicy, contains nuts, gluten-free..."
                                    value={formComment}
                                    onChange={(e) => setFormComment(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="modal__footer">
                            <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleAdd}>{editingItem ? 'Save Changes' : 'Add to Menu'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
