'use client';

import { useState } from 'react';
import { Search, Download, CheckCircle, AlertCircle, Tag, MapPin, Calendar } from 'lucide-react';

interface Transaction {
  id: string;
  dateTime: string;
  merchant: string;
  location: string;
  amount: number;
  status: 'Safe' | 'Fraud';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-141628', dateTime: '2026-04-02 03:28', merchant: 'Apple Store',  location: 'Berlin, Germany',    amount: 119.33,  status: 'Safe'  },
  { id: 'TXN-237546', dateTime: '2026-04-02 00:28', merchant: 'Best Buy',     location: 'Berlin, Germany',    amount: 40.62,   status: 'Safe'  },
  { id: 'TXN-181275', dateTime: '2026-04-01 14:28', merchant: 'Best Buy',     location: 'Paris, France',      amount: 80.62,   status: 'Safe'  },
  { id: 'TXN-347650', dateTime: '2026-04-01 04:28', merchant: 'Amazon',       location: 'Paris, France',      amount: 186.55,  status: 'Safe'  },
  { id: 'TXN-921131', dateTime: '2026-03-31 10:28', merchant: 'Amazon',       location: 'Paris, France',      amount: 164.82,  status: 'Safe'  },
  { id: 'TXN-314678', dateTime: '2026-03-31 09:28', merchant: 'Apple Store',  location: 'Tokyo, Japan',       amount: 1799.31, status: 'Fraud' },
  { id: 'TXN-289025', dateTime: '2026-03-29 16:28', merchant: 'Uber',         location: 'New York, USA',      amount: 1034.63, status: 'Fraud' },
  { id: 'TXN-228067', dateTime: '2026-03-29 16:28', merchant: 'Best Buy',     location: 'Sydney, Australia',  amount: 31.46,   status: 'Safe'  },
  { id: 'TXN-423726', dateTime: '2026-03-29 05:28', merchant: 'Walmart',      location: 'Mumbai, India',      amount: 126.91,  status: 'Safe'  },
  { id: 'TXN-889502', dateTime: '2026-03-28 23:28', merchant: 'Netflix',      location: 'Mumbai, India',      amount: 8.01,    status: 'Safe'  },
];

export function RecentTransactions() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = MOCK_TRANSACTIONS.filter((tx) => {
    const matchSearch =
      search === '' ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Statuses' || tx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="txn-page">
      {/* Filter Bar */}
      <div className="txn-filters">
        <div className="txn-search-wrap">
          <Search size={15} className="txn-search-icon" />
          <input
            className="txn-search-input"
            placeholder="Search by ID or Merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="txn-date-wrap">
          <input
            type="date"
            className="txn-date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="dd-mm-yyyy"
          />
          <Calendar size={15} className="txn-date-icon" />
        </div>

        <select
          className="txn-status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Statuses</option>
          <option>Safe</option>
          <option>Fraud</option>
        </select>

        <button className="txn-export-btn">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="txn-table-wrap">
        <table className="txn-table">
          <thead>
            <tr>
              <th>TRANSACTION ID</th>
              <th>DATE &amp; TIME</th>
              <th>MERCHANT</th>
              <th>LOCATION</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id}>
                <td className="txn-id">{tx.id}</td>
                <td className="txn-datetime">{tx.dateTime}</td>
                <td className="txn-merchant">
                  <Tag size={13} className="txn-merchant-icon" />
                  {tx.merchant}
                </td>
                <td className="txn-location">
                  <MapPin size={13} className="txn-location-icon" />
                  {tx.location}
                </td>
                <td className="txn-amount">${tx.amount.toFixed(2)}</td>
                <td>
                  {tx.status === 'Safe' ? (
                    <span className="txn-badge safe">
                      <CheckCircle size={12} />
                      Safe
                    </span>
                  ) : (
                    <span className="txn-badge fraud">
                      <AlertCircle size={12} />
                      Fraud
                    </span>
                  )}
                </td>
                <td>
                  <button className="txn-review-btn">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
