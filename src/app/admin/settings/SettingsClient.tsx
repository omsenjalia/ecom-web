'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSettings } from './actions';

interface Props {
  initialSettings: Record<string, string>;
}

export default function SettingsClient({ initialSettings }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateSettings(settings);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Manage store configuration and content</p>
        </div>
      </div>

      {error && <div className="admin-login-error" style={{ marginBottom: '1rem' }}>{error}</div>}
      {success && (
        <div className="admin-card" style={{ marginBottom: '1rem', background: '#dcfce7', borderColor: '#bbf7d0', padding: '1rem' }}>
          <p style={{ color: '#15803d', fontWeight: 600, fontSize: '0.8125rem' }}>Settings saved successfully.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          
          <div className="admin-card">
            <h2 className="admin-section-title">Store Operations</h2>
            <div className="admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-label">GST Percentage (%)</label>
                <input
                  type="number"
                  value={settings['gst_percent'] || ''}
                  onChange={(e) => handleChange('gst_percent', e.target.value)}
                  className="admin-input"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Shipping Fee (₹)</label>
                <input
                  type="number"
                  value={settings['shipping_fee'] || ''}
                  onChange={(e) => handleChange('shipping_fee', e.target.value)}
                  className="admin-input"
                  min="0"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Free Shipping Threshold (₹)</label>
                <input
                  type="number"
                  value={settings['free_shipping_threshold'] || ''}
                  onChange={(e) => handleChange('free_shipping_threshold', e.target.value)}
                  className="admin-input"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2 className="admin-section-title">Contact Information</h2>
            <div className="admin-form-group">
              <label className="admin-label">WhatsApp Number</label>
              <input
                type="text"
                value={settings['whatsapp_number'] || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="admin-input"
                placeholder="e.g. 919876543210"
              />
              <p className="admin-help-text">Include country code without '+' (e.g., 91 for India)</p>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Contact Page Content</label>
              <textarea
                value={settings['contact_page_text'] || ''}
                onChange={(e) => handleChange('contact_page_text', e.target.value)}
                className="admin-textarea"
                rows={5}
                placeholder="Enter address, email, and working hours..."
              />
            </div>
          </div>

          <div className="admin-card">
            <h2 className="admin-section-title">Pages Content</h2>
            <div className="admin-form-group">
              <label className="admin-label">About Us</label>
              <textarea
                value={settings['about_page_text'] || ''}
                onChange={(e) => handleChange('about_page_text', e.target.value)}
                className="admin-textarea"
                rows={8}
                placeholder="Tell your brand story here..."
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">FAQ</label>
              <textarea
                value={settings['faq_page_text'] || ''}
                onChange={(e) => handleChange('faq_page_text', e.target.value)}
                className="admin-textarea"
                rows={8}
                placeholder="Enter FAQs..."
              />
            </div>
          </div>
        </div>

        <div className="admin-form-actions" style={{ position: 'sticky', bottom: 0, background: '#f8f9fb', padding: '1rem', marginTop: '1.5rem', zIndex: 10 }}>
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary admin-btn-lg">
            {loading ? <><span className="admin-spinner" /> Saving...</> : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
