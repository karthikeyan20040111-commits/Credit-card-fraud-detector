'use client';

import { AlertTriangle, MapPin, DollarSign } from 'lucide-react';

export function FraudAlerts() {
  return (
    <div className="alerts-page">
      {/* High Priority Alert Banner */}
      <div className="alert-priority-banner">
        <div className="alert-priority-left">
          <div className="alert-priority-icon">
            <AlertTriangle size={20} color="#dc2626" />
          </div>
          <div>
            <div className="alert-priority-title">High Priority Alert</div>
            <div className="alert-priority-desc">
              Multiple transactions detected in a short time frame from{' '}
              <strong>Paris, France</strong>. Amount: <strong>$4,250.00</strong>.
            </div>
          </div>
        </div>
        <button className="alert-block-btn">Block Account</button>
      </div>

      {/* Recent Suspicious Activities */}
      <div className="alerts-section">
        <h2 className="alerts-section-title">Recent Suspicious Activities</h2>

        {/* Activity 1 */}
        <div className="alert-item">
          <div className="alert-item-header">
            <div className="alert-item-left">
              <div className="alert-item-icon location">
                <MapPin size={14} color="#dc2626" />
              </div>
              <div>
                <div className="alert-item-title location">Unknown Location Detection</div>
                <div className="alert-item-desc">
                  Transaction ID TXN-993821 from an unrecognized IP in Moscow, Russia. Score: 0.94
                </div>
                <div className="alert-item-meta">
                  User: victim_user_22 (Notified via email 📧 )
                </div>
              </div>
            </div>
            <span className="alert-item-time">3 mins ago</span>
          </div>
        </div>

        <div className="alert-divider" />

        {/* Activity 2 */}
        <div className="alert-item">
          <div className="alert-item-header">
            <div className="alert-item-left">
              <div className="alert-item-icon amount">
                <DollarSign size={14} color="#d97706" />
              </div>
              <div>
                <div className="alert-item-title amount">Unusually High Amount</div>
                <div className="alert-item-desc">
                  A charge of $8,400.00 at an Electronics Merchant, exceeding normal limit of $500.
                </div>
                <div style={{ marginTop: 10 }}>
                  <button className="alert-investigate-btn">Investigate</button>
                </div>
              </div>
            </div>
            <span className="alert-item-time">15 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
