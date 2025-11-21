import { useState } from 'react';
// use environment variable or same-origin fallback (proxy)
const BASE = process.env.REACT_APP_BASE_URL || ''; // e.g. http://localhost:4000

export default function AddLinkForm({ onAdded }){
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE = process.env.REACT_APP_BASE_URL || '';

async function submit(e) {
  e.preventDefault();
  setError('');
  setLoading(true);

  const urlToCall = (BASE ? `${BASE}` : '') + '/api/links';
  console.log('[AddLinkForm] BASE=', BASE, ' urlToCall=', urlToCall);

  try {
    const res = await fetch(urlToCall, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, code: code || undefined })
    });

    console.log('[AddLinkForm] fetch status=', res.status, 'ok=', res.ok);

    const text = await res.text();
    console.log('[AddLinkForm] response text snippet=', text.slice(0, 300));

    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch (parseErr) {
      console.warn('[AddLinkForm] response is not JSON');
    }

    if (res.status === 409) {
      setError(body?.error || 'Code already exists');
      return;
    }
    if (!res.ok) {
      setError(body?.error || `Server error ${res.status}`);
      return;
    }

    setUrl('');
    setCode('');
    onAdded?.();
  } catch (err) {
    console.error('[AddLinkForm] Network/create error', err);
    setError('Network error — is backend running and CORS configured?');
  } finally {
    setLoading(false);
  }
}

  return (
    <form onSubmit={submit} className="space-y-2">
      <div><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" required/></div>
      <div><input value={code} onChange={e=>setCode(e.target.value)} placeholder="optional code 6-8 alnum" /></div>
      <div><button disabled={loading}>{loading ? 'Creating...' : 'Create'}</button></div>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
