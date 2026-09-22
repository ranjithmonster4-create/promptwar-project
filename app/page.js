'use client';
import { useState } from 'react';

export default function Home() {
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const [communityList, setCommunityList] = useState([
    { id: 1, site: 'fake-tickets-deal.com', pattern: 'Hidden $12.99 Service Fee at Checkout', score: 92, votes: 45 },
    { id: 2, site: 'cheap-sub-service.net', pattern: 'Pre-checked $9.99 VIP Membership Box', score: 85, votes: 32 },
  ]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!inputData) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputData }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      alert('Error analyzing input.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = (id) => {
    setCommunityList(prev =>
      prev.map(item => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
    );
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#818cf8' }}>
            🛡️ Dark Pattern & Hidden Fee Detector
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>
            Scan e-commerce sites for deceptive layouts, sneaky pre-checked boxes, and hidden recurring fees.
          </p>
        </header>

        <section style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
          <form onSubmit={handleScan}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1' }}>
              Website URL or Checkout Text / Disclaimers
            </label>
            <textarea
              rows={4}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Paste checkout text, site link, or offer terms..."
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
                marginBottom: '16px'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Analyzing with Gemini AI...' : 'Scan For Dark Patterns'}
            </button>
          </form>
        </section>

        {scanResult && (
          <section style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{scanResult.site_name || 'Scan Report'}</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>{scanResult.hidden_fee_summary}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>Deception Index</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: scanResult.threat_score > 60 ? '#ef4444' : '#10b981' }}>
                  {scanResult.threat_score}/100
                </span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Flagged Elements:</h3>
              {scanResult.flagged_patterns?.map((pattern, idx) => (
                <div key={idx} style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>⚠️ {pattern.type}</span>
                  <span style={{ fontSize: '12px', marginLeft: '8px', color: '#ef4444' }}>[{pattern.severity} Severity]</span>
                  <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>{pattern.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Community Hall of Shame</h2>
          {communityList.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: '#818cf8', margin: 0 }}>{item.site}</h4>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>{item.pattern}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ef4444' }}>Score: {item.score}%</span>
                <button
                  onClick={() => handleUpvote(item.id)}
                  style={{ padding: '6px 12px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  👍 {item.votes}
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
