/* ============================================================
   CAREER COMPASS — FRONTEND JAVASCRIPT
   Complete rewrite: animated counters, SVG rings, skeleton
   loaders, tabbed dashboard, IBM-inspired interactions
   ============================================================ */

'use strict';

/* ============================================================
   CONFIGURATION
============================================================ */
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:5000'
  : 'https://ibm-project-conm.onrender.com';


/* ============================================================
   GLOBAL STATE
============================================================ */
let sessionId      = localStorage.getItem('ccSession') || null;
let isBusy         = false;
let studentProfile = JSON.parse(localStorage.getItem('ccProfile') || '{}');
let selectedSkills = new Set(studentProfile.skills || []);
let lastAnalysis   = studentProfile.lastAnalysis || null;


/* ============================================================
   CAREER CATALOG (local knowledge for explorer UI)
============================================================ */
const careerCatalog = [
  {
    title: 'Data Analyst',
    category: 'Analytics',
    description: 'Use SQL, spreadsheets and visualisation tools to turn business questions into clear, actionable insights.',
    skills: ['SQL', 'Excel', 'Power BI', 'Data Visualisation', 'Statistics']
  },
  {
    title: 'Data Scientist',
    category: 'Data Science',
    description: 'Build predictive and analytical solutions using statistics, Python and machine learning techniques.',
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualisation']
  },
  {
    title: 'Business Analyst',
    category: 'Business',
    description: 'Bridge business needs and technical solutions through requirements, stakeholder analysis and communication.',
    skills: ['Excel', 'SQL', 'Communication', 'Requirements Analysis', 'Data Visualisation']
  },
  {
    title: 'Operations Analyst',
    category: 'Operations',
    description: 'Improve processes and decisions by analysing operational data, KPIs, dashboards and workflows.',
    skills: ['Excel', 'SQL', 'Data Visualisation', 'Statistics', 'Communication']
  },
  {
    title: 'Cloud Engineer',
    category: 'Cloud & DevOps',
    description: 'Design, deploy and maintain scalable cloud infrastructure and services across major cloud platforms.',
    skills: ['Cloud Computing', 'Linux', 'Networking', 'Python', 'DevOps']
  },
  {
    title: 'Software Developer',
    category: 'Software',
    description: 'Design, build, test and maintain software applications and practical digital solutions.',
    skills: ['Python', 'JavaScript', 'HTML/CSS', 'SQL', 'Git/GitHub']
  },
  {
    title: 'ML Engineer',
    category: 'AI / ML',
    description: 'Deploy, optimise and scale machine learning models into production systems and pipelines.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Cloud Computing', 'DevOps']
  },
  {
    title: 'Cybersecurity Analyst',
    category: 'Security',
    description: 'Protect systems, networks and data by monitoring threats, analysing incidents and implementing controls.',
    skills: ['Networking', 'Linux', 'Security Analysis', 'Python', 'Cloud Computing']
  }
];


/* ============================================================
   SKILL CATALOG
============================================================ */
const skillCatalog = [
  'Python', 'SQL', 'Excel', 'Tableau', 'Power BI',
  'Data Visualisation', 'Statistics', 'Machine Learning',
  'JavaScript', 'HTML/CSS', 'Java', 'C++', 'Git/GitHub',
  'Linux', 'Cloud Computing', 'DevOps', 'Networking',
  'Communication', 'Problem Solving', 'Business Analysis',
  'Requirements Analysis', 'Project Management', 'R',
  'Deep Learning', 'NLP', 'Security Analysis', 'Agile/Scrum'
];


/* ============================================================
   DOM READY
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  spawnParticles();
  renderSkillChips();
  restoreFormValues();
  updateSkillCount();
  renderCareers();
  buildFilterChips();
  updateWelcome();
  animateHeroStats();
  setupCustomSkillInput();
  checkBackend();
  initRevealObserver();
  showUnreadBadge();
});


/* ============================================================
   SECTION NAVIGATION
============================================================ */
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.section === id));
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'careers') renderCareers();
  if (id === 'results') animateRings();
  // Close mobile nav
  document.getElementById('navbar')?.classList.remove('nav-mobile-open');
}

function toggleMobileNav() {
  document.getElementById('navbar')?.classList.toggle('nav-mobile-open');
}


/* ============================================================
   DARK MODE
============================================================ */
function toggleTheme() {
  const dark = !document.body.classList.contains('dark');
  document.body.classList.toggle('dark', dark);
  localStorage.setItem('ccTheme', dark ? 'dark' : 'light');
  refreshThemeBtn();
}

function applySavedTheme() {
  const saved = localStorage.getItem('ccTheme');
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const dark = saved ? saved === 'dark' : prefersDark;
  document.body.classList.toggle('dark', dark);
  refreshThemeBtn();
}

function refreshThemeBtn() {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  const dark = document.body.classList.contains('dark');
  btn.textContent = dark ? '☀️' : '🌙';
  btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
}


/* ============================================================
   ANIMATED WELCOME
============================================================ */
function updateWelcome() {
  const name = studentProfile.name || '';
  const h    = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const line  = document.getElementById('welcomeLine');
  if (line) line.textContent = greet + (name ? ', ' + name : '') + ' 👋';
  const rg = document.getElementById('resultsGreeting');
  if (rg) rg.textContent = name
    ? `Here is your personalised career snapshot, ${name}.`
    : 'Your personalised career snapshot.';
  if (studentProfile.topCareer) {
    const hc = document.getElementById('heroCareer');
    if (hc) hc.textContent = studentProfile.topCareer;
  }
}


/* ============================================================
   ANIMATED HERO STATS COUNTER
============================================================ */
function animateHeroStats() {
  animateCounter('statCareers', 0, careerCatalog.length, 800, '+ ');
  animateCounter('statSkills',  0, skillCatalog.length,  900, '+ ');
}

function animateCounter(id, from, to, duration, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  const step = ts => {
    const progress = Math.min((ts - start) / duration, 1);
    const val = Math.round(from + (to - from) * easeOut(progress));
    el.textContent = val + (progress < 1 ? '' : suffix);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }


/* ============================================================
   PARTICLES
============================================================ */
function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-duration: ${12 + Math.random() * 16}s;
      animation-delay: ${-Math.random() * 20}s;
      transform: scale(${0.4 + Math.random() * 1.6});
    `;
    container.appendChild(p);
  }
}


/* ============================================================
   REVEAL ON SCROLL
============================================================ */
function initRevealObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}


/* ============================================================
   BACKEND HEALTH CHECK
============================================================ */
async function checkBackend() {
  const badge = document.getElementById('statusBadge');
  const text  = document.getElementById('statusText');
  try {
    const r = await fetch(`${API_BASE}/`, { signal: AbortSignal.timeout(4000) });
    const d = await r.json();
    if (d.status === 'online') {
      badge.className = 'status-badge online';
      text.textContent = 'Backend Online';
    } else throw new Error();
  } catch {
    badge.className = 'status-badge offline';
    text.textContent = 'Backend Offline';
  }
}


/* ============================================================
   SKILLS
============================================================ */
function renderSkillChips() {
  const container = document.getElementById('skillsContainer');
  if (!container) return;
  container.innerHTML = '';
  skillCatalog.forEach(skill => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'skill-chip' + (selectedSkills.has(skill) ? ' selected' : '');
    btn.textContent = skill;
    btn.onclick = () => {
      selectedSkills.has(skill) ? selectedSkills.delete(skill) : selectedSkills.add(skill);
      btn.classList.toggle('selected');
      updateSkillCount();
      autoSaveProfile();
    };
    container.appendChild(btn);
  });
}

function addCustomSkill() {
  const input = document.getElementById('customSkill');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  selectedSkills.add(val);
  if (!skillCatalog.includes(val)) skillCatalog.push(val);
  input.value = '';
  renderSkillChips();
  updateSkillCount();
  autoSaveProfile();
  showToast(`"${val}" added to your skills`, 'success');
}

function setupCustomSkillInput() {
  document.getElementById('customSkill')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); }
  });
}

function updateSkillCount() {
  const el = document.getElementById('skillCount');
  if (el) el.textContent = selectedSkills.size;
}


/* ============================================================
   PROFILE — COLLECT / SAVE / RESTORE
============================================================ */
function collectProfile() {
  return clean({
    name:        val('name'),
    degree:      val('degree'),
    cgpa:        parseFloat(val('cgpa')) || undefined,
    target_role: val('targetRole'),
    interests:   csvList(val('interests')),
    skills:      [...selectedSkills],
    projects:    val('projects'),
    experience:  val('experience')
  });
}

function clean(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === '' || v === undefined || v === null) continue;
    if (Array.isArray(v) && !v.length) continue;
    out[k] = v;
  }
  return out;
}

function val(id) { return document.getElementById(id)?.value.trim() || ''; }
function csvList(text) { return text.split(',').map(s => s.trim()).filter(Boolean); }

function autoSaveProfile() {
  studentProfile = { ...studentProfile, ...collectProfile() };
  localStorage.setItem('ccProfile', JSON.stringify(studentProfile));
  updateWelcome();
}

function restoreFormValues() {
  const p = studentProfile;
  const map = { name: 'name', degree: 'degree', target_role: 'targetRole', interests: 'interests', projects: 'projects', experience: 'experience' };
  for (const [key, id] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (!el || p[key] === undefined) continue;
    el.value = Array.isArray(p[key]) ? p[key].join(', ') : p[key];
  }
  if (p.cgpa !== undefined) {
    const el = document.getElementById('cgpa');
    if (el) el.value = p.cgpa;
  }
}


/* ============================================================
   ANALYSE PROFILE
============================================================ */
async function analyzeProfile() {
  if (isBusy) return;

  const profile = collectProfile();

  if (!profile.name && !profile.skills?.length && !profile.degree) {
    showToast('Add at least your name, degree or a few skills to get started.', 'error');
    return;
  }

  studentProfile = { ...studentProfile, ...profile };
  localStorage.setItem('ccProfile', JSON.stringify(studentProfile));

  setLoading(true, 'Analysing your career profile…', 'Evaluating skills, interests and career possibilities.');
  isBusy = true;

  try {
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, session_id: sessionId })
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.error || `Server error ${res.status}`);
    }

    if (data.session_id) {
      sessionId = data.session_id;
      localStorage.setItem('ccSession', sessionId);
    }

    const analysis = data.analysis || data.data || data.result || data;
    lastAnalysis = analysis;
    studentProfile.lastAnalysis = analysis;
    localStorage.setItem('ccProfile', JSON.stringify(studentProfile));

    renderDashboard(analysis);
    showSection('results');
    showToast('Career analysis complete ✓', 'success');

  } catch (err) {
    console.error(err);
    showToast('Analysis failed. Is the Flask backend running? (`python app.py`)', 'error');
    addBotMessage('⚠️ I couldn\'t analyse your profile right now. Please make sure the Flask backend is running on port 5000.');
  } finally {
    isBusy = false;
    setLoading(false);
  }
}


/* ============================================================
   RENDER DASHBOARD
============================================================ */
function renderDashboard(analysis) {
  if (!analysis || typeof analysis !== 'object') return;

  const careers = normaliseList(
    analysis.career_matches || analysis.career_recommendations ||
    analysis.matches || analysis.careers || analysis.recommendations || []
  );

  const topCareer  = careers[0]?.title || analysis.top_career || analysis.recommended_career || '—';
  const matchScore = toNum(careers[0]?.score ?? analysis.match_score ?? analysis.score ?? analysis.match);
  const readiness  = toNum(analysis.readiness ?? analysis.readiness_score ?? analysis.job_readiness ?? analysis.job_readiness_score);
  const gaps       = asList(analysis.missing_skills || analysis.skill_gaps || analysis.gaps || analysis.missing || []);
  const steps      = asList(analysis.next_steps || analysis.nextSteps || analysis.actions || []);

  // KPIs
  setText('kpiCareer', topCareer);
  setText('kpiMatch',  matchScore !== null ? Math.round(matchScore) + '%' : '—');
  setText('kpiReady',  readiness  !== null ? Math.round(readiness)  + '%' : '—');
  setText('kpiGaps',   gaps.length || '—');

  // Hero card
  setText('heroCareer', topCareer !== '—' ? topCareer : 'Discover your fit');
  studentProfile.topCareer = topCareer;

  // Ring scores (deferred so section transition completes)
  setTimeout(() => {
    setRing('ringMatch', 'ringMatchVal', matchScore);
    setRing('ringReady', 'ringReadyVal', readiness);
  }, 300);

  // Tab panels
  renderCareerResults(careers);
  renderSkillResults(gaps);
  renderNextSteps(analysis, topCareer, gaps, steps);
}


/* ============================================================
   SVG RING ANIMATION
============================================================ */
function setRing(circleId, labelId, pct) {
  const circle = document.getElementById(circleId);
  const label  = document.getElementById(labelId);
  if (!circle || !label) return;

  const radius  = 40;
  const circumference = 2 * Math.PI * radius; // ≈ 251.3
  const value   = pct !== null ? Math.min(Math.max(pct, 0), 100) : 0;
  const offset  = circumference - (value / 100) * circumference;

  circle.style.strokeDasharray  = circumference;
  circle.style.strokeDashoffset = offset;
  label.textContent = pct !== null ? Math.round(pct) + '%' : '—';
}

function animateRings() {
  if (!lastAnalysis) return;
  const analysis   = lastAnalysis;
  const careers    = normaliseList(analysis.career_matches || analysis.career_recommendations || analysis.matches || []);
  const matchScore = toNum(careers[0]?.score ?? analysis.match_score ?? analysis.score);
  const readiness  = toNum(analysis.readiness ?? analysis.readiness_score ?? analysis.job_readiness);
  setRing('ringMatch', 'ringMatchVal', matchScore);
  setRing('ringReady', 'ringReadyVal', readiness);
}


/* ============================================================
   CAREER RESULTS
============================================================ */
function renderCareerResults(careers) {
  const box = document.getElementById('careerResults');
  if (!box) return;
  if (!careers.length) {
    box.innerHTML = emptyMsg('🎯', 'No career recommendations returned yet. Ask CareerBot for a recommendation.');
    return;
  }
  box.innerHTML = careers.slice(0, 6).map((c, i) => `
    <div class="result-item">
      <div class="result-item-left">
        <strong>#${i + 1} ${esc(c.title)}</strong>
        <span>${esc(c.category || 'Career Path')}</span>
      </div>
      <span class="result-badge ${i === 0 ? 'badge-blue' : 'badge-purple'}">
        ${c.score !== null ? Math.round(c.score) + '% match' : 'Recommended'}
      </span>
    </div>
  `).join('');
}


/* ============================================================
   SKILL GAP RESULTS
============================================================ */
function renderSkillResults(gaps) {
  const box = document.getElementById('skillResults');
  if (!box) return;
  if (!gaps.length) {
    box.innerHTML = emptyMsg('⚡', 'No explicit skill gaps detected. You may already have a strong foundation!');
    return;
  }
  box.innerHTML = gaps.slice(0, 10).map((g, i) => {
    const skill = typeof g === 'string' ? g : g.skill || g.name || g.title || 'Skill';
    const priority = i < 3 ? 'badge-orange' : i < 6 ? 'badge-purple' : 'badge-teal';
    const label    = i < 3 ? 'High Priority' : i < 6 ? 'Medium' : 'Learn Later';
    return `
      <div class="result-item">
        <div class="result-item-left">
          <strong>${esc(skill)}</strong>
          <span>Skill to develop</span>
        </div>
        <span class="result-badge ${priority}">${label}</span>
      </div>
    `;
  }).join('');
}


/* ============================================================
   NEXT STEPS
============================================================ */
function renderNextSteps(analysis, topCareer, gaps, steps) {
  const box = document.getElementById('nextSteps');
  if (!box) return;

  let list = steps.filter(Boolean);

  if (!list.length) {
    if (topCareer && topCareer !== '—') {
      list.push(`Research the core responsibilities and tools used in ${topCareer}.`);
      list.push(`Learn the top skills required for ${topCareer}.`);
    }
    if (gaps.length) list.push(`Focus on your top ${Math.min(gaps.length, 3)} skill gap${gaps.length > 1 ? 's' : ''}: ${gaps.slice(0,3).map(g => typeof g === 'string' ? g : g.skill || g).join(', ')}.`);
    list.push('Build one hands-on project and document your learnings.');
    list.push('Check your readiness score again after completing your next learning milestone.');
    list.push('Use CareerBot to compare alternative career paths.');
  }

  box.innerHTML = list.slice(0, 6).map((step, i) => `
    <div class="result-item">
      <div class="result-item-left">
        <strong>Step ${i + 1}</strong>
        <span>${esc(typeof step === 'string' ? step : JSON.stringify(step))}</span>
      </div>
      <span class="result-badge badge-blue">${i === 0 ? 'Do First' : 'Action'}</span>
    </div>
  `).join('');
}


/* ============================================================
   TABS
============================================================ */
function switchTab(name, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.add('active');
}


/* ============================================================
   CAREER EXPLORER
============================================================ */
let activeFilter = 'All';

function buildFilterChips() {
  const categories = ['All', ...new Set(careerCatalog.map(c => c.category))];
  const wrap = document.getElementById('filterChips');
  if (!wrap) return;
  wrap.innerHTML = categories.map(cat => `
    <button class="filter-chip ${cat === 'All' ? 'active' : ''}"
            onclick="setFilter('${esc(cat)}', this)">
      ${esc(cat)}
    </button>
  `).join('');
}

function setFilter(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCareers();
}

function renderCareers(query = '') {
  const search  = query || document.getElementById('careerSearch')?.value.trim().toLowerCase() || '';
  const grid    = document.getElementById('careerGrid');
  const counter = document.getElementById('careerCount');
  if (!grid) return;

  const list = careerCatalog.filter(c => {
    const matchCat = activeFilter === 'All' || c.category === activeFilter;
    const matchQ   = !search || [c.title, c.category, c.description, ...c.skills]
                       .join(' ').toLowerCase().includes(search);
    return matchCat && matchQ;
  });

  if (counter) counter.textContent = `${list.length} career${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    grid.innerHTML = `<div class="card"><div class="empty-msg"><div class="icon">🔍</div>No careers matched. Try a different search or filter.</div></div>`;
    return;
  }

  grid.innerHTML = list.map(c => `
    <article class="career-card">
      <span class="career-cat">${esc(c.category)}</span>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.description)}</p>
      <div class="skill-tags">
        ${c.skills.map(s => `<span class="skill-tag">${esc(s)}</span>`).join('')}
      </div>
      <button class="career-ask-btn"
              onclick="openCareerChat('Tell me if ${escJS(c.title)} is a good fit for my profile.')">
        Ask CareerBot about this →
      </button>
    </article>
  `).join('');
}

function searchCareers() { renderCareers(document.getElementById('careerSearch')?.value.trim().toLowerCase()); }


/* ============================================================
   CHAT BOT
============================================================ */
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatPanel')?.classList.toggle('open', chatOpen);
  if (chatOpen) {
    hideUnreadBadge();
    document.getElementById('chatInput')?.focus();
  }
}

function openCareerChat(question) {
  chatOpen = true;
  document.getElementById('chatPanel')?.classList.add('open');
  hideUnreadBadge();
  const input = document.getElementById('chatInput');
  if (input) input.value = question;
  sendChatMessage();
}

function handleChatKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendChatMessage(); }
}

function showUnreadBadge() {
  const badge = document.getElementById('fabBadge');
  if (badge && !chatOpen) badge.classList.add('show');
}

function hideUnreadBadge() {
  document.getElementById('fabBadge')?.classList.remove('show');
}

async function sendChatMessage() {
  if (isBusy) return;
  const input   = document.getElementById('chatInput');
  const message = input?.value.trim();
  if (!message) return;
  input.value = '';

  addUserMessage(message);
  addTypingIndicator();
  setInputLock(true);
  isBusy = true;

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        message,
        profile:   collectProfile(),
        analysis:  lastAnalysis || null
      })
    });

    const data = await res.json();

    if (!res.ok || data.success === false) throw new Error(data.error || `Server error ${res.status}`);

    if (data.session_id) {
      sessionId = data.session_id;
      localStorage.setItem('ccSession', sessionId);
    }

    if (data.profile) {
      studentProfile = { ...studentProfile, ...data.profile };
      localStorage.setItem('ccProfile', JSON.stringify(studentProfile));
      restoreFormValues();
    }

    removeTypingIndicator();
    addBotMessage(data.reply || data.message || 'I processed your request.');

    if (data.analysis) {
      renderDashboard(data.analysis);
      lastAnalysis = data.analysis;
      studentProfile.lastAnalysis = data.analysis;
      localStorage.setItem('ccProfile', JSON.stringify(studentProfile));
    }

  } catch (err) {
    console.error(err);
    removeTypingIndicator();
    addBotMessage('⚠️ I couldn\'t reach the Career Compass agent. Please confirm that `python app.py` is running on port 5000.');
  } finally {
    isBusy = false;
    setInputLock(false);
  }
}

/* Message renderers */
function addUserMessage(text) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `
    <div class="msg-avatar user">👤</div>
    <div class="msg-bubble">${esc(text)}</div>
  `;
  messages.appendChild(div);
  scrollChat();
}

function addBotMessage(text) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `
    <div class="msg-avatar bot">🤖</div>
    <div class="msg-bubble">${formatBotText(text)}</div>
  `;
  messages.appendChild(div);
  scrollChat();
  if (!chatOpen) showUnreadBadge();
}

function addTypingIndicator() {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingMsg';
  div.innerHTML = `
    <div class="msg-avatar bot">🤖</div>
    <div class="msg-bubble" style="padding:8px 14px;">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
  messages.appendChild(div);
  scrollChat();
}

function removeTypingIndicator() {
  document.getElementById('typingMsg')?.remove();
}

function scrollChat() {
  const messages = document.getElementById('chatMessages');
  if (messages) messages.scrollTop = messages.scrollHeight;
}

function setInputLock(locked) {
  const input = document.getElementById('chatInput');
  const btn   = document.getElementById('chatSendBtn');
  if (input) input.disabled = locked;
  if (btn)   btn.disabled   = locked;
}

/* Format bot text: convert **bold**, newlines, numbered lists */
function formatBotText(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>').replace(/$/, '</p>');
}


/* ============================================================
   LOADING OVERLAY
============================================================ */
function setLoading(active, title = '', text = '') {
  const overlay = document.getElementById('loadingOverlay');
  if (!overlay) return;
  overlay.classList.toggle('active', active);
  if (active) {
    setText('loadingTitle', title);
    setText('loadingText', text);
  }
}


/* ============================================================
   TOAST NOTIFICATIONS
============================================================ */
function showToast(msg, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}


/* ============================================================
   UTILITY HELPERS
============================================================ */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escJS(str) {
  return String(str || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function emptyMsg(icon, text) {
  return `<div class="empty-msg"><div class="icon">${icon}</div>${esc(text)}</div>`;
}

function toNum(val) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return val;
  const m = String(val).replace(',', '').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function normaliseList(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(item => {
    if (typeof item === 'string') return { title: item, score: null, category: '' };
    return {
      title:    item.title || item.name || item.role || item.career || '',
      score:    toNum(item.score ?? item.match_score ?? item.skill_fit_score ?? item.match_percentage),
      category: item.category || item.domain || ''
    };
  }).filter(c => c.title);
}

function asList(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val) return [val];
  return [];
}