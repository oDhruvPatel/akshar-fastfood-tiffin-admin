import { useState, useEffect } from 'react';
import {
    Bell,
    TrendingUp,
    Clock,
    CheckCircle,
    Download,
    BarChart3,
    ArrowUpRight,
    ArrowLeft,
    SlidersHorizontal,
    Search,
    ChevronRight,
} from 'lucide-react';
import { paymentsApi } from '../services/api';
import type { Transaction } from '../services/api';
import './Payments.css';

const statusBadgeClass: Record<string, string> = {
    Settled: 'badge--success',
    Clearing: 'badge--warning',
    Refunded: 'badge--danger',
    Completed: 'badge--success',
    Pending: 'badge--warning',
};

export default function Payments() {
    const [summary, setSummary] = useState({ balance: 0, totalEarnings: 0, pendingPayouts: 0, completedPayouts: 0 });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [earnings, setEarnings] = useState({ totalEarnings: 0, settledAmount: 0, pendingAmount: 0, refundedAmount: 0, transactionCount: 0 });

    useEffect(() => {
        paymentsApi.getSummary().then(setSummary).catch(console.error);
        paymentsApi.getTransactions().then(setTransactions).catch(console.error);
        paymentsApi.getEarnings().then(setEarnings).catch(console.error);
    }, []);

    const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="payments">
            {/* Desktop Top bar */}
            <div className="payments__top-bar desktop-only">
                <div className="payments__notification">
                    <Bell size={18} />
                </div>
                <div className="payments__user-badge">
                    <div className="payments__user-badge-info">
                        <div className="payments__user-badge-name">Rohan Patel</div>
                        <div className="payments__user-badge-role">Store Manager</div>
                    </div>
                    <div className="payments__user-avatar">RP</div>
                </div>
            </div>

            {/* Header */}
            <div className="payments__header">
                <div className="payments__header-left">
                    <button className="mobile-only payments__back-btn">
                        <ArrowLeft size={20} />
                    </button>
                    <h1>Earnings & Payouts</h1>
                </div>
                <div className="payments__header-actions">
                    <button className="payments__action-icon">
                        <SlidersHorizontal size={20} />
                    </button>
                    <button className="payments__action-icon">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Balance Hero */}
            <div className="mobile-only payments__balance-hero">
                <div className="balance-hero__label">TOTAL BALANCE (CAD)</div>
                <div className="balance-hero__value">${fmt(summary.balance)}</div>
                <button className="balance-hero__btn">
                    WITHDRAW FUNDS <ChevronRight size={16} />
                </button>
            </div>

            {/* Earnings cards */}
            <div className="payments__earnings">
                <div className="payments__earning-card payments__earning-card--primary desktop-only">
                    <div className="payments__earning-header">
                        <span className="payments__earning-label">Total Earnings</span>
                        <div className="payments__earning-icon payments__earning-icon--up">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <div className="payments__earning-value">${fmt(summary.totalEarnings)}</div>
                    <div className="payments__earning-sub payments__earning-sub--success">
                        ↑ 12% from last month
                    </div>
                </div>

                <div className="payments__earning-card">
                    <div className="payments__earning-header">
                        <span className="payments__earning-label">Today's Revenue</span>
                        <div className="payments__earning-icon payments__earning-icon--up mobile-only">
                            <TrendingUp size={16} />
                        </div>
                        <div className="payments__earning-icon payments__earning-icon--pending desktop-only">
                            <Clock size={16} />
                        </div>
                    </div>
                    <div className="payments__earning-value">${fmt(earnings.settledAmount)}</div>
                    <div className="payments__earning-sub desktop-only">
                        Next payout on Mar 30
                    </div>
                    <div className="payments__earning-sub--success mobile-only">
                        ↑ 8% Today
                    </div>
                </div>

                <div className="payments__earning-card">
                    <div className="payments__earning-header">
                        <span className="payments__earning-label">Pending Clearance</span>
                        <div className="payments__earning-icon payments__earning-icon--pending mobile-only">
                            <Clock size={16} />
                        </div>
                        <div className="payments__earning-icon payments__earning-icon--done desktop-only">
                            <CheckCircle size={16} />
                        </div>
                    </div>
                    <div className="payments__earning-value">${fmt(earnings.pendingAmount)}</div>
                    <div className="payments__earning-sub desktop-only">
                        Processed on Mar 15, 2026
                    </div>
                    <div className="payments__earning-sub mobile-only">
                        Expected tomorrow
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="payments__content">
                {/* Transactions */}
                <div className="payments__transactions">
                    <div className="payments__transactions-header">
                        <h3>Account Activity</h3>
                        <span className="payments__view-statement">
                            View Statement <Download size={14} />
                        </span>
                    </div>

                    {/* Desktop Table */}
                    <table className="payments__table desktop-only">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Order ID</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>{tx.date}</td>
                                    <td>{tx.orderId}</td>
                                    <td>${tx.amount.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${statusBadgeClass[tx.status] || 'badge--neutral'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Activity List */}
                    <div className="mobile-only payments__activity-list">
                        {transactions.map((tx) => (
                            <div className="activity-item" key={tx.id}>
                                <div className="activity-item__left">
                                    <div className="activity-item__id">{tx.orderId}</div>
                                    <div className="activity-item__time">{tx.time} • {tx.date}</div>
                                </div>
                                <div className="activity-item__right">
                                    <div className="activity-item__amount">${tx.amount.toFixed(2)}</div>
                                    <div className={`activity-item__status ${tx.status === 'Settled' ? 'text-success' :
                                        tx.status === 'Clearing' ? 'text-warning' : 'text-danger'
                                        }`}>
                                        {tx.status.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="payments__sidebar">

                    {/* Quick Stats - Desktop only */}
                    <div className="payments__quick-stats desktop-only">
                        <h3>Quick Stats</h3>
                        <div className="payments__quick-stat-item">
                            <div>
                                <div className="payments__quick-stat-label">Settled</div>
                                <div className="payments__quick-stat-value">${fmt(earnings.settledAmount)}</div>
                            </div>
                            <div className="payments__quick-stat-icon">
                                <BarChart3 size={20} />
                            </div>
                        </div>
                        <div className="payments__quick-stat-item">
                            <div>
                                <div className="payments__quick-stat-label">Refunded</div>
                                <div className="payments__quick-stat-value">${fmt(earnings.refundedAmount)}</div>
                            </div>
                            <div className="payments__quick-stat-icon">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                        <div className="payments__quick-stat-item">
                            <div>
                                <div className="payments__quick-stat-label">Transactions</div>
                                <div className="payments__quick-stat-value">{earnings.transactionCount}</div>
                            </div>
                            <div className="payments__quick-stat-icon">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
