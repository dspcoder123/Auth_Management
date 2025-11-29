"use client";

import React, { useEffect, useState } from "react";
import "./Conversion.css";

type TopMenu = "Audio" | "Video" | "Image" | "Text" | string;

type SubMenuItem = {
  key: string;
  label: string;
};

interface MenusResponse {
  success: boolean;
  data: TopMenu[];
}

interface SubMenusResponse {
  success: boolean;
  menu: string;
  count: number;
  data: SubMenuItem[];
}

const menuDescriptions: Record<string, string> = {
  Audio: "Convert between text, audio formats, and speech-based assets.",
  Video: "Handle video transformations like clipping, resizing, and format changes.",
  Image: "Work with images for resizing, optimization, and format conversions.",
  Text: "Transform text to or from other media types such as audio, video, and images.",
};

const getSubMenuEndpoint = (menu: TopMenu) => {
  const key = menu.toLowerCase();
  // For Audio, Video, Image, Text we follow the pattern /api/{key}/menus
  return `http://localhost:4000/api/${key}/menus`;
};

const ConversionPage: React.FC = () => {
  const [menus, setMenus] = useState<TopMenu[]>([]);
  const [menusLoading, setMenusLoading] = useState(true);
  const [menusError, setMenusError] = useState<string | null>(null);

  const [selectedMenu, setSelectedMenu] = useState<TopMenu | null>(null);
  const [subMenus, setSubMenus] = useState<SubMenuItem[]>([]);
  const [subMenusLoading, setSubMenusLoading] = useState(false);
  const [subMenusError, setSubMenusError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/menus");
        const json: MenusResponse = await res.json();
        if (!json.success) throw new Error("Failed to load menus");
        setMenus(json.data || []);
      } catch (e: any) {
        setMenusError(e?.message || "Unable to load menus.");
      } finally {
        setMenusLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const handleViewMenu = async (menu: TopMenu) => {
    // If the user clicks the same menu again, close it (toggle behavior)
    if (selectedMenu === menu) {
      setSelectedMenu(null);
      setSubMenus([]);
      setSubMenusError(null);
      setSubMenusLoading(false);
      return;
    }

    setSelectedMenu(menu);
    setSubMenus([]);
    setSubMenusError(null);
    setSubMenusLoading(true);
    try {
      const endpoint = getSubMenuEndpoint(menu);
      const res = await fetch(endpoint);
      const json: SubMenusResponse = await res.json();
      if (!json.success) throw new Error("Failed to load submenus");
      setSubMenus(json.data || []);
    } catch (e: any) {
      setSubMenusError(e?.message || "Unable to load submenus.");
    } finally {
      setSubMenusLoading(false);
    }
  };

  return (
    <main className="conversion-page">
      <h1 className="conversion-title">Conversion Area</h1>
      <p className="conversion-subtitle">
        Choose a conversion type below to explore the available tools and flows.
      </p>

      {/* Top-level menus as cards */}
      {menusLoading ? (
        <p className="conversion-status">Loading menus...</p>
      ) : menusError ? (
        <p className="conversion-status conversion-status--error">{menusError}</p>
      ) : (
        <section className="conversion-grid">
          {menus.map((menu) => (
            <article
              key={menu}
              className={
                selectedMenu === menu
                  ? "conversion-card conversion-card--active"
                  : "conversion-card"
              }
            >
              <div>
                <h2 className="conversion-card-title">{menu}</h2>
                <p className="conversion-card-text">
                  {menuDescriptions[menu] ||
                    "Access conversion tools and workflows related to this content type."}
                </p>
              </div>
              <button
                onClick={() => handleViewMenu(menu)}
                className="conversion-card-button"
              >
                {selectedMenu === menu ? "Close" : "View"}
              </button>
            </article>
          ))}
        </section>
      )}

      {/* Submenus section */}
      {selectedMenu && (
        <section className="conversion-submenu-panel">
          <h2 className="conversion-submenu-title">{selectedMenu} submenus</h2>
          {subMenusLoading ? (
            <p className="conversion-status">Loading options...</p>
          ) : subMenusError ? (
            <p className="conversion-status conversion-status--error">{subMenusError}</p>
          ) : subMenus.length === 0 ? (
            <p className="conversion-status">No submenu options available yet.</p>
          ) : (
            <ul className="conversion-submenu-list">
              {subMenus.map((item) => (
                <li
                  key={item.key}
                  className="conversion-submenu-item"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
};

export default ConversionPage;
