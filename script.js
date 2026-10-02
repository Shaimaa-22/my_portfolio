const stored = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
let currentLang = stored('language', 'en') === 'ar' ? 'ar' : 'en';
let currentTheme = stored('theme', 'light') === 'dark' ? 'dark' : 'light';
const translations = {};
const getTranslation = (key, lang) => key.split('.').reduce((value, part) => value?.[part], translations[lang]);
function applyTheme() {
  document.body.classList.toggle('light-mode', currentTheme === 'light');
  document.querySelector('meta[name="theme-color"]').content = currentTheme === 'light' ? '#fcfafb' : '#201c1f';
  document.getElementById('theme-toggle').setAttribute('aria-pressed', String(currentTheme === 'dark'));
}
function applyLanguage() {
  if (!translations[currentLang]) return;
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelector('.lang-text').textContent = currentLang === 'ar' ? 'EN' : 'ع';
  document.getElementById('lang-toggle').setAttribute('aria-label', currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  document.querySelectorAll('[data-key]').forEach(el => {
    const text = getTranslation(el.dataset.key, currentLang);
    if (typeof text === 'string') el.textContent = text;
  });
  document.querySelectorAll('[data-list]').forEach(el => {
    const list = getTranslation(el.dataset.list, currentLang);
    if (Array.isArray(list)) el.replaceChildren(...list.map(text => {
      const li = document.createElement('li'); li.textContent = text; return li;
    }));
  });
}
applyTheme();
document.getElementById('theme-toggle').addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light'; applyTheme(); save('theme', currentTheme);
});
document.getElementById('lang-toggle').addEventListener('click', () => {
  if (!translations.ar || !translations.en) return;
  currentLang = currentLang === 'en' ? 'ar' : 'en'; applyLanguage(); save('language', currentLang);
});
Promise.all(['en', 'ar'].map(async lang => {
  const response = await fetch(`./translations/${lang}.json`);
  if (!response.ok) throw new Error('Translation unavailable');
  translations[lang] = await response.json();
})).then(applyLanguage).catch(() => {
  document.getElementById('lang-toggle').disabled = true;
});
const menu = document.getElementById('nav-menu');
const toggle = document.getElementById('nav-toggle');
function setMenu(open) { menu.classList.toggle('active', open); toggle.setAttribute('aria-expanded', String(open)); }
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('active')));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
const modal = document.getElementById('cv-modal');
const frame = document.getElementById('cv-iframe');
const cvPath = './cv/Shaimaa_Dwedar.pdf';
['view-cv-btn', 'view-cv-hero'].forEach(id => document.getElementById(id).addEventListener('click', e => {
  e.preventDefault(); frame.src = cvPath; modal.showModal();
}));
document.getElementById('cv-modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => {
  const r = modal.getBoundingClientRect();
  if (e.target === modal && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) modal.close();
});
modal.addEventListener('close', () => frame.removeAttribute('src'));
document.getElementById('download-cv').href = cvPath;
document.getElementById('download-cv').download = 'Shaimaa_Dwedar.pdf';

const sections = [...document.querySelectorAll('main section[id]')];
function updateActiveSection() {
  const current = sections.filter(s => s.getBoundingClientRect().top <= 160).at(-1) || sections[0];
  menu.querySelectorAll('a').forEach(a => {
    if (a.getAttribute('href') === '#' + current.id) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
}
let scrollPending = false;
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(() => { updateActiveSection(); scrollPending = false; }); }
}, { passive: true });
updateActiveSection();
