'use client'
import React, { useEffect, useState } from 'react';
import './WidgetA.css';

interface WidgetAProps {
  userEmail: string;
}
interface ResultItem {
  title: string;
  url: string;
  snippet: string;
  date?: string;
  last_updated?: string;
}
interface SearchHistoryItem {
  _id: string;
  query: string;
  result: { results: ResultItem[] };
  status: string;
  emailSent: boolean;
  createdAt?: string;
}

const WidgetA: React.FC<WidgetAProps> = ({ userEmail }) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingNewChat, setSendingNewChat] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const draggingRef = React.useRef(false);

  // Drag bar handlers
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

  // Fetch history
  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_URL}/api/myai/history?userEmail=${userEmail}`
      );
      const data = await res.json();
      setHistory(Array.isArray(data.data) ? data.data.reverse() : []);
    }
    fetchHistory();
  }, [userEmail]);
  useEffect(() => {
    if (history.length && activeIdx === null) setActiveIdx(0);
  }, [history]);

  const refreshHistory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_URL}/api/myai/history?userEmail=${userEmail}`
      );
      const data = await res.json();
      setHistory(Array.isArray(data.data) ? data.data.reverse() : []);
      setActiveIdx(current => current);
      setInput('');
    } catch (e) { alert('Failed to refresh history.'); }
    finally { setTimeout(() => setRefreshing(false), 2000); }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setSendingNewChat(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_URL}/api/add-job`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: input, userEmail })
        }
      );
      await refreshHistory();
      await new Promise(res => setTimeout(res, 3000));
      const hisRes = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_URL}/api/myai/history?userEmail=${userEmail}`
      );
      const hisData = await hisRes.json();
      await new Promise(res => setTimeout(res, 1000));
      setHistory(Array.isArray(hisData.data) ? hisData.data.reverse() : []);
      setActiveIdx(0);
      setInput('');
    } catch (e) { alert('Failed to send search.'); }
    finally { setSendingNewChat(false) }
  };

  const handleNewChat = () => {
    setActiveIdx(null);
    setInput('');
  };

  const handleDeleteChat = async (_id: string, idx: number) => {
    if (!window.confirm('Delete this chat?')) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LIVE_URL}/api/myai/history/${_id}?userEmail=${userEmail}`,
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
      } else { alert("Failed to delete."); }
    } catch (e) { alert("Failed to delete."); }
    setMenuOpenIdx(null); setEditIdx(null);
  };

  const handleRenameChat = async (_id: string, idx: number) => {
    if (!editValue.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LIVE_URL}/api/myai/history/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId: _id, newQuery: editValue, userEmail })
      });
      const data = await res.json();
      if (data.success) {
        setHistory(prev =>
          prev.map((h, i) => i === idx ? { ...h, query: editValue } : h)
        );
      } else { alert("Rename failed."); }
    } catch { alert('Rename error'); }
    setEditIdx(null); setMenuOpenIdx(null);
  };

  const active = activeIdx !== null ? history[activeIdx] : null;

  return (
    <div className="widgeta-root" style={{ userSelect: draggingRef.current ? 'none' : 'auto' }}>
      {/* Sidebar */}
      <div className="widgeta-sidebar" style={{ width: sidebarWidth }}>
        <div className="widgeta-sidebar-header">
          <button className="widgeta-newchat-btn" onClick={handleNewChat}>
            + New Chat
          </button>
          <span style={{ marginLeft: 10 }}>My Searches</span>
        </div>
        <div className="widgeta-sidebar-list">
          {history.length === 0 && (
            <div style={{ color: '#888', margin: 18 }}>No history yet</div>
          )}
          {history.map((item, idx) => (
            <div
              key={item._id}
              className={"widgeta-sidebar-item" + (activeIdx === idx ? " active" : "")}
              onClick={() => setActiveIdx(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {/* Edit input for Rename */}
              {editIdx === idx ? (
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => setEditIdx(null)}
                  onKeyDown={e => e.key === 'Enter' ? handleRenameChat(item._id, idx) : undefined}
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
                <span style={{
                  flex: 1,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>
                  {item.query}
                  <span className={item.status === "completed" ? "widgeta-status-green" : "widgeta-status-yellow"}>
                    {item.status === "completed" ? "✔" : ""}
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
              {/* POPUP MENU: direct child of sidebar-item! */}
              {menuOpenIdx === idx && (
                <div className="widgeta-popup-menu"
                  style={{ position: 'absolute', right: 12, top: 40, zIndex: 300 }}>
                  <button onClick={e => {
                    e.stopPropagation();
                    setEditIdx(idx);
                    setEditValue(item.query);
                    setMenuOpenIdx(null);
                  }}>Rename</button>
                  <button onClick={e => {
                    e.stopPropagation();
                    handleDeleteChat(item._id, idx);
                    setMenuOpenIdx(null);
                  }}>Delete</button>
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
        {sendingNewChat && (
          <div className="widgeta-loader-overlay">
            <div className="widgeta-loader" />
          </div>
        )}
        {refreshing && (
          <div className="widgeta-loader-overlay">
            <div className="widgeta-loader" />
          </div>
        )}
        <div className="widgeta-header-actions">
          <button className="widgeta-refresh-btn" onClick={refreshHistory} title="Refresh" style={{ float: 'right' }}>
            Refresh &#x21bb;
          </button>
        </div>
        <div className="widgeta-bar">
          <input
            placeholder="Type your search, ask anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? handleSend() : undefined}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <div className="widgeta-results">
          {activeIdx === null ? (
            <div className="widgeta-empty" style={{ fontSize: 22 }}>
              Start a chat or type a question to begin...
            </div>
          ) : active ? (
            <>
              <div className="widgeta-query-header">{active.query}</div>
              {(active.result?.results || []).slice(0, 10).map((res, idx) => (
                <div className="widgeta-result-card" key={res.url || idx}>
                  <div className="widgeta-title">{res.title}</div>
                  <div className="widgeta-snippet">{res.snippet}</div>
                  <a
                    className="widgeta-link"
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Source
                  </a>
                  <div className="widgeta-meta">
                    {res.date && <>Published: {res.date}<br /></>}
                    {res.last_updated && <>Updated: {res.last_updated}</>}
                  </div>
                </div>
              ))}
              <div className="widgeta-status-row">
                Status: {active.status} {active.emailSent ? "📧 (Email sent)" : ""}
              </div>
            </>
          ) : (
            <div className="widgeta-empty" style={{ fontSize: 22 }}>
              Start a chat or select a history to view results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetA;
