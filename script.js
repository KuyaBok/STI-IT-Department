/* =============================================================
   STI College Calamba — IT Faculty Dashboard Script
   ============================================================= */

// ── Navbar toggle ──────────────────────────────────────────────
(function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const open = () => { links.classList.toggle('open'); };
  toggle.addEventListener('click', open);
  toggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
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
    email:          "a.sadicon@sti.edu.ph",
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
    licensed:       true,
    subjects:       ["Programming", "Data Structures"],
    email:          "jm.coral@sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/Sir Coral.png"
  },
  {
    id:             3,
    name:           "Mr. Jon Philip Daludado",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Full-Time",
    licensed:       true,
    subjects:       ["Networking", "Systems Administration"],
    email:          "jp.daludado@sti.edu.ph",
    experience:     "—",
    image:          "images/jon-daludado.jpg"
  },
  {
    id:             4,
    name:           "Mr. Dexter Belarmino",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Full-Time",
    licensed:       true,
    subjects:       ["Database Management", "Software Development"],
    email:          "d.belarmino@sti.edu.ph",
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
    licensed:       true,
    subjects:       ["Web Design", "UI/UX"],
    email:          "d.villanueva@sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/Maam Villanueva.jpg"
  },
  {
    id:             6,
    name:           "Mr. Euencis Palmones",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Full-Time",
    licensed:       true,
    subjects:       ["Computer Programming", "IT Fundamentals"],
    email:          "e.palmones@sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/Sir Palmones.jpg"
  },
  {
    id:             7,
    name:           "Ms. Joyce Ann Brofar",
    position:       "IT Instructor",
    specialization: "Information Technology",
    degree:         "B.S. Information Technology",
    type:           "Part-Time",
    licensed:       true,
    subjects:       ["Information Technology", "Computer Applications"],
    email:          "ja.brofar@sti.edu.ph",
    experience:     "—",
    image:          "Assets/Images/Maam Joyce.jpg"
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
              <span class="icon">🎓</span>
              <span>${f.degree}</span>
            </div>
            <div class="fc-info-row">
              <span class="icon">📚</span>
              <span>${f.subjects.slice(0, 2).join(', ')}${f.subjects.length > 2 ? '…' : ''}</span>
            </div>
            <div class="fc-info-row">
              <span class="icon">🕒</span>
              <span>${f.experience} experience</span>
            </div>
            <div class="fc-info-row">
              <span class="icon">✉️</span>
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeExpandedCard();
  });

  // Event listeners
  searchEl.addEventListener('input', applyFilters);
  typeEl.addEventListener('change',  applyFilters);
  specEl.addEventListener('change',  applyFilters);

  // Init
  updateSummaryCards();
  render();
})();
