// frontend/src/pages/Stats.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE = process.env.REACT_APP_BASE_URL || '';

export default function Stats() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // <-- defines setError

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch((BASE ? `${BASE}` : '') +  `/api/links/${encodeURIComponent(code)}`);
        const text = await res.text();
        let data;
        try { data = text ? JSON.parse(text) : null; } catch { throw new Error('Invalid JSON'); }
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        setLink(data);
      } catch (err) {
        console.error('Failed to load stats', err);
        setError('Could not load stats.');
      } finally {
        setLoading(false);
      }
    }
    if (code) load();
  }, [code]);

  async function handleDelete() { // <-- defined here so no no-undef
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm(`Delete ${code}?`)) return;
    try {
      const res = await fetch((BASE ? `${BASE}` : '') +  `/api/links/${encodeURIComponent(code)}`, { method: 'DELETE' });
      const text = await res.text();
      let body;
      try { body = text ? JSON.parse(text) : null; } catch {}
      if (!res.ok) {
        alert(body?.error || `Delete failed ${res.status}`);
        return;
      }
      alert('Deleted');
      navigate('/');
    } catch (err) {
      console.error('Delete error', err);
      alert('Network/delete error');
    }
  }

  if (loading) return <div className="p-4">Loading stats...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!link) return <div className="p-4">No data for this code.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Stats for <span className="font-mono">{link.code}</span></h1>

      <div className="mb-4">
        <div><strong>Target URL:</strong> <a href={link.url} target="_blank" rel="noreferrer">{link.url}</a></div>
        <div><strong>Total clicks:</strong> {link.totalClicks ?? 0}</div>
        <div><strong>Last clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}</div>
        <div><strong>Created at:</strong> {link.createdAt ? new Date(link.createdAt).toLocaleString() : '-'}</div>
      </div>

      <div className="space-x-2">
        <a className="px-4 py-2 bg-green-600 text-white rounded" href={(BASE || window.location.origin) + '/' + link.code} target="_blank" rel="noreferrer">Open Link</a>
        <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDelete}>Delete</button>
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}
