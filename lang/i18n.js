/**
 * Madar Restaurant — Multilingual Translation Engine
 * Supports: Russian (default), English, Arabic (RTL)
 * Usage: place this file at /lang/i18n.js and include in HTML
 */

(function () {
  'use strict';

  // ── Cache ──────────────────────────────────────────────────────────────────
  const translationCache = {};

  // ── Current language ───────────────────────────────────────────────────────
  let currentLang = localStorage.getItem('madar_lang') || 'ru';

  // ── Load translations from JSON ────────────────────────────────────────────
  async function loadTranslations(lang) {
    if (translationCache[lang]) return translationCache[lang];

    try {
      const res = await fetch(`/lang/${lang}.json?v=1`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      translationCache[lang] = data;
      return data;
    } catch (err) {
      console.warn(`[i18n] Failed to load "${lang}", falling back to "ru".`, err);
      if (lang !== 'ru') {
        return loadTranslations('ru');
      }
      return {};
    }
  }

  // ── Apply translations to DOM ──────────────────────────────────────────────
  function applyTranslations(t) {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
    });

    // HTML content (for rich text with tags)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    // Select options
    document.querySelectorAll('select[data-i18n-select]').forEach(sel => {
      const prefix = sel.getAttribute('data-i18n-select');
      sel.querySelectorAll('option').forEach((opt, idx) => {
        const key = `${prefix}_${idx + 1}`;
        if (t[key] !== undefined) opt.textContent = t[key];
      });
    });
  }

  // ── RTL / LTR ──────────────────────────────────────────────────────────────
  function applyDirection(lang) {
    const html = document.documentElement;
    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', lang);
    }
  }

  // ── Highlight active switcher button ──────────────────────────────────────
  function updateSwitcherUI(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // ── Public: change language ────────────────────────────────────────────────
  async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('madar_lang', lang);
    applyDirection(lang);
    updateSwitcherUI(lang);
    const t = await loadTranslations(lang);
    applyTranslations(t);
  }

  // ── Build Language Switcher UI ─────────────────────────────────────────────
  function buildSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'lang-switcher';
    switcher.innerHTML = `
      <button class="lang-btn${currentLang === 'ru' ? ' active' : ''}" data-lang="ru" title="Русский">
        🇷🇺 <span>RU</span>
      </button>
      <button class="lang-btn${currentLang === 'en' ? ' active' : ''}" data-lang="en" title="English">
        🇺🇸 <span>EN</span>
      </button>
      <button class="lang-btn${currentLang === 'ar' ? ' active' : ''}" data-lang="ar" title="العربية">
        🇸🇦 <span>AR</span>
      </button>
    `;

    switcher.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
    });

    // Inject into nav
    const nav = document.getElementById('navbar');
    if (nav) {
      nav.appendChild(switcher);
    } else {
      document.body.appendChild(switcher);
    }
  }

  // ── Inject CSS for switcher ────────────────────────────────────────────────
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #lang-switcher {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: 20px;
      }
      [dir="rtl"] #lang-switcher {
        margin-left: 0;
        margin-right: 20px;
      }
      .lang-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 7px 13px;
        background: transparent;
        border: 1px solid rgba(201, 168, 76, 0.25);
        color: var(--text-muted, #9A8A6A);
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.75rem;
        letter-spacing: 2px;
        cursor: pointer;
        transition: all 0.25s;
        white-space: nowrap;
      }
      .lang-btn span {
        font-weight: 600;
      }
      .lang-btn:hover {
        border-color: var(--gold, #C9A84C);
        color: var(--gold, #C9A84C);
        background: rgba(201, 168, 76, 0.06);
      }
      .lang-btn.active {
        background: var(--gold, #C9A84C);
        border-color: var(--gold, #C9A84C);
        color: var(--deep, #0A0705);
        font-weight: 700;
      }
      @media (max-width: 768px) {
        #lang-switcher {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9000;
          background: rgba(10,7,5,0.92);
          padding: 8px;
          border: 1px solid rgba(201,168,76,0.2);
          backdrop-filter: blur(12px);
          margin: 0;
        }
        [dir="rtl"] #lang-switcher {
          right: auto;
          left: 20px;
          margin: 0;
        }
        .lang-btn {
          padding: 6px 10px;
          font-size: 0.7rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  async function init() {
    injectStyles();
    buildSwitcher();
    applyDirection(currentLang);
    const t = await loadTranslations(currentLang);
    applyTranslations(t);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose globally for manual use (e.g., after dynamic content injection)
  window.i18n = { setLanguage, loadTranslations, applyTranslations };
})();
