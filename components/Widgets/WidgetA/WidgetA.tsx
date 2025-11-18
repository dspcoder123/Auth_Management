'use client'
import React, { useEffect, useState } from 'react';
import './WidgetA.css';

// const USER_EMAIL = 'kuddana41916@gmail.com';

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
  const draggingRef = React.useRef(false);

const onMouseDown = () => {
  draggingRef.current = true;
};
const onMouseUp = () => {
  draggingRef.current = false;
};
const onMouseMove = (e: MouseEvent) => {
  if (draggingRef.current) {
    // Limit width between 220 and 600 for example
    const newWidth = Math.min(Math.max(e.clientX, 220), 600);
    setSidebarWidth(newWidth);
  }
};

// Attach and cleanup listeners
useEffect(() => {
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseMove);
  return () => {
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
  }
}, []);



  // Fetch history on mount
  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/myai/history?userEmail=${userEmail}`
      );
      const data = await res.json();
      setHistory(Array.isArray(data.data) ? data.data.reverse() : []);
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    if (history.length && activeIdx === null) setActiveIdx(0);
  }, [history]);

  const refreshHistory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/myai/history?userEmail=${userEmail}`
      );
      const data = await res.json();
      setHistory(Array.isArray(data.data) ? data.data.reverse() : []);
      // Keep current activeIdx without forcing reset to 0
      // If user is in New Chat (activeIdx=null), keep it as null
      setActiveIdx(current => current);
      setInput('');
    } catch (e) {
      alert('Failed to refresh history.');
    } finally {
      setTimeout(() => setRefreshing(false), 2000);
    }
  };


  // Handle sending a new search
  const handleSend = async () => {
    if (!input.trim()) return;
    setSendingNewChat(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/add-job`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: input, userEmail: userEmail })
        }
      );
      const refreshPromise = refreshHistory();

      await Promise.all([refreshPromise]);
  
      // Wait minimum 3 seconds for better UX
      await new Promise(resolve => setTimeout(resolve, 3000));
      // After job is added, fetch updated history
      const hisRes = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/myai/history?userEmail=${userEmail}`
      );
      const hisData = await hisRes.json();
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHistory(Array.isArray(hisData.data) ? hisData.data.reverse() : []);
      setActiveIdx(0);
      setInput('');
    } catch (e) {
      alert('Failed to send search.');
    } finally {
      setSendingNewChat(false)
    }
  };

  const handleNewChat = () => {
    setActiveIdx(null);
    setInput('');
  };

  // const refreshHistory = async () => {
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/myai/history?userEmail=${USER_EMAIL}`
  //   );
  //   const data = await res.json();
  //   setHistory(Array.isArray(data.data) ? data.data.reverse() : []);
  //   setActiveIdx(history.length > 0 ? 0 : null); // Optional: select latest after refresh
  //   setInput('');
  // };


  const active = activeIdx !== null ? history[activeIdx] : null;

  return (
    <div className="widgeta-root" style={{ userSelect: draggingRef.current ? 'none' : 'auto' }}>
      {/* Sidebar */}
      <div className="widgeta-sidebar" style={{ width: sidebarWidth }}>
        <div className="widgeta-sidebar-header">
          <button
            className="widgeta-newchat-btn"
            onClick={handleNewChat}
          >
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
              className={
                "widgeta-sidebar-item" +
                (activeIdx === idx ? " active" : "")
              }
              onClick={() => setActiveIdx(idx)}
            >
              {item.query}
              <span className={item.status === "completed" ? "widgeta-status-green" : "widgeta-status-yellow"}>
                {item.status === "completed" ? "✔" : ""}
              </span>
              {item.emailSent && (
                <span className="widgeta-status-email" title="Email sent">📧</span>
              )}
            </div>
          ))}
        </div>
      </div>
       {/* Draggable divider between */}
  <div
    style={{
      width: 6,
      cursor: 'ew-resize',
      backgroundColor: '#223057',
      userSelect: 'none'
    }}
    onMouseDown={onMouseDown}
  />
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
          <button
            className="widgeta-refresh-btn"
            onClick={refreshHistory}
            title="Refresh"
            style={{ float: 'right' }}
          >
            Refresh &#x21bb; {/* Unicode clockwise open circle arrow */}
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
        {/* Results vertically stacked */}
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
