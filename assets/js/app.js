/* =========================================================
   DU LIS — 공통 레이아웃 + 페이지별 렌더링
   ========================================================= */
(() => {
  'use strict';

  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (id, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" aria-hidden="true" focusable="false"><use href="#i-${id}"></use></svg>`;
  const winBar = (title, right = '<span class="ctrl" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span>') =>
    `<div class="win-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="bar-title">${title}</span>${right}</div>`;
  const fmtDate = (d) => d.replace(/-/g, '.');
  const CAT_TONE = { 학사: 'sky', 대학원: 'aqua', '행사·특강': 'pink', '취업·진로': 'lime', 교직: 'butter' };
  const OFFICIAL = 'https://lis.daegu.ac.kr';

  const page = document.body.dataset.page || 'home';
  const file = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  const current = file === 'notice-view.html' ? 'notice.html' : file;

  /* ---------------------------------------------------------
     SVG sprite
     --------------------------------------------------------- */
  const SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
  <symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M12 1.5c.9 6.4 4.1 9.6 10.5 10.5-6.4.9-9.6 4.1-10.5 10.5C11.1 16.1 7.9 12.9 1.5 12 7.9 11.1 11.1 7.9 12 1.5z"/></symbol>
  <symbol id="i-plane" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></symbol>
  <symbol id="i-butterfly" viewBox="0 0 24 24"><path fill="currentColor" stroke="#0d1b3e" stroke-width="1.2" stroke-linejoin="round" d="M12 7C9 2 2 2 3 8c.5 3 4 4 8 3-4 2-6 6-3 8 2 1 3.5-2 4-6 .5 4 2 7 4 6 3-2 1-6-3-8 4 1 7.5 0 8-3 1-6-6-6-9-1z"/><path fill="none" stroke="#0d1b3e" stroke-width="1.6" stroke-linecap="round" d="M12 6.5v12M12 6.5 10 3M12 6.5 14 3"/></symbol>
  <symbol id="i-flower" viewBox="0 0 24 24"><g fill="currentColor" stroke="#0d1b3e" stroke-width="1.2"><circle cx="12" cy="6.5" r="4"/><circle cx="17.2" cy="10.3" r="4"/><circle cx="15.2" cy="16.4" r="4"/><circle cx="8.8" cy="16.4" r="4"/><circle cx="6.8" cy="10.3" r="4"/></g><circle cx="12" cy="12" r="3.2" fill="#fff27a" stroke="#0d1b3e" stroke-width="1.2"/></symbol>
  <symbol id="i-ladybug" viewBox="0 0 24 24"><circle cx="12" cy="5.6" r="3.2" fill="#0d1b3e"/><circle cx="12" cy="13.5" r="8" fill="#ff4b4b" stroke="#0d1b3e" stroke-width="1.5"/><path d="M12 5.5v16" stroke="#0d1b3e" stroke-width="1.5"/><g fill="#0d1b3e"><circle cx="8.6" cy="10.8" r="1.6"/><circle cx="15.4" cy="10.8" r="1.6"/><circle cx="8.2" cy="16" r="1.5"/><circle cx="15.8" cy="16" r="1.5"/></g><ellipse cx="9" cy="8.6" rx="1.4" ry=".8" fill="#fff" opacity=".8"/></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/></symbol>
  <symbol id="i-cap" viewBox="0 0 24 24"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/></symbol>
  <symbol id="i-badge" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></symbol>
  <symbol id="i-briefcase" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/></symbol>
  <symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.3-4.3"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
  <symbol id="i-left" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></symbol>
  <symbol id="i-right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
  <symbol id="i-up" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></symbol>
  <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></symbol>
  <symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></symbol>
  <symbol id="i-layers" viewBox="0 0 24 24"><path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></symbol>
  <symbol id="i-clip" viewBox="0 0 24 24"><path d="m21.4 11-8.5 8.5a6 6 0 0 1-8.5-8.5l8.5-8.5a4 4 0 0 1 5.7 5.7l-8.6 8.5a2 2 0 0 1-2.8-2.8l7.8-7.8"/></symbol>
  <symbol id="i-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></symbol>
  <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></symbol>
  <symbol id="i-archive" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></symbol>
  <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>
  <symbol id="i-ext" viewBox="0 0 24 24"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></symbol>
  <symbol id="i-bus" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="3"/><path d="M4 11h16M8 19v2M16 19v2M8 15h.01M16 15h.01"/></symbol>
</svg>`;

  /* ---------------------------------------------------------
     Navigation
     --------------------------------------------------------- */
  const NAV = [
    { label: '학과 소개', en: 'ABOUT', items: [['about.html', '학과 소개'], ['faculty.html', '교수진']] },
    { label: '교육', en: 'STUDY', items: [['curriculum.html', '교육과정'], ['courses.html', '교과목 안내'], ['certificates.html', '자격증']] },
    { label: '진로', en: 'CAREER', items: [['career.html', '진로·취업']] },
    { label: '학과 생활', en: 'CAMPUS LIFE', items: [['activities.html', '학생 활동'], ['notice.html', '공지사항']] },
    { label: '입학', en: 'ADMISSION', items: [['admission.html', '입학 안내'], ['graduate.html', '대학원'], ['faq.html', '자주 묻는 질문']] },
    { label: '문의', en: 'CONTACT', items: [['contact.html', '오시는 길·문의'], [OFFICIAL, '공식 학과 홈페이지']] }
  ];
  const isCur = (href) => (href === current ? ' aria-current="page"' : '');
  const navLink = ([h, l]) => /^https?:/.test(h)
    ? `<a href="${h}" target="_blank" rel="noopener">${l}${icon('ext')}</a>`
    : `<a href="${h}"${isCur(h)}>${l}${icon('arrow')}</a>`;

  const logo = `<a class="logo" href="index.html" aria-label="대구대학교 문헌정보학과 홈">
      <span class="logo-orb">${icon('star')}</span>
      <span class="logo-text"><b>DU LIS</b><small>대구대학교 문헌정보학과</small></span>
    </a>`;

  const header = `
<a class="skip" href="#main">본문 바로가기</a>
<header class="site-header">
  <div class="wrap">
    <div class="nav-shell">
      ${logo}
      <nav class="gnb" aria-label="주 메뉴">
        <ul>
          ${NAV.map((g) => `
          <li class="gnb-item${g.items.some(([h]) => h === current) ? ' is-active' : ''}">
            <a class="gnb-link" href="${g.items[0][0]}">${g.label}${icon('chev')}</a>
            <div class="dropdown">
              <span class="dd-en">${g.en}</span>
              ${g.items.map(navLink).join('')}
            </div>
          </li>`).join('')}
        </ul>
      </nav>
      <a class="btn btn-sm btn-lime nav-cta" href="contact.html">${icon('chat')}입학 문의</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mnav" aria-label="메뉴 열기">${icon('menu')}</button>
    </div>
  </div>
</header>
<div class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="전체 메뉴">
  <div class="mnav-top">${logo}<button class="mnav-close" type="button" aria-label="메뉴 닫기">${icon('x')}</button></div>
  ${NAV.map((g) => `
  <div class="mnav-group">
    <h3>${g.label}<span>${g.en}</span></h3>
    ${g.items.map(navLink).join('')}
  </div>`).join('')}
  <a class="btn btn-lime" href="contact.html">${icon('chat')}입학 문의하기</a>
</div>`;

  const MARQUEE_WORDS = ['LIBRARY & INFORMATION SCIENCE', '대구대학교 문헌정보학과', 'NEVER 2 LATE TO READ', '책과 데이터 사이', 'EVER CURIOUS'];
  const marqueeInner = () => {
    const half = `<span>${[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w) => `${w}${icon('star')}`).join('')}</span>`;
    return `<div class="marquee-track" aria-hidden="true">${half}${half}</div><span class="sr-only">${MARQUEE_WORDS.join(', ')}</span>`;
  };

  const footer = `
<div class="marquee">${marqueeInner()}</div>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        ${logo}
        <p>${esc(S.contact.address)}<br>${esc(S.contact.office)}<br>TEL ${esc(S.contact.phone)} · ${esc(S.contact.email)}</p>
      </div>
      <div>
        <p class="f-title">QUICK LINKS</p>
        <ul class="footer-links">
          <li><a href="curriculum.html">교육과정</a></li>
          <li><a href="certificates.html">자격증</a></li>
          <li><a href="career.html">진로·취업</a></li>
          <li><a href="notice.html">공지사항</a></li>
          <li><a href="admission.html">입학 안내</a></li>
          <li><a href="contact.html">오시는 길·문의</a></li>
        </ul>
      </div>
      <div>
        <p class="f-title">RELATED SITES</p>
        <ul class="footer-links">
          <li><a href="${OFFICIAL}" target="_blank" rel="noopener">문헌정보학과 공식 홈페이지${icon('ext')}</a></li>
          <li><a href="https://www.daegu.ac.kr" target="_blank" rel="noopener">대구대학교${icon('ext')}</a></li>
          <li><a href="https://ipsi.daegu.ac.kr" target="_blank" rel="noopener">대구대학교 입학처${icon('ext')}</a></li>
          <li><a href="https://lib.daegu.ac.kr" target="_blank" rel="noopener">대구대학교 중앙도서관${icon('ext')}</a></li>
          <li><a href="https://www.nl.go.kr" target="_blank" rel="noopener">국립중앙도서관${icon('ext')}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Daegu University · Department of Library &amp; Information Science</span>
      <span class="demo-note">${icon('info')}학과 정보 출처: <a href="${OFFICIAL}" target="_blank" rel="noopener" style="text-decoration:underline">공식 학과 홈페이지</a> (${S.source.checked} 확인)</span>
    </div>
  </div>
</footer>
<div class="fabs">
  <a class="fab fab-cta" href="contact.html" aria-label="입학 문의">${icon('chat')}<span>입학 문의</span></a>
  <button class="fab fab-top" type="button" aria-label="맨 위로">${icon('up')}</button>
</div>
<div class="toast" role="status" aria-live="polite"></div>
<dialog class="modal" id="modal" aria-labelledby="modal-title">
  ${winBar('<span id="modal-title">WINDOW</span>', `<button class="win-close" type="button" aria-label="닫기">${icon('x')}</button>`)}
  <div class="modal-body"></div>
</dialog>`;

  document.body.insertAdjacentHTML('afterbegin', SPRITE + header);
  document.body.insertAdjacentHTML('beforeend', footer);
  $$('[data-marquee]').forEach((el) => { el.classList.add('marquee'); el.innerHTML = marqueeInner(); });

  /* ---------------------------------------------------------
     Sky decoration
     --------------------------------------------------------- */
  const deco = (name, style, cls = 'bob', color = '') =>
    `<span class="deco ${cls}" style="${style}${color ? ';color:' + color : ''}">${icon(name)}</span>`;

  $$('[data-sky]').forEach((el) => {
    const hero = el.dataset.sky === 'hero';
    el.insertAdjacentHTML('afterbegin', `
      <span class="cloud" style="--w:${hero ? 220 : 170}px;top:${hero ? 18 : 30}%;left:6%;--d:13s"></span>
      <span class="cloud" style="--w:${hero ? 160 : 120}px;top:${hero ? 56 : 62}%;left:${hero ? 44 : 58}%;--d:17s;opacity:.85"></span>
      <span class="cloud" style="--w:${hero ? 260 : 200}px;top:${hero ? 12 : 22}%;right:4%;--d:15s"></span>
      <span class="plane-fly" style="--top:${hero ? 30 : 38}%;--d:${hero ? 16 : 22}s"><svg aria-hidden="true"><use href="#i-plane"></use></svg></span>
      ${deco('butterfly', `width:${hero ? 46 : 38}px;height:${hero ? 46 : 38}px;right:${hero ? 44 : 12}%;top:${hero ? 80 : 58}%`, 'bob', 'var(--pink)')}
      ${deco('butterfly', 'width:30px;height:30px;right:8%;top:74%;animation-delay:-2s', 'bob slow', 'var(--aqua)')}
      ${deco('star', 'width:22px;height:22px;left:44%;top:24%', 'twinkle', '#fff')}
      ${deco('star', 'width:16px;height:16px;right:24%;top:46%;animation-delay:-1s', 'twinkle', 'var(--blue)')}
      ${hero ? deco('star', 'width:28px;height:28px;left:3%;top:62%;animation-delay:-.6s', 'twinkle', 'var(--lime)') : deco('ladybug', 'width:30px;height:30px;right:30%;bottom:16%', 'bob slow')}
    `);
  });

  /* 첫 화면 인트로: 폰트가 준비되면(최대 0.8초 대기) 순서대로 등장 */
  const hero = $('.hero');
  if (hero) {
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 800))])
      .then(() => {
        void hero.offsetWidth; // 숨김 상태를 먼저 그린 뒤 전환이 시작되도록
        hero.classList.add('ready');
      });
  }

  /* ---------------------------------------------------------
     Header behaviour / mobile nav / floating buttons
     --------------------------------------------------------- */
  const siteHeader = $('.site-header');
  const fabTop = $('.fab-top');
  const onScroll = () => {
    siteHeader.classList.toggle('scrolled', scrollY > 20);
    fabTop.classList.toggle('show', scrollY > 300);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  fabTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  const mnav = $('#mnav');
  const menuBtn = $('.menu-btn');
  const setMenu = (open) => {
    mnav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) $('.mnav-close').focus(); else menuBtn.focus();
  };
  menuBtn.addEventListener('click', () => setMenu(true));
  $('.mnav-close').addEventListener('click', () => setMenu(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && mnav.classList.contains('is-open')) setMenu(false); });

  /* toast */
  const toastEl = $('.toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
  };

  /* modal */
  const modal = $('#modal');
  const openModal = ({ title, html, tone = 'sky' }) => {
    $('#modal-title').textContent = title;
    $('.win-bar', modal).style.setProperty('--tone', `var(--${tone})`);
    $('.modal-body', modal).innerHTML = html;
    $('.modal-body', modal).scrollTop = 0;
    if (!modal.open) modal.showModal();
  };
  $('.win-close', modal).addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

  /* reveal on scroll */
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;
  const reveal = (root = document) => $$('.reveal:not(.in)', root).forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

  /* ---------------------------------------------------------
     Shared renderers
     --------------------------------------------------------- */
  const sortedNotices = () => [...S.notices].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const extLink = (url, label, cls = 'link-arrow') => `<a class="${cls}" href="${url}" target="_blank" rel="noopener">${label}${icon('ext')}</a>`;
  const isNew = (d) => (Date.now() - new Date(d).getTime()) / 864e5 <= 7;

  const noticeRow = (n) => `
    <li class="${n.pinned ? 'pinned' : ''}">
      <a href="notice-view.html?id=${n.id}">
        <span class="tag ${CAT_TONE[n.cat]}">${n.cat}</span>
        <span class="n-title">
          ${n.pinned ? `<span class="pin" title="중요 공지">${icon('star')}<span class="sr-only">중요</span></span>` : ''}
          <span class="t">${esc(n.title)}</span>
          ${n.files.length ? `${icon('clip')}<span class="sr-only">첨부파일 있음</span>` : ''}
          ${isNew(n.date) ? '<span class="tag lime">NEW</span>' : ''}
        </span>
        <span class="n-meta"><span>${fmtDate(n.date)}</span><span class="views">${icon('eye')}${n.views}</span></span>
      </a>
    </li>`;

  const fieldTag = (key) => {
    const t = S.fields[key];
    return `<span class="tag ${t.tone}">${t.label}</span>`;
  };

  const emptyBox = (msg) => `<div class="empty">${icon('butterfly')}<p>${msg}</p></div>`;

  /* ---------------------------------------------------------
     Pages
     --------------------------------------------------------- */
  const pages = {
    home() {
      $('#home-tracks').innerHTML = ['org', 'svc', 'data', 'com'].map((k, i) => {
        const t = S.fields[k];
        const list = S.courses.filter((c) => c.field === k).slice(0, 4);
        return `
        <article class="win track t-${t.tone} lift reveal d${i}">
          ${winBar(`FIELD_0${i + 1}`)}
          <div class="win-body">
            <div class="track-head"><span class="ico-bubble tone-${t.tone}">${icon(t.icon)}</span><div><small>${t.en}</small><h3 class="card-title">${t.label}</h3></div></div>
            <p>${S.fieldIntro[k]}</p>
            <div class="tags">${list.map((c) => `<span class="tag">${c.name}</span>`).join('')}</div>
          </div>
        </article>`;
      }).join('');

      $('#home-notices').innerHTML = sortedNotices().slice(0, 4).map(noticeRow).join('');
    },

    about() {
      $('#history').innerHTML = S.history.map((h) => `<li><span class="yr">${h.year}</span>${esc(h.text)}</li>`).join('');
    },

    faculty() {
      const grid = $('#faculty-grid');
      const contactLines = (f) => `
        ${f.phone ? `<p class="meta-line">${icon('phone')}<a href="tel:${f.phone.replace(/-/g, '')}">${f.phone}</a></p>` : ''}
        ${f.email ? `<p class="meta-line">${icon('mail')}<a href="mailto:${f.email}">${f.email}</a></p>` : ''}`;
      grid.innerHTML = S.faculty.map((f, i) => `
        <article class="win prof t-${f.tone} lift reveal d${i % 3}">
          ${winBar(`PROFILE_0${i + 1}.EXE`)}
          <div class="win-body">
            <div class="avatar" aria-hidden="true"><span class="photo-label">${esc(f.en || 'PROFILE')}</span><span class="initial">${esc(f.name[0])}</span>${deco('butterfly', 'color:var(--pink)')}</div>
            <div class="prof-name"><h3>${esc(f.name)}</h3><span class="tag ${f.tone}">${esc(f.role)}</span></div>
            <p class="meta-line">${icon('cap')}${esc(f.edu)}</p>
            <div class="tags" aria-label="담당 과목">${f.courses.map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>
            ${contactLines(f)}
            <button class="btn btn-sm btn-white" type="button" data-prof="${i}">경력 보기${icon('arrow')}</button>
          </div>
        </article>`).join('');

      grid.addEventListener('click', (e) => {
        const b = e.target.closest('[data-prof]');
        if (!b) return;
        const f = S.faculty[b.dataset.prof];
        openModal({
          title: `PROFILE · ${f.en || f.name}`,
          tone: f.tone,
          html: `
            <div class="prof-name"><h2>${esc(f.name)}</h2><span class="tag ${f.tone}">${esc(f.role)}</span></div>
            <h4>EDUCATION · 최종 학력</h4><p>${esc(f.edu)}</p>
            <h4>COURSES · 담당 과목</h4><div class="tags">${f.courses.map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div>
            <h4>CAREER · 경력</h4><ul>${f.career.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
            ${f.phone || f.email ? `<h4>CONTACT</h4>${contactLines(f)}` : ''}
            <p class="note">${icon('ext')}<a href="${S.source.url}/professor/list" target="_blank" rel="noopener">연구활동은 학과 홈페이지에서 볼 수 있어요</a></p>`
        });
      });
    },

    curriculum() {
      $('#legend').innerHTML = Object.keys(S.fields).map(fieldTag).join('');
      $('#roadmap').innerHTML = [1, 2, 3, 4].map((y, i) => {
        const en = ['FRESH', 'BUILD', 'DEEP DIVE', 'TAKE OFF'][i];
        const tone = ['butter', 'sky', 'lime', 'pink'][i];
        const sem = (s) => S.courses.filter((c) => c.year === y && c.sem === s).map((c) => `
          <div class="course-chip tone-${S.fields[c.field].tone}">${esc(c.name)}${c.type === '전공필수' ? `<span class="req">필수·${c.credit}학점</span>` : ''}</div>`).join('');
        return `
          <section class="win t-${tone} reveal d${i}">
            ${winBar(`YEAR_0${y}`)}
            <div class="win-body">
              <div class="year-head"><b>${y}학년</b><small>${en}</small></div>
              <p class="sem-label">1ST SEMESTER</p>${sem(1)}
              <p class="sem-label">2ND SEMESTER</p>${sem(2)}
            </div>
          </section>`;
      }).join('');
    },

    courses() {
      const state = { year: 'all', track: 'all', q: '' };
      $('#track-chips').innerHTML =
        `<button class="chip" type="button" data-track="all" aria-pressed="true">전체</button>` +
        Object.entries(S.fields).map(([k, t]) => `<button class="chip" type="button" data-track="${k}" aria-pressed="false">${t.label}</button>`).join('');

      const render = () => {
        const q = state.q.trim().toLowerCase();
        const list = S.courses.filter((c) =>
          (state.year === 'all' || c.year === +state.year) &&
          (state.track === 'all' || c.field === state.track) &&
          (!q || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)));
        $('#course-count').textContent = `${list.length} COURSES`;
        $('#course-list').innerHTML = list.length
          ? list.map((c) => `
            <details class="acc">
              <summary>
                <span class="tag ink">${c.year}-${c.sem}</span>
                <span class="acc-title">${esc(c.name)}</span>
                ${fieldTag(c.field)}
                ${c.type === '전공필수' ? '<span class="tag butter">전공필수</span>' : ''}
                ${icon('chev', 'chev')}
              </summary>
              <div class="acc-body">${c.desc ? esc(c.desc) : '<span class="muted">학과 홈페이지에 과목 설명이 아직 등록되지 않았어요.</span>'}<p class="note">${icon('calendar')}${c.year}학년 ${c.sem}학기 · ${c.type} · ${c.credit}학점${c.cross ? ' · 교차설강' : ''}</p></div>
            </details>`).join('')
          : emptyBox('조건에 맞는 과목이 없어요. 검색어나 필터를 바꿔 보세요.');
      };

      $('#track-chips').addEventListener('click', (e) => {
        const b = e.target.closest('[data-track]');
        if (!b) return;
        state.track = b.dataset.track;
        $$('#track-chips .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
        render();
      });
      $('#year-select').addEventListener('change', (e) => { state.year = e.target.value; render(); });
      $('#course-search').addEventListener('input', (e) => { state.q = e.target.value; render(); });
      render();
    },

    certificates() {
      $('#cert-grid').innerHTML = S.certificates.map((c, i) => `
        <article class="win cert t-${c.tone} lift reveal d${i % 2}">
          ${winBar(`CERT_0${i + 1}`)}
          <div class="win-body">
            <div class="cert-head">
              <span class="ico-bubble tone-${c.tone}">${icon(c.icon)}</span>
              <span class="sticker ${i % 2 ? 'r ' : ''}${c.tone === 'lime' ? '' : c.tone}">${c.badge}</span>
            </div>
            <h3 class="card-title">${c.name}</h3>
            <p class="muted">${c.desc}</p>
            <ul>${c.req.map((r) => `<li>${icon('check')}${r}</li>`).join('')}</ul>
          </div>
        </article>`).join('');
    },

    career() {
      $('#career-paths').innerHTML = S.careers.map((c, i) => `
        <article class="path reveal d${i % 4}">
          <span class="ico-bubble tone-${c.tone}">${icon(c.icon)}</span>
          <h3>${c.name}</h3>
          <p>${c.desc}</p>
        </article>`).join('');
      $('#job-list').innerHTML = S.jobs.map((j) => `
        <li><a href="${j.url}" target="_blank" rel="noopener">
          <span class="tag lime">채용</span>
          <span class="n-title"><span class="t">${esc(j.title)}</span>${icon('ext')}</span>
          <span class="n-meta"><span>${fmtDate(j.date)}</span></span>
        </a></li>`).join('');
    },

    activities() {
      $('#clubs').innerHTML = S.clubs.map((c, i) => `
        <article class="win club t-${c.tone} lift reveal d${i}">
          ${winBar(`CLUB_0${i + 1}`)}
          ${c.photo ? `<img class="club-photo" src="${c.photo}" alt="${esc(c.name)} 단체 사진" loading="lazy">` : ''}
          <div class="win-body">
            <span class="ico-bubble tone-${c.tone}">${icon(c.icon)}</span>
            <div><small>${c.en}</small><h3 class="card-title">${esc(c.name)}</h3></div>
            ${c.slogan ? `<p class="quote" style="font-size:18px">${esc(c.slogan)}</p>` : ''}
            <p>${esc(c.desc)}</p>
            ${extLink(c.url, '학과 홈페이지에서 보기')}
          </div>
        </article>`).join('');

      /* 행사 타임라인: 첫 행사 달부터 마지막 행사 달까지 월별 */
      const EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const ym = (d) => d.slice(0, 7);
      const keys = S.events.map((e) => ym(e.date)).sort();
      const pad = (m) => String(m).padStart(2, '0');
      const months = [];
      let [y0, m0] = keys[0].split('-').map(Number);
      while (`${y0}-${pad(m0)}` <= keys.at(-1)) {
        months.push(`${y0}-${pad(m0)}`);
        if (m0 === 12) { y0++; m0 = 1; } else { m0++; }
      }
      const nowKey = new Date().toISOString().slice(0, 7);
      $('#months').innerHTML = months.map((k) => {
        const [y, m] = k.split('-').map(Number);
        const ev = S.events.filter((e) => ym(e.date) === k);
        return `
          <section class="month${ev.length ? '' : ' off'}${k === nowKey ? ' now' : ''}">
            ${k === nowKey ? '<span class="sticker pink">NOW</span>' : ''}
            <h3><b>${EN.at(m - 1)}</b><small>${y}.${m}</small></h3>
            ${ev.length
              ? `<ul>${ev.map((e) => `<li><a href="${e.url}" target="_blank" rel="noopener">${esc(e.title)}${e.date.length === 10 ? ` <span class="muted">${Number(e.date.slice(8))}일</span>` : ''}</a></li>`).join('')}</ul>`
              : '<p class="rest">등록된 행사 없음</p>'}
          </section>`;
      }).join('');

      /* 갤러리: 행사(앨범)별 · 분류 필터 · 앨범 안에서 넘겨 보기 */
      const G = S.gallery;
      const cats = ['전체', ...new Set(G.map((g) => g.cat))];
      let cur = '전체';
      $('#gallery-chips').innerHTML = cats.map((c, i) => `<button class="chip" type="button" data-cat="${c}" aria-pressed="${i === 0}">${c}</button>`).join('');
      const renderGallery = () => {
        $('#gallery').innerHTML = G.map((g, i) => ({ g, i })).filter(({ g }) => cur === '전체' || g.cat === cur).map(({ g, i }) => `
          <button class="g-item" type="button" data-g="${i}" aria-label="${esc(g.title)} 사진 ${g.photos.length}장 보기">
            <span class="g-thumb"><img src="${g.photos[0]}" alt="" loading="lazy"><span class="g-count">${g.photos.length}장</span></span>
            <span class="g-cap"><small>${g.cat} · ${fmtDate(g.date)}</small>${esc(g.title)}</span>
          </button>`).join('');
      };
      const show = (i, p = 0) => {
        const g = G[i];
        const n = g.photos.length;
        openModal({
          title: `ALBUM · ${g.cat}`,
          tone: 'sky',
          html: `
            <img class="lb-img" src="${g.photos[p]}" alt="${esc(g.title)} 사진 ${p + 1}">
            <div class="lightbox-nav">
              <button class="btn btn-sm btn-white" type="button" data-lb="${i}:${(p - 1 + n) % n}" aria-label="이전 사진" ${n < 2 ? 'disabled' : ''}>${icon('left')}</button>
              <b>${esc(g.title)} <span class="muted small">(${p + 1}/${n})</span></b>
              <button class="btn btn-sm btn-white" type="button" data-lb="${i}:${(p + 1) % n}" aria-label="다음 사진" ${n < 2 ? 'disabled' : ''}>${icon('right')}</button>
            </div>
            <p class="note">${icon('ext')}<a href="${g.url}" target="_blank" rel="noopener">학과 홈페이지 포토갤러리에서 원본·전체 사진 보기</a></p>`
        });
      };
      $('#gallery-chips').addEventListener('click', (e) => {
        const b = e.target.closest('[data-cat]');
        if (!b) return;
        cur = b.dataset.cat;
        $$('#gallery-chips .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
        renderGallery();
      });
      $('#gallery').addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (b) show(+b.dataset.g); });
      modal.addEventListener('click', (e) => {
        const b = e.target.closest('[data-lb]');
        if (b) { const [i, p] = b.dataset.lb.split(':').map(Number); show(i, p); }
      });
      renderGallery();
    },

    notice() {
      const PER = 10;
      const params = new URLSearchParams(location.search);
      const cats = ['전체', ...Object.keys(CAT_TONE).filter((c) => S.notices.some((n) => n.cat === c))];
      const state = { cat: cats.includes(params.get('cat')) ? params.get('cat') : '전체', q: params.get('q') || '', page: +params.get('page') || 1 };
      const chips = $('#notice-chips');
      chips.innerHTML = cats.map((c) => `<button class="chip" type="button" data-cat="${c}" aria-pressed="${c === state.cat}">${c}</button>`).join('');
      const input = $('#notice-search');
      input.value = state.q;

      const sync = () => {
        const p = new URLSearchParams();
        if (state.cat !== '전체') p.set('cat', state.cat);
        if (state.q) p.set('q', state.q);
        if (state.page > 1) p.set('page', state.page);
        history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
      };

      const render = () => {
        const q = state.q.trim().toLowerCase();
        const list = sortedNotices().filter((n) => (state.cat === '전체' || n.cat === state.cat) && (!q || n.title.toLowerCase().includes(q)));
        const pages = Math.max(1, Math.ceil(list.length / PER));
        state.page = Math.min(Math.max(1, state.page), pages);
        const slice = list.slice((state.page - 1) * PER, state.page * PER);
        $('#notice-count').textContent = `TOTAL ${list.length}`;
        $('#notice-list').innerHTML = slice.length ? slice.map(noticeRow).join('') : `<li>${emptyBox('검색 결과가 없어요.')}</li>`;
        $('#pager').innerHTML = `
          <button type="button" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="이전 페이지">${icon('left')}</button>
          ${Array.from({ length: pages }, (_, i) => `<button type="button" data-page="${i + 1}"${i + 1 === state.page ? ' aria-current="page"' : ''}>${i + 1}</button>`).join('')}
          <button type="button" data-page="${state.page + 1}" ${state.page === pages ? 'disabled' : ''} aria-label="다음 페이지">${icon('right')}</button>`;
        sync();
      };

      chips.addEventListener('click', (e) => {
        const b = e.target.closest('[data-cat]');
        if (!b) return;
        state.cat = b.dataset.cat; state.page = 1;
        $$('.chip', chips).forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
        render();
      });
      $('#notice-form').addEventListener('submit', (e) => { e.preventDefault(); state.q = input.value; state.page = 1; render(); });
      input.addEventListener('input', () => { if (!input.value) { state.q = ''; state.page = 1; render(); } });
      $('#pager').addEventListener('click', (e) => {
        const b = e.target.closest('[data-page]');
        if (!b || b.disabled) return;
        state.page = +b.dataset.page;
        render();
        $('#notice-top').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      render();
    },

    noticeView() {
      const id = +new URLSearchParams(location.search).get('id');
      const list = sortedNotices();
      const idx = list.findIndex((n) => n.id === id);
      const box = $('#article');
      if (idx < 0) {
        box.innerHTML = `${winBar('ERROR_404')}<div class="win-body">${emptyBox('공지사항을 찾을 수 없어요.')}<p style="text-align:center;margin-top:20px"><a class="btn btn-white" href="notice.html">${icon('left')}목록으로</a></p></div>`;
        return;
      }
      const n = list[idx];
      const newer = list[idx - 1];
      const older = list[idx + 1];
      const url = `${OFFICIAL}/article/table_01/detail/${n.id}`;
      document.title = `${n.title} | 대구대학교 문헌정보학과`;
      const link = (x, label) => x
        ? `<a href="notice-view.html?id=${x.id}"><span>${label}</span><b>${esc(x.title)}</b></a>`
        : `<a aria-disabled="true"><span>${label}</span><b class="none">글이 없습니다</b></a>`;
      box.innerHTML = `
        ${winBar(`NOTICE_${n.id}.TXT`)}
        <div class="article-head">
          <span class="tag ${CAT_TONE[n.cat]}">${n.cat}</span>
          <h1>${esc(n.title)}</h1>
          <div class="article-meta">
            <span>${icon('calendar')}${fmtDate(n.date)}</span>
            <span>${icon('eye')}조회 ${n.views} <span class="muted">(${S.source.checked} 기준)</span></span>
            <span>${icon('users')}학과사무실</span>
          </div>
        </div>
        <div class="article-body">
          ${n.body.map((p) => `<p>${esc(p)}</p>`).join('')}
          ${n.more ? '<p class="muted">… 이하 내용은 원문에서 확인해 주세요.</p>' : ''}
          <p style="margin-top:24px"><a class="btn btn-lime btn-sm" href="${url}" target="_blank" rel="noopener">학과 홈페이지에서 원문 보기${icon('ext')}</a></p>
        </div>
        ${n.files.length ? `<div class="files"><h2>ATTACHMENTS · 원문에서 내려받기</h2>${n.files.map((f) => `<a href="${url}" target="_blank" rel="noopener">${icon('download')}${esc(f)}</a>`).join('<br>')}</div>` : ''}
        <nav class="prevnext" aria-label="이전·다음 글">${link(newer, 'NEXT')}${link(older, 'PREV')}</nav>`;
    },

    faq() {
      const cats = ['전체', ...new Set(S.faq.map((f) => f.cat))];
      const state = { cat: '전체', q: '' };
      $('#faq-chips').innerHTML = cats.map((c, i) => `<button class="chip" type="button" data-cat="${c}" aria-pressed="${i === 0}">${c}</button>`).join('');
      const render = () => {
        const q = state.q.trim().toLowerCase();
        const list = S.faq.filter((f) => (state.cat === '전체' || f.cat === state.cat) && (!q || (f.q + f.a).toLowerCase().includes(q)));
        $('#faq-list').innerHTML = list.length
          ? list.map((f) => `
            <details class="acc">
              <summary><span class="acc-q">Q</span><span class="acc-title">${esc(f.q)}</span><span class="tag">${f.cat}</span>${icon('chev', 'chev')}</summary>
              <div class="acc-body">${esc(f.a)}</div>
            </details>`).join('')
          : emptyBox('찾는 질문이 없나요? 문의 페이지로 물어봐 주세요.');
      };
      $('#faq-chips').addEventListener('click', (e) => {
        const b = e.target.closest('[data-cat]');
        if (!b) return;
        state.cat = b.dataset.cat;
        $$('#faq-chips .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
        render();
      });
      $('#faq-search').addEventListener('input', (e) => { state.q = e.target.value; render(); });
      render();
    },

    contact() {
      const c = S.contact;
      $('#contact-info').innerHTML = `
        <li><span class="ico-bubble tone-sky">${icon('pin')}</span><div><small>ADDRESS</small><b>${esc(c.address)}</b><span class="muted small">${esc(c.office)}</span></div></li>
        <li><span class="ico-bubble tone-lime">${icon('phone')}</span><div><small>PHONE</small><b><a href="tel:${c.phone.replace(/-/g, '')}">${c.phone}</a></b></div></li>
        <li><span class="ico-bubble tone-pink">${icon('mail')}</span><div><small>EMAIL</small><b><a href="mailto:${c.email}">${c.email}</a></b></div></li>
        <li><span class="ico-bubble tone-aqua">${icon('clip')}</span><div><small>FAX</small><b>${c.fax}</b></div></li>`;

      const form = $('#contact-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let ok = true;
        $$('.field', form).forEach((f) => {
          const el = $('input, select, textarea', f);
          const bad = el.required && !el.checkValidity();
          f.classList.toggle('invalid', bad);
          if (bad && ok) { el.focus(); ok = false; }
        });
        const agree = $('#agree', form);
        if (ok && !agree.checked) { toast('개인정보 수집·이용에 동의해 주세요.'); agree.focus(); ok = false; }
        if (!ok) return;

        if (form.action.includes('YOUR_FORM_ID')) {
          toast('데모 모드예요. Formspree ID를 넣으면 실제로 전송됩니다.');
          form.reset();
          return;
        }
        const btn = $('button[type="submit"]', form);
        btn.disabled = true;
        try {
          const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(res.status);
          toast('문의가 접수됐어요! 곧 답변드릴게요 ✦');
          form.reset();
        } catch {
          toast('전송에 실패했어요. 이메일로 문의해 주세요.');
        } finally {
          btn.disabled = false;
        }
      });
      $$('.field input, .field textarea, .field select', form).forEach((el) =>
        el.addEventListener('input', () => el.closest('.field').classList.remove('invalid')));
    }
  };

  const run = pages[page === 'notice-view' ? 'noticeView' : page];
  if (run) run();
  reveal();
})();
