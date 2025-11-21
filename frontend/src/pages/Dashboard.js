// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import AddLinkForm from '../components/AddLinkForm';
import { Link as RouterLink } from 'react-router-dom';

const BASE = process.env.REACT_APP_BASE_URL || ''; // http://localhost:4000

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // <-- defines setError

  async function fetchLinks() {
    setLoading(true);
    setError('');
    const urlToCall = (BASE ? BASE : '') + '/api/links';
    try {
      const res = await fetch(urlToCall);
      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : []; } catch { throw new Error('Invalid JSON from server'); }
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setLinks(data);
    } catch (err) {
      console.error('Failed to fetch links', err);
      setError('Could not load links. Check backend.');
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  // <-- defines handleDelete in same scope
  async function handleDelete(code) {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm(`Delete ${code}?`)) return;

    try {
      const res = await fetch((BASE ? BASE : '') + `/api/links/${encodeURIComponent(code)}`, { method: 'DELETE' });
      const text = await res.text();
      let body;
      try { body = text ? JSON.parse(text) : null; } catch {}
      if (!res.ok) {
        alert(body?.error || `Delete failed ${res.status}`);
        return;
      }
      fetchLinks();
    } catch (err) {
      console.error('Delete error', err);
      alert('Network/delete error');
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TinyLink Dashboard</h1>

      <AddLinkForm onAdded={fetchLinks} />

      {loading && <p>Loading links...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && links.length === 0 && <p>No links yet — create one above.</p>}

      {!loading && !error && links.length > 0 && (
        <table className="w-full mt-4 table-auto">
          <thead>
            <tr><th>Code</th><th>Target</th><th>Clicks</th><th>Last clicked</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {links.map(l => (
              <tr key={l.code}>
                <td><a href={`${BASE || window.location.origin}/${l.code}`} target="_blank" rel="noreferrer">{l.code}</a></td>
                <td style={{maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{l.url}</td>
                <td>{l.totalClicks ?? 0}</td>
                <td>{l.lastClicked ? new Date(l.lastClicked).toLocaleString() : '-'}</td>
                <td>
                  <button onClick={() => navigator.clipboard.writeText((BASE || window.location.origin) + '/' + l.code)}>Copy</button>
                  <button onClick={() => handleDelete(l.code)}>Delete</button>
                  <RouterLink to={`/code/${l.code}`}>Stats</RouterLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
