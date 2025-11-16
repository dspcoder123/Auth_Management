'use client';

import React, { useEffect, useState } from 'react';
import './myAI.css';
import auth from '../../lib/auth';
import { useRouter } from 'next/navigation';

// Fetch all widgets with category
const fetchMyAIWidgets = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/widgets/widgets?status=active`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const fetchUserWidgets = async (userEmail:any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/widgets/userWidgets?userEmail=${encodeURIComponent(userEmail)}`);
  const data = await res.json();
  // BE returns [{widgetName, ...}] so extract names
  return Array.isArray(data) ? data.map(w => w.widgetName || w) : [];
};

const addUserWidget = async (userEmail :any, widgetName:any) => {
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/widgets/userWidgets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userEmail, widgetName })
  });
};

const removeUserWidget = async (userEmail:any, widgetName:any) => {
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/widgets/userWidgets`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userEmail, widgetName })
  });
};

const MyAIPage = () => {
  const router = useRouter();
  const [localUser, setLocalUser] = useState<any>(null);
  const [widgetData, setWidgetData] = useState<any>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

  // Load user, widgets, and user selections
  useEffect(() => {
    const user = auth.getUser();
    setLocalUser(user);
    if (!user) {
      router.push('/login');
    } else {
      fetchMyAIWidgets().then((data) => {
        // Group widgets by visitCategory
        const grouped = data.reduce((acc: any, widget: any) => {
          if (!acc[widget.visitCategory]) acc[widget.visitCategory] = [];
          acc[widget.visitCategory].push(widget);
          return acc;
        }, {});
        setWidgetData(grouped);
      });
      // fetch user widgets
      fetchUserWidgets(user.email).then(setSelectedWidgets);
    }
  }, []);

  if (!localUser) return null;

  const categories = Object.keys(widgetData);

  // Add widget (persistent)
  const handleAddWidget = async (widgetLabel: string) => {
    setSelectedWidgets((prev) => [...prev, widgetLabel]);
    await addUserWidget(localUser.email, widgetLabel);
  };

  // Remove widget (persistent)
  const handleRemoveWidget = async (widgetLabel: string) => {
    setSelectedWidgets((prev) => prev.filter((w) => w !== widgetLabel));
    await removeUserWidget(localUser.email, widgetLabel);
  };

  return (
    <div className="container">
      <div className="addButtonWrapper">
        <button
          className="addButton"
          onClick={() => setDropdownOpen((open) => !open)}
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
        >
          + Add Widget
        </button>

        {dropdownOpen && (
          <ul className="dropdownListNoScroll" role="listbox" tabIndex={-1}
            onMouseLeave={() => setMenuIndex(null)}
            style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0 }}
          >
            {/* Main categories */}
            {categories.length === 0 && (
              <li className="dropdownEmpty">No widgets available</li>
            )}
            {categories.map((cat, i) => (
              <li
                key={cat}
                role="option"
                tabIndex={0}
                className="dropdownItemStyled"
                style={{ position: "relative", minWidth: 140 }}
                onMouseEnter={() => setMenuIndex(i)}
                onClick={() => setMenuIndex(i)}
              >
                <span className="widgetIcon">🟦</span>
                <span>{cat}</span>
                {menuIndex === i && (
                  <ul
                    className="dropdownListNoScroll"
                    style={{
                      position: 'absolute',
                      left: '240px',
                      top: 0,
                      width: 220,
                      marginLeft: 4,
                      background: 'rgba(255,255,255,0.96)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      padding: 0,
                    }}
                  >
                    {widgetData[cat]
                      .filter((w: any) => !selectedWidgets.includes(w.widgetName))
                      .map((w: any) => (
                        <li
                          key={w.widgetName}
                          className="dropdownItemStyled"
                          style={{ minWidth: 180 }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleAddWidget(w.widgetName);
                            setDropdownOpen(false);
                            setMenuIndex(null);
                          }}
                        >
                          <span className="widgetIcon">🟢</span>
                          <span>{w.widgetName}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="widgetGrid">
        {selectedWidgets.length === 0 && (
          <p className="noWidgetsMessage">
            No widgets added yet. Click "Add Widget" to get started.
          </p>
        )}

        {selectedWidgets.map((widget) => (
          <div key={widget} className="widgetCard" style={{ position: 'relative' }}>
            {/* Delete button at the top right */}
            <button
              onClick={() => handleRemoveWidget(widget)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: 18,
                cursor: 'pointer',
                padding: 0,
                zIndex: 2
              }}
              aria-label="Remove widget"
              title="Remove widget"
            >
              &#x2715;
            </button>
            <h3 className="widgetTitle">{widget}</h3>
            <input
              type="text"
              placeholder={`Search ${widget}...`}
              className="widgetInput"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAIPage;
