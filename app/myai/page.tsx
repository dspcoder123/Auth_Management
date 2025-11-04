'use client';

import React, { useEffect, useState } from 'react';
import './myAI.css';
import auth from '../../lib/auth'; // adjust path as per your structure

const fetchMyAIWidgets = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/myai/visitNames`);
  const json = await res.json();
  return json.data || [];
};

const MyAIPage: React.FC = () => {
  const [localUser, setLocalUser] = useState<any>(null);
  const [widgetList, setWidgetList] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

  useEffect(() => {
    const user = auth.getUser();
    setLocalUser(user);
    if (!user) {
      window.location.href = '/login';
    } else {
      fetchMyAIWidgets().then(setWidgetList);
    }
  }, []);

  if (!localUser) return null;

  const handleAddWidget = (widget: string) => {
    setSelectedWidgets((prev) => [...prev, widget]);
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
          <ul className="dropdownListNoScroll" role="listbox" tabIndex={-1}>
            {widgetList.length === 0 && (
              <li className="dropdownEmpty">No widgets available</li>
            )}
            {widgetList.map((widget) =>
              !selectedWidgets.includes(widget) ? (
                <li
                  key={widget}
                  role="option"
                  tabIndex={0}
                  className="dropdownItemStyled"
                  onClick={() => {
                    handleAddWidget(widget);
                    setDropdownOpen(false);
                  }}
                >
                  <span className="widgetIcon">🟢</span>
                  <span>{widget}</span>
                </li>
              ) : null
            )}
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
          <div key={widget} className="widgetCard">
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
