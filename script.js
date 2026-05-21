/* =============================================================
   STI College Calamba — IT Faculty Dashboard Script
   ============================================================= */

// ── Facility Lightbox ──────────────────────────────────────────
(function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbCap     = document.getElementById('lightboxCaption');
  const lbClose   = document.getElementById('lightboxClose');
  const lbPrev    = document.getElementById('lightboxPrev');
  const lbNext    = document.getElementById('lightboxNext');
  if (!lightbox) return;

  let images  = [];
  let current = 0;

  const show = (index) => {
    current    = index;
    lbImg.src  = images[current];
    lbImg.alt  = lbCap.textContent;
    lbPrev.classList.toggle('hidden', images.length <= 1 || current === 0);
    lbNext.classList.toggle('hidden', images.length <= 1 || current === images.length - 1);
    if (images.length > 1) {
      lbCap.textContent = `${lbCap.dataset.name} — ${current + 1} / ${images.length}`;
    }
  };

  const open = (imgList, startIndex, caption) => {
    images = imgList;
    lbCap.textContent    = caption;
    lbCap.dataset.name   = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    show(startIndex);
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
    images    = [];
  };

  document.querySelectorAll('.facility-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img     = wrap.querySelector('img');
      const card    = wrap.closest('.facility-card');
      const caption = card ? card.querySelector('.facility-info h3').textContent : img.alt;
      const raw     = wrap.getAttribute('data-images');
      const imgList = raw ? JSON.parse(raw) : [img.src];
      open(imgList, 0, caption);
    });
  });

  lbPrev.addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); show(current + 1); });
  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft'  && current > 0)              show(current - 1);
    if (e.key === 'ArrowRight' && current < images.length - 1) show(current + 1);
  });
})();


(function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const open = () => { links.classList.toggle('open'); };
  toggle.addEventListener('click', open);
  toggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
})();

// Theme toggle: light mode matches the earlier design, dark mode uses premium theme.
(function initThemeToggle() {
  const storageKey = 'sti-theme';
  const body = document.body;
  const navbar = document.querySelector('.navbar');
  if (!body || !navbar) return;

  let toggle = null;
  let revealLayer = null;
  let revealTimeout = null;

  const prefersReducedMotion = () => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  };

  const readSavedTheme = () => {
    try {
      return localStorage.getItem(storageKey) || 'light';
    } catch (_) {
      return 'light';
    }
  };

  const ensureRevealLayer = () => {
    if (revealLayer) return;

    revealLayer = document.createElement('div');
    revealLayer.className = 'theme-scale-reveal';
    revealLayer.setAttribute('aria-hidden', 'true');
    body.appendChild(revealLayer);
  };

  const playReveal = (nextTheme) => {
    ensureRevealLayer();
    revealLayer.classList.remove('is-animating');
      revealLayer.style.setProperty('--reveal-bg', nextTheme === 'dark' ? '#070b12' : '#f9fafb'); // Set overlay background to target theme color
    // Force reflow so rapid repeated clicks restart the reveal animation.
    void revealLayer.offsetWidth;
    revealLayer.classList.add('is-animating');

    if (revealTimeout) clearTimeout(revealTimeout);
    revealTimeout = setTimeout(() => {
      if (!revealLayer) return;
      revealLayer.classList.remove('is-animating');
      revealTimeout = null;
    }, 620);
  };

  const applyTheme = (theme, options = {}) => {
    const shouldPersist = options.persist !== false;
    const shouldAnimate = options.animate === true;
    const nextTheme = theme === 'dark' ? 'dark' : 'light';

    if (shouldAnimate) playReveal(nextTheme);

    body.setAttribute('data-theme', nextTheme);
    if (shouldPersist) {
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch (_) {}
    }
    if (toggle) {
      const isDark = nextTheme === 'dark';
      toggle.setAttribute('data-theme', nextTheme);
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  };

  const handleToggle = () => {
    const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, { animate: true });
  };

  const syncThemeFromStorage = () => {
    applyTheme(readSavedTheme(), { persist: false });
  };

  const savedTheme = readSavedTheme();

  applyTheme(savedTheme);

  toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'theme-toggle-btn';
  toggle.innerHTML = `
    <span class="theme-flip-card" aria-hidden="true">
      <span class="theme-face theme-face-front">&#9728;</span>
      <span class="theme-face theme-face-back">&#9790;</span>
    </span>
  `;

  toggle.addEventListener('click', handleToggle);
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  });

  const navToggle = document.getElementById('navToggle');
  if (navToggle && navToggle.parentElement === navbar) {
    navbar.insertBefore(toggle, navToggle);
  } else {
    navbar.appendChild(toggle);
  }

  syncThemeFromStorage();

  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) syncThemeFromStorage();
  });

  window.addEventListener('pageshow', () => {
    syncThemeFromStorage();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') syncThemeFromStorage();
  });
})();

// Keep footer copyright year current across all pages.
(function initFooterYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('.footer-copy').forEach(el => {
    el.textContent = el.textContent.replace(/\b20\d{2}\b/, year);
  });
})();

// ── Hero counter animation (landing page) ─────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600;
    const step     = Math.ceil(target / (duration / 16));
    let   current  = 0;

    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// Register a service worker so the site can be installed as a PWA.
(function registerServiceWorker() {
  const supportsSW = "serviceWorker" in navigator;
  const isHttp = location.protocol === "http:" || location.protocol === "https:";

  if (!supportsSW || !isHttp) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // Keep silent for production users; installability just won't be available.
    });
  });
})();

// Show an install button only when the browser supports install prompting.
(function initInstallPrompt() {
  const inStandaloneMode =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (inStandaloneMode) return;

  const installBtn = document.createElement("button");
  installBtn.className = "install-app-btn";
  installBtn.type = "button";
  installBtn.textContent = "Install App";
  installBtn.setAttribute("aria-label", "Install this app");
  document.body.appendChild(installBtn);

  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    installBtn.classList.add("show");
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.classList.remove("show");
  });

  window.addEventListener("appinstalled", () => {
    installBtn.classList.remove("show");
    installBtn.remove();
  });
})();

// ── Faculty Data ───────────────────────────────────────────────
// Faculty photos are loaded from Assets/Images.
// Use exact filenames (including spaces and extension) for each instructor image.
const FACULTY = [
  {
    id:             1,
    name:           "Mr. Arvin Sadicon",
    position:       "IT Department Head",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Full-Time",
    licensed:       true,
    subjects:       ["Programming", "Web Development"],
    email:          "arvin.sadicon@calamba.sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/Sir Arvin.jpg"
  },
  {
    id:             2,
    name:           "Mr. Joie Mar Coral",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Full-Time",
    licensed:       false,
    subjects:       [
      "Java Related Subjects (Object Oriented Programming)",
      "Mobile Programming (Mobile App Programming 1 and 2, Mobile Technologies)",
      "Database Programming (Computer Programming 6)",
      "Information Assurance and Security (Cybersecurity, Data Privacy)",
      "Professional Issues in Information Technology",
      "Application Development and Modern Technologies/Software Design",
      "Programming Languages"
    ],
    email:          "joiemar.coral@calamba.sti.edu.ph",
    teachingExperience: "2 years",
    stiExperience:       "2 years",
    image:          "Assets/Images/Sir Coral.png"
  },
  {
    id:             3,
    name:           "Mr. Jon Philip Daludado",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Full-Time",
    licensed:       false,
    subjects:       ["Networking", "Systems Administration"],
    email:          "jonphilip.daludado@calamba.sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/Sir Daludado.jpg"
  },
  {
    id:             4,
    name:           "Mr. Dexter Belarmino",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Full-Time",
    licensed:       false,
    subjects:       [
      "Cybersecurity",
      "Introduction to Computing",
      "Computer Programming",
      "Human Computer Interaction",
      "IT Service Management",
      "Professional Issues in Information System and Technology",
      "Object Oriented Programming",
      "Technopreneurship"
    ],
    email:          "dexter.belarmino@calamba.sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/Sir Dexter.jpg"
  },
  {
    id:             5,
    name:           "Ms. Danyca Villanueva",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Full-Time",
    licensed:       false,
    subjects:       [
      "Object-Oriented Programming (OOP)",
      "Operating Systems (OS/PlatTech)",
      "Systems Integration and Architecture (SAP)",
      "Systems Administration and Maintenance (SAM)",
      "Computer Productivity Tools (CPTools)"
    ],
    email:          "danyca.villanueva@calamba.sti.edu.ph",
    teachingExperience: "9 months",
    stiExperience:      "9 months",
    image:          "Assets/Images/Maam Villanueva.jpg"
  },
  {
    id:             6,
    name:           "Mr. Euencis Palmones",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Full-Time",
    licensed:       false,
    subjects:       [
      "Computer Programming 1",
      "Object Oriented Programming",
      "Integrative Programming",
      "Computer Productivity Tools",
      "Human Computer Interaction",
      "Data Structure and Algorithm",
      "Information Management",
      "Advanced Database",
      "Project Management",
      "Web Systems and Technology",
      "Advanced Web Design",
      "Information System",
      "Principles of Communication",
      "Platform Technology"
    ],
    email:          "euencis.palmones@calamba.sti.edu.ph",
    teachingExperience: "4 years",
    stiExperience:    "4 years",
    image:          "Assets/Images/Mr. Palmones.jpg"
  },
  {
    id:             7,
    name:           "Ms. Joyce Ann Brofar",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Part-Time",
    licensed:       false,
    subjects:       ["Information Technology", "Computer Applications"],
    email:          "joyceann.brofar@calamba.sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/Maam Joyce.jpg"
  },
  {
    id:             8,
    name:           "Ms. Kyla Cassandra Escriba",
    position:       "Computer Engineering Instructor",
    specialization: "Computer Engineering",
    degree:         "B.S. Computer Engineering",
    type:           "Full-Time",
    licensed:       false,
    subjects:       [""],
    email:          "kylacassandra.escriba@calamba.sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/logo_sti.png"
  },
  {
    id:             9,
    name:           "Ms. Missy Ann Yamaro",
    position:       "Computer Engineering Instructor",
    specialization: "Computer Engineering",
    degree:         "B.S. Computer Engineering",
    type:           "Full-Time",
    licensed:       false,
    subjects:       [""],
    email:          "missyann.yamaro@calamba.sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/logo_sti.png"
  },
  {
    id:            10,
    name:           "Mr. Francis Matthew Acedera",
    position:       "Multimedia Arts Instructor",
    specialization: "Multimedia Arts",
    degree:         "B.S. Multimedia Arts",
    type:           "Full-Time",
    licensed:       false,
    subjects:       [""],
    email:          "francismatthew.acedera@calamba.sti.edu.ph",
    experience:     "—",
     image:          "Assets/Images/Sir Acedera.png"
  }
];

// ── Dashboard Initialization ───────────────────────────────────
(function initDashboard() {
  // Only run on the dashboard page
  if (!document.getElementById('facultyGrid')) return;

  let filtered = [...FACULTY];

  // DOM refs
  const gridEl    = document.getElementById('facultyGrid');
  const tableBody = document.getElementById('facultyTableBody');
  const listEl    = document.getElementById('facultyListView');
  const noResults = document.getElementById('noResults');
  const countEl   = document.getElementById('resultCount');
  const searchEl  = document.getElementById('searchInput');
  const typeEl    = document.getElementById('filterType');
  const specEl    = document.getElementById('filterSpecialization');
  const btnGrid   = document.getElementById('btnGrid');
  const btnList   = document.getElementById('btnList');

  let expandedCard = null;
  let expandedCardIsDetached = false;
  const cardBackdrop = document.createElement('div');
  cardBackdrop.className = 'card-backdrop';
  document.body.appendChild(cardBackdrop);

  const avatarZoomModal = document.createElement('div');
  avatarZoomModal.className = 'avatar-zoom-modal';
  avatarZoomModal.setAttribute('role', 'dialog');
  avatarZoomModal.setAttribute('aria-modal', 'true');
  avatarZoomModal.setAttribute('aria-label', 'Enlarged faculty photo');
  avatarZoomModal.innerHTML = `
    <button class="avatar-zoom-close" type="button" aria-label="Close photo preview">&times;</button>
    <img class="avatar-zoom-image" src="" alt="" />
  `;
  document.body.appendChild(avatarZoomModal);

  const avatarZoomImg = avatarZoomModal.querySelector('.avatar-zoom-image');
  const avatarZoomCloseBtn = avatarZoomModal.querySelector('.avatar-zoom-close');

  function openAvatarZoom(src, alt) {
    if (!src) return;
    avatarZoomImg.src = src;
    avatarZoomImg.alt = alt || 'Faculty photo';
    avatarZoomModal.classList.add('show');
    document.body.classList.add('avatar-zoom-open');
  }

  function closeAvatarZoom() {
    avatarZoomModal.classList.remove('show');
    document.body.classList.remove('avatar-zoom-open');
    avatarZoomImg.src = '';
    avatarZoomImg.alt = '';
  }

  function handleAvatarZoomClick(e) {
    const avatar = e.target.closest('.avatar-img');
    if (!avatar) return;

    const inFacultyCard = avatar.closest('.faculty-card') || avatar.closest('.fl-avatar');
    if (!inFacultyCard) return;

    e.preventDefault();
    e.stopPropagation();
    openAvatarZoom(avatar.currentSrc || avatar.src, avatar.alt);
  }

  function closeExpandedCard() {
    if (!expandedCard) return;
    expandedCard.classList.remove('expanded');
    expandedCard.setAttribute('aria-expanded', 'false');
    if (expandedCardIsDetached) expandedCard.remove();
    expandedCard = null;
    expandedCardIsDetached = false;
    cardBackdrop.classList.remove('show');
    document.body.classList.remove('card-expanded');
  }

  function openExpandedCard(card, detached = false) {
    if (expandedCard === card) {
      closeExpandedCard();
      return;
    }

    closeExpandedCard();
    expandedCard = card;
    expandedCardIsDetached = detached;
    expandedCard.classList.add('expanded');
    expandedCard.setAttribute('aria-expanded', 'true');
    cardBackdrop.classList.add('show');
    document.body.classList.add('card-expanded');
  }

  function openExpandedCardFromList(facultyId) {
    const sourceCard = gridEl.querySelector(`.faculty-card[data-faculty-id="${facultyId}"]`);
    if (!sourceCard) return;

    const detachedCard = sourceCard.cloneNode(true);
    detachedCard.classList.add('detached-expanded-card');
    detachedCard.setAttribute('aria-expanded', 'false');
    document.body.appendChild(detachedCard);
    openExpandedCard(detachedCard, true);
  }

  // Update summary cards
  function updateSummaryCards() {
    const set = document.getElementById('totalFaculty');
    if (!set) return;

    document.getElementById('totalFaculty').textContent   = FACULTY.length;
    document.getElementById('fullTimeFaculty').textContent = FACULTY.filter(f => f.type === 'Full-Time').length;
    document.getElementById('partTimeFaculty').textContent = FACULTY.filter(f => f.type === 'Part-Time').length;
    document.getElementById('mastersFaculty').textContent  = FACULTY.filter(f =>
      f.degree.startsWith('M.S') || f.degree.startsWith('Ph.D')
    ).length;
    document.getElementById('licensedFaculty').textContent = FACULTY.filter(f => f.licensed).length;
  }

  // Get initials from name
  function getInitials(name) {
    return name.split(' ')
      .filter(w => w.length > 1 && !/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.|Engr\.)$/.test(w))
      .map(w => w[0])
      .slice(0, 2)
      .join('');
  }

  // Build degree badge class
  function degreeClass(degree) {
    if (degree.startsWith('Ph.D')) return 'badge-purple';
    if (degree.startsWith('M.S'))  return 'badge-blue';
    return 'badge-green';
  }

  // Build type badge
  function typeBadge(type) {
    return type === 'Full-Time'
      ? '<span class="badge badge-green">Full-Time</span>'
      : '<span class="badge badge-gold">Part-Time</span>';
  }

  // Build specialization tag class
  function specClass(spec) {
    const map = {
      'Software Development': '',
      'Networking':           'gold',
      'Cybersecurity':        '',
      'Data Science':         'gold',
      'Web Development':      '',
      'Mobile Development':   'gold',
      'Database':             '',
      'Systems':              'gold',
    };
    return map[spec] || '';
  }

  // Render grid cards
  function renderGrid(data) {
    gridEl.innerHTML = data.map((f, i) => `
      <article class="faculty-card" data-faculty-id="${f.id}" style="animation-delay:${i * 0.04}s" tabindex="0" aria-label="${f.name}" aria-expanded="false">
        <div class="faculty-card-top">
          <div class="faculty-status-dot ${f.type === 'Part-Time' ? 'part-time' : ''}" 
               title="${f.type}"></div>
          <div class="faculty-avatar">
            ${getInitials(f.name)}
            <img src="${f.image}" alt="Photo of ${f.name}" class="avatar-img"
                 onerror="this.style.display='none'">
          </div>
          <h3>${f.name}</h3>
          <p class="faculty-pos">${f.position}</p>
        </div>
        <div class="faculty-card-body">
          <div class="fc-tags">
            <span class="fc-tag ${specClass(f.specialization)}">${f.specialization}</span>
            ${f.licensed ? '<span class="fc-tag">PRC Licensed</span>' : ''}
          </div>
          <div class="fc-info">
            <div class="fc-info-row">
              <span>${f.degree}</span>
            </div>
            <div class="fc-info-row">
              <div class="fc-subjects-wrap">
                <span class="fc-subject-preview">${f.subjects.slice(0, 2).join(', ')}${f.subjects.length > 2 ? '…' : ''}</span>
                <ul class="fc-subject-list">
                  ${f.subjects.map(subject => `<li>${subject}</li>`).join('')}
                </ul>
              </div>
            </div>
            <div class="fc-info-row">
              ${f.teachingExperience && f.stiExperience ? `
                <div class="fc-experience-columns">
                  <div class="fc-experience-column">
                    <strong>Years Teaching</strong>
                    <span>${f.teachingExperience}</span>
                  </div>
                  <div class="fc-experience-column">
                    <strong>Years at STI</strong>
                    <span>${f.stiExperience}</span>
                  </div>
                </div>
              ` : `<span>${f.experience}</span>`}
            </div>
            <div class="fc-info-row">
              <span style="font-size:.75rem;">${f.email}</span>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Render list/table rows
  function renderList(data) {
    tableBody.innerHTML = data.map((f, i) => `
      <tr data-faculty-id="${f.id}" style="animation-delay:${i * 0.03}s" tabindex="0" aria-label="Open enlarged card for ${f.name}">
        <td>
          <div class="fl-name-cell">
            <div class="fl-avatar">
              ${getInitials(f.name)}
              <img src="${f.image}" alt="Photo of ${f.name}" class="avatar-img"
                   onerror="this.style.display='none'">
            </div>
            <div>
              <div class="fl-name">${f.name}</div>
              <div class="fl-email">${f.email}</div>
            </div>
          </div>
        </td>
        <td>${f.position}</td>
        <td>
          <span class="badge badge-blue">${f.specialization}</span>
        </td>
        <td>
          <span class="badge ${degreeClass(f.degree)}">${f.degree}</span>
        </td>
        <td>${typeBadge(f.type)}</td>
        <td>
          ${f.licensed
            ? '<span class="badge badge-green">PRC Licensed</span>'
            : '<span class="badge" style="background:rgba(100,100,100,.1);color:#666;">Non-Licensed</span>'}
        </td>
      </tr>
    `).join('');
  }

  // Render both views + update count
  function render() {
    closeExpandedCard();
    renderGrid(filtered);
    renderList(filtered);

    const none = filtered.length === 0;
    gridEl.style.display   = none ? 'none' : '';
    listEl.style.display    = none ? 'none' : (listEl.classList.contains('hidden') ? 'none' : '');
    noResults.style.display = none ? 'block' : 'none';
    countEl.textContent     = `${filtered.length} of ${FACULTY.length} faculty`;
  }

  // Filter logic
  function applyFilters() {
    const q    = searchEl.value.trim().toLowerCase();
    const type = typeEl.value;
    const spec = specEl.value;

    filtered = FACULTY.filter(f => {
      const matchSearch = !q ||
        f.name.toLowerCase().includes(q) ||
        f.position.toLowerCase().includes(q) ||
        f.specialization.toLowerCase().includes(q) ||
        f.degree.toLowerCase().includes(q) ||
        f.subjects.some(s => s.toLowerCase().includes(q)) ||
        f.email.toLowerCase().includes(q);

      const matchType = type === 'all' || f.type === type;
      const matchSpec = spec === 'all' || f.specialization === spec;

      return matchSearch && matchType && matchSpec;
    });

    render();
  }

  // View toggle
  let isGridView = true;

  btnGrid.addEventListener('click', () => {
    isGridView = true;
    btnGrid.classList.add('active');
    btnList.classList.remove('active');
    gridEl.classList.remove('hidden');
    listEl.classList.add('hidden');
    gridEl.style.display = '';
    listEl.style.display = 'none';
  });

  btnList.addEventListener('click', () => {
    isGridView = false;
    btnList.classList.add('active');
    btnGrid.classList.remove('active');
    listEl.classList.remove('hidden');
    gridEl.classList.add('hidden');
    listEl.style.display = '';
    gridEl.style.display = 'none';
    closeExpandedCard();
  });

  document.addEventListener('click', handleAvatarZoomClick, true);

  gridEl.addEventListener('click', (e) => {
    const card = e.target.closest('.faculty-card');
    if (!card) return;
    openExpandedCard(card);
  });

  gridEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.faculty-card');
    if (!card) return;
    e.preventDefault();
    openExpandedCard(card);
  });

  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr[data-faculty-id]');
    if (!row) return;
    openExpandedCardFromList(row.dataset.facultyId);
  });

  tableBody.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const row = e.target.closest('tr[data-faculty-id]');
    if (!row) return;
    e.preventDefault();
    openExpandedCardFromList(row.dataset.facultyId);
  });

  cardBackdrop.addEventListener('click', closeExpandedCard);
  avatarZoomCloseBtn.addEventListener('click', closeAvatarZoom);
  avatarZoomModal.addEventListener('click', (e) => {
    if (e.target === avatarZoomModal) closeAvatarZoom();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (avatarZoomModal.classList.contains('show')) {
      closeAvatarZoom();
      return;
    }
    closeExpandedCard();
  });

  // Event listeners
  searchEl.addEventListener('input', applyFilters);
  typeEl.addEventListener('change',  applyFilters);
  specEl.addEventListener('change',  applyFilters);

  // Init
  updateSummaryCards();
  render();
})();
