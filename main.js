// ── STATE ─────────────────────────────────────────────────────────
const S = {
    ans: JSON.parse(sessionStorage.getItem('sd_a') || '{}'),
    projectName: 'Silver Dust Project',
    presenterName: '',
    currentIdx: 0,
    save() { sessionStorage.setItem('sd_a', JSON.stringify(this.ans)); }
};

// ── QUESTIONS ─────────────────────────────────────────────────────
const Q = [
  { id:'problem', num:'01', slide:'Problem Statement',
    opener:"Every great project picks a fight with something broken.",
    title:"What opportunities for improvement do you see, and what makes you say that?",
    guidance:"Name the specific pain point and who experiences it daily. Make it feel urgent and provable.",
    placeholder:"e.g. Product managers spend 6h/week manually consolidating feedback...",
    chips:["Who is the main victim?","What evidence proves it's real?","What happens if no one steps in?","Why is it urgent right now?"]},
  { id:'solution', num:'02', slide:'Solution',
    opener:"Now for the vanish trick.",
    title:"When you win, what annoying thing completely disappears from the world?",
    guidance:"Describe the BEFORE (friction) and the AFTER (better). One hard number makes it unforgettable.",
    placeholder:"e.g. Before: 4 tabs open. After: report auto-generates in 3 seconds.",
    chips:["Biggest friction point?","Before vs accurately after","What becomes possible?","What's the 'aha' moment?"]},
  { id:'clients', num:'03', slide:'Target Clients',
    opener:"The hero's welcome.",
    title:"Who is the specific person that will literally hug you when you launch this?",
    guidance:"Describe 2–3 segments with precision. Not demographics, but behaviors.",
    placeholder:"e.g. Solo PMs at SaaS startups who drown in Jira...",
    chips:["Daily frustration?","Who is the early adopter?","What is their win condition?"]},
  { id:'goals', num:'04', slide:'Goal & Success Metrics',
    opener:"The 12-month truth serum.",
    title:"What single number proves you weren't crazy to start this?",
    guidance:"Goal: what, by when. Then 3 Critical-to-Quality metrics.",
    placeholder:"e.g. Goal: 500 active users by Dec 2026. Metric 1: Retention >60%.",
    chips:["Main goal?","3 pride metrics?","Measurement method?"]},
  { id:'scope', num:'05', slide:'Scope Definition',
    opener:"The power of 'no'.",
    title:"What high-requested feature are you explicitly refusing to build in v1?",
    guidance:"List 3 items IN and 3 items OUT of scope.",
    placeholder:"e.g. IN: API core, PDF export. OUT: Payment collection, mobile app.",
    chips:["Vital features?","Reason for exclusion?","Phase 2?"]},
  { id:'competitors', num:'06', slide:'Competitive Landscape',
    opener:"The 'good enough' enemy.",
    title:"What's the painful workaround people are putting up with right now?",
    guidance:"Name 2–3 real alternatives. Pick 4 criteria that matter most.",
    placeholder:"e.g. Alternatives: Notion, Excel. Criteria: Speed, Price, Automation.",
    chips:["Direct competitors?","Current hacky workaround?","Unfair advantage?"]},
  { id:'progress', num:'07', slide:'Progress & Findings',
    opener:"Evidence beats smart plans.",
    title:"What's the most surprising thing you learned when you actually talked to users?",
    guidance:"Replace claims with evidence. Three headline numbers + three findings.",
    placeholder:"e.g. 18 interviews done. Finding: users don't want AI to write, just organize.",
    chips:["Interviews done?","Key surprise?","Prototype status?"]},
  { id:'team', num:'08', slide:'Team',
    opener:"The secret weapon.",
    title:"What hard-learned lesson from your past makes you the right person?",
    guidance:"What makes each person specifically essential? formal credentials for logic.",
    placeholder:"e.g. [Name]: PM at Atlassian 6y, built Jira-Slack integration.",
    chips:["Indispensable superpower?","Personal connection?","Hiring gaps?"]},
  { id:'resources', num:'09', slide:'Resources',
    opener:"The back pocket.",
    title:"What unfair advantages do you have, and what is missing?",
    guidance:"HAVE: and NEED: lists. Be specific about amounts.",
    placeholder:"e.g. HAVE: €40k savings, 1 designer. NEED: €150k seed funding.",
    chips:["Actual budget?","Gap Analysis?","Next use of funds?"]},
  { id:'risks', num:'10', slide:'Risk Assessment',
    opener:"The post-mortem.",
    title:"If this failed in a year, what actually killed it?",
    guidance:"Delivery, Operational, Market, Dependency. mitigations for each.",
    placeholder:"e.g. Market: API change (Med) -> mitigation: agnostic architecture.",
    chips:["Existential risk?","Mitigation strategy?","Early signals?"]},
  { id:'market', num:'11', slide:'Market Potential',
    opener:"The bar napkin math. Size the prize.",
    title:"If this works perfectly, how huge does this actually get?",
    guidance:"TAM → SAM → SOM with the logic behind each number.",
    placeholder:"e.g. TAM: PM tooling $4.8B. SOM: 5k users @ €29/mo = €1.7M ARR.",
    chips:["Total market size?","Conservative SOM?","Why now?"]},
  { id:'model', num:'12', slide:'Business Model',
    opener:"The money flow.",
    title:"How do the economics actually make sense?",
    guidance:"Pricing model + price point + discovery + rough unit economics.",
    placeholder:"e.g. SaaS: €29/mo. CAC: €80. LTV: €580.",
    chips:["Pricing model?","Discovery path?","Key assumption?"]}
];

// ── NAVIGATION ────────────────────────────────────────────────────
function initNav() {
    const nav = document.getElementById('nav-list');
    nav.innerHTML = '';
    
    // Add Title Section
    addNavItem('00', 'Title Slide', true);
    
    // Add Questions
    Q.forEach(q => addNavItem(q.num, q.slide));
    
    // Add Final / Result
    addNavItem('Final', 'Final Validation');
}

function addNavItem(num, title, active = false) {
    const nav = document.getElementById('nav-list');
    const li = document.createElement('li');
    li.className = `nav-item ${active ? 'active' : ''}`;
    li.id = `nav-${num}`;
    li.innerHTML = `
        <div class="nav-num num-tabular">${num}</div>
        <div class="nav-title">${title}</div>
    `;
    li.onclick = () => jumpTo(num);
    nav.appendChild(li);
}

function jumpTo(num) {
    if (num === '00') renderTitle();
    else if (num === 'Final') renderGenerate();
    else {
        const idx = Q.findIndex(q => q.num === num);
        if (idx !== -1) renderQuestion(idx);
    }
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${num}`);
    if (activeNav) activeNav.classList.add('active');
}

// ── RENDERING ─────────────────────────────────────────────────────
const container = document.getElementById('section-container');
const templates = document.getElementById('templates');

function renderTitle() {
    container.innerHTML = '';
    const clone = templates.querySelector('#tpl-00').cloneNode(true);
    container.appendChild(clone);
    clone.classList.add('active');
    
    const titleInput = document.getElementById('display-title');
    const presenterInput = document.getElementById('display-presenter');
    titleInput.textContent = S.projectName.toUpperCase();
    presenterInput.textContent = (S.presenterName || 'John Doe').toUpperCase();
    
    clone.querySelector('#start-btn').onclick = () => jumpTo('01');
}

function renderQuestion(idx) {
    S.currentIdx = idx;
    const q = Q[idx];
    container.innerHTML = '';
    const clone = templates.querySelector('#tpl-question').cloneNode(true);
    container.appendChild(clone);
    clone.classList.add('active');
    
    clone.querySelector('#q-num').textContent = q.num;
    clone.querySelector('#q-slide').textContent = q.slide;
    clone.querySelector('#q-opener').textContent = q.opener;
    clone.querySelector('#q-title').textContent = q.title;
    clone.querySelector('#q-guidance').textContent = q.guidance;
    
    const ta = clone.querySelector('#q-input');
    const cc = clone.querySelector('#char-count');
    ta.value = S.ans[q.id] || '';
    cc.textContent = ta.value.length;
    
    ta.oninput = () => {
        S.ans[q.id] = ta.value;
        cc.textContent = ta.value.length;
        S.save();
    };

    // Chips
    const chipsWrap = clone.querySelector('#q-chips');
    q.chips.forEach(c => {
        const chip = document.createElement('span');
        chip.className = 'q-chip';
        chip.textContent = c;
        chip.onclick = () => {
            const space = ta.value.length > 0 && !ta.value.endsWith(' ') ? ' ' : '';
            ta.value += space + c;
            ta.dispatchEvent(new Event('input'));
        };
        chipsWrap.appendChild(chip);
    });

    clone.querySelector('.nav-btn-prev').onclick = () => {
        if (idx === 0) jumpTo('00');
        else jumpTo(Q[idx-1].num);
    };
    
    clone.querySelector('.nav-btn-next').onclick = () => {
        if (idx === Q.length - 1) jumpTo('Final');
        else jumpTo(Q[idx+1].num);
    };

    clone.querySelector('#refine-btn').onclick = () => {
        const prompt = `Refine this answer for a pitch deck slide titled "${q.slide}".\n\nQuestion: ${q.title}\nGuidance: ${q.guidance}\n\nMy Input: ${ta.value}\n\nStrict instruction: Return ONLY the refined, punchy, professional version. No conversational fillers.`;
        alert("PROMPT COPIED TO CLIPBOARD:\n\n" + prompt);
        navigator.clipboard.writeText(prompt);
    };
}

function renderGenerate() {
    container.innerHTML = '';
    const clone = templates.querySelector('#tpl-generate').cloneNode(true);
    container.appendChild(clone);
    clone.classList.add('active');
    
    const pt = clone.querySelector('#final-title');
    const pn = clone.querySelector('#final-presenter');
    pt.value = S.projectName;
    pn.value = S.presenterName;
    
    pt.oninput = () => { S.projectName = pt.value; S.save(); };
    pn.oninput = () => { S.presenterName = pn.value; S.save(); };
    
    clone.querySelector('#generate-btn').onclick = handleGenerate;
}

async function handleGenerate() {
    document.getElementById('app-status').textContent = 'Generating...';
    // Simulate generation
    setTimeout(() => {
        renderResult();
        document.getElementById('app-status').textContent = 'Complete';
    }, 1500);
}

function renderResult() {
    container.innerHTML = '';
    const clone = templates.querySelector('#tpl-result').cloneNode(true);
    container.appendChild(clone);
    clone.classList.add('active');
    
    const list = clone.querySelector('#slide-preview-list');
    Q.forEach((q, i) => {
        const row = document.createElement('div');
        row.style.cssText = 'padding:24px 0; border-bottom:var(--border-thin); display:flex; gap:32px;';
        row.innerHTML = `
            <div class="num-tabular" style="font-size:1.5rem; color:var(--accent-red); min-width:60px;">${q.num}</div>
            <div>
                <div class="label-micro" style="margin-bottom:8px;">${q.slide}</div>
                <div class="text-body">${S.ans[q.id] || '(No input provided)'}</div>
            </div>
        `;
        list.appendChild(row);
    });
    
    clone.querySelector('#download-btn').onclick = downloadPPTX;
    clone.querySelector('#restart-btn').onclick = () => {
        if(confirm('Clear all data and start new?')) {
            S.ans = {};
            S.projectName = 'Silver Dust Project';
            S.presenterName = '';
            S.save();
            location.reload();
        }
    };
}

// ── PPTX GENERATION ───────────────────────────────────────────────
function downloadPPTX() {
    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_WIDE';
    
    // Title Slide
    let s0 = pres.addSlide();
    s0.background = { color: 'D4D4D4' };
    s0.addText(S.projectName.toUpperCase(), { x: 0.5, y: 1.5, fontFace: 'Helvetica Neue', fontSize: 64, bold: true, color: '0C0C0C' });
    s0.addText('++ INTRO PLAN FRAMEWORK', { x: 0.5, y: 3.5, fontFace: 'Helvetica Neue', fontSize: 18, color: 'D44122', bold: true });
    s0.addText(`PRESENTER: ${S.presenterName.toUpperCase()}`, { x: 0.5, y: 6.0, fontFace: 'Helvetica Neue', fontSize: 12, color: '0C0C0C' });

    // Question Slides
    Q.forEach(q => {
        let slide = pres.addSlide();
        slide.background = { color: 'D4D4D4' };
        slide.addText(q.num, { x: 0.3, y: 0.3, fontFace: 'Helvetica Neue', fontSize: 24, color: 'D44122', bold: true });
        slide.addText(q.slide.toUpperCase(), { x: 1.0, y: 0.35, fontFace: 'Helvetica Neue', fontSize: 14, color: '0C0C0C', bold: true });
        slide.addShape(pres.ShapeType.line, { x: 0.3, y: 0.8, w: 12.5, h: 0, line: { color: '0C0C0C', width: 1 } });
        
        slide.addText(q.title.toUpperCase(), { x: 0.5, y: 1.5, w: 12, fontFace: 'Helvetica Neue', fontSize: 32, bold: true, color: '0C0C0C' });
        slide.addText(S.ans[q.id] || '---', { x: 0.5, y: 3.0, w: 12, h: 3, fontFace: 'Helvetica Neue', fontSize: 18, color: '333333', valign: 'top' });
    });

    pres.writeFile({ fileName: `Silver-Dust-${S.projectName.replace(/\s+/g,'-')}.pptx` });
}

// ── INIT ──────────────────────────────────────────────────────────
const dateObj = new Date();
document.getElementById('current-date').textContent = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()}`;

initNav();
renderTitle();
