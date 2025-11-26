'use client';
import React, { useEffect, useState, useRef } from 'react';
import '../WidgetA/WidgetA';
interface ResultItem {
  title: string;
  link: string;
  snippet: string;
  displayLink?: string;
}

interface SearchHistoryItem {
  _id: string;
  query: string;
  result: { results: ResultItem[] };
  status: string;
  emailSent: boolean;
  createdAt?: string;
}

interface GoogleSearchWidgetProps {
  userEmail: string;
  onBack: () => void;
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const GoogleSearchWidget: React.FC<GoogleSearchWidgetProps> = ({ userEmail, onBack }) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [sendingNewChat, setSendingNewChat] = useState(false);
  const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const draggingRef = useRef(false);

  const onMouseDown = () => { draggingRef.current = true; };
  const onMouseUp = () => { draggingRef.current = false; };
  const onMouseMove = (e: MouseEvent) => {
    if (draggingRef.current) {
      const newWidth = Math.min(Math.max(e.clientX, 220), 600);
      setSidebarWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_URL}/api/google/history?userEmail=${userEmail}`
      );
      const data = await res.json();
      const reversed = Array.isArray(data.data) ? data.data.reverse() : [];
      setHistory(reversed);
      if (reversed.length && activeIdx === null) setActiveIdx(0);
    } catch {
      alert('Failed to load history.');
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userEmail]);

  const refreshHistory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_URL}/api/google/history?userEmail=${userEmail}`
      );
      const data = await res.json();
      setHistory(Array.isArray(data.data) ? data.data.reverse() : []);
      setActiveIdx(curr => (curr !== null ? curr : 0));
      setInput('');
    } catch {
      alert('Failed to refresh history.');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setSendingNewChat(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_LIVE_URL}/api/add-google-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, userEmail }),
      });

      await refreshHistory();

      await sleep(4500); // Loader delay like WidgetA

      await refreshHistory();

      setActiveIdx(0);
      setInput('');
    } catch {
      alert('Failed to send search.');
    } finally {
      setSendingNewChat(false);
    }
  };

  const handleNewChat = () => {
    setActiveIdx(null);
    setInput('');
  };

  const handleDeleteChat = async (_id: string, idx: number) => {
    if (!window.confirm('Delete this search?')) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_URL}/api/google/history/${_id}?userEmail=${userEmail}`,
        { method: 'DELETE' }
      );
      const data = await res.json();

      if (data.success) {
        setHistory(prev => prev.filter(item => item._id !== _id));
        if (activeIdx === idx) {
          setActiveIdx(history.length > 1 ? (idx > 0 ? idx - 1 : 0) : null);
        } else if (activeIdx && activeIdx > idx) {
          setActiveIdx(activeIdx - 1);
        }
      } else {
        alert('Failed to delete.');
      }
    } catch {
      alert('Failed to delete.');
    }
    setMenuOpenIdx(null);
    setEditIdx(null);
  };

  const handleRenameChat = async (_id: string, idx: number) => {
    if (!editValue.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LIVE_URL}/api/google/history/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId: _id, newQuery: editValue, userEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setHistory(prev =>
          prev.map((h, i) => (i === idx ? { ...h, query: editValue } : h))
        );
      } else {
        alert('Rename failed.');
      }
    } catch {
      alert('Rename error');
    }
    setEditIdx(null);
    setMenuOpenIdx(null);
  };

  const active = activeIdx !== null ? history[activeIdx] : null;

  return (
    <div className="widgeta-root" style={{ userSelect: draggingRef.current ? 'none' : 'auto' }}>
      {/* Sidebar */}
      <div className="widgeta-sidebar" style={{ width: sidebarWidth }}>
        <div className="widgeta-sidebar-header">
          <button className="widgeta-newchat-btn" onClick={handleNewChat}>
            + New Search
          </button>
          <span style={{ marginLeft: 10 }}>Google History</span>
        </div>
        <div className="widgeta-sidebar-list">
          {history.length === 0 && (
            <div style={{ color: '#888', margin: 18 }}>No Google history yet</div>
          )}
          {history.map((item, idx) => (
            <div
              key={item._id}
              className={'widgeta-sidebar-item' + (activeIdx === idx ? ' active' : '')}
              onClick={() => setActiveIdx(idx)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}
            >
              {editIdx === idx ? (
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => setEditIdx(null)}
                  onKeyDown={e => (e.key === 'Enter' ? handleRenameChat(item._id, idx) : undefined)}
                  autoFocus
                  style={{
                    flex: 1,
                    fontSize: 16,
                    borderRadius: 5,
                    border: '1px solid #4adafa',
                    padding: '2px 7px',
                    background: '#25315a',
                    color: '#e4e4ef'
                  }}
                />
              ) : (
                <span style={{ flex: 1, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                  {item.query}
                  <span className={item.status === 'completed' ? 'widgeta-status-green' : 'widgeta-status-yellow'}>
                    {item.status === 'completed' ? '✔' : ''}
                  </span>
                  {item.emailSent && (
                    <span className="widgeta-status-email" title="Email sent">📧</span>
                  )}
                </span>
              )}

              <button
                className="widgeta-menu-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a3acc4',
                  cursor: 'pointer',
                  fontSize: 18,
                  marginLeft: 5,
                  borderRadius: 5,
                  padding: '0 3px'
                }}
                onClick={e => {
                  e.stopPropagation();
                  setMenuOpenIdx(menuOpenIdx === idx ? null : idx);
                  setEditIdx(null);
                }}
              >
                &#8942;
              </button>

              {menuOpenIdx === idx && (
                <div className="widgeta-popup-menu" style={{ position: 'absolute', right: 12, top: 40, zIndex: 300 }}>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setEditIdx(idx);
                      setEditValue(item.query);
                      setMenuOpenIdx(null);
                    }}
                  >Rename</button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteChat(item._id, idx);
                      setMenuOpenIdx(null);
                    }}
                  >Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Drag bar */}
      <div className="widgeta-drag-bar" style={{ zIndex: 1 }} onMouseDown={onMouseDown} />

      {/* Main Panel */}
      <div className="widgeta-main">
        {(sendingNewChat) && (
          <div className="widgeta-loader-overlay">
            <div className="widgeta-loader" />
          </div>
        )}

        <div className="widgeta-header-actions">
          <button
            onClick={onBack}
            style={{
              margin: 16,
              background: '#f0f0f0',
              border: '1px solid #aaa',
              padding: '8px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ← Back to Widgets
          </button>
        </div>

        <div className="widgeta-bar">
          <input
            placeholder="Type your Google search..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => (e.key === 'Enter' ? handleSend() : undefined)}
            disabled={sendingNewChat}
          />
          <button onClick={handleSend} disabled={sendingNewChat || !input.trim()}>
            {sendingNewChat ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="widgeta-results">
          {!active ? (
            <div className="widgeta-empty" style={{ fontSize: 22 }}>
              Start a search or pick history.
            </div>
          ) : (
            <>
              <div className="widgeta-query-header">{active.query}</div>
              {(active.result?.results || []).slice(0, 10).map((res, idx) => (
                <div className="widgeta-result-card" key={res.link || idx}>
                  <div className="widgeta-title">{res.title}</div>
                  <div className="widgeta-snippet">{res.snippet}</div>
                  <a
                    className="widgeta-link"
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Source
                  </a>
                </div>
              ))}
              <div className="widgeta-status-row">
                Status: {active.status} {active.emailSent ? '📧 (Email sent)' : ''}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleSearchWidget;
