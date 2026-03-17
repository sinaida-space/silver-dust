// ── STATE MANAGEMENT ──────────────────────────────────────────────
const S = {
    ans: JSON.parse(localStorage.getItem('silver_dust_v2') || '{}'),
    currentIdx: 0,
    save() { 
        localStorage.setItem('silver_dust_v2', JSON.stringify(this.ans)); 
        this.updateProgress();
    },
    updateProgress() {
        const total = 15;
        const filled = Object.keys(this.ans).length;
        const progress = Math.min((filled / 40) * 100, 100); // Rough estimate based on ~40 potential fields
        const bar = document.getElementById('progress-fill');
        if (bar) bar.style.width = `${progress}%`;
    }
};

// ── SLIDE CONFIGURATION ───────────────────────────────────────────
const SLIDES = [
    { id: 'hero', num: '00', title: 'Moment Before' },
    { id: 's1', num: '01', title: 'Project Title', hint: 'Clearly define the identity of the initiative.', fields: [
        { label: 'PROJECT_TITLE', key: 'title', type: 'text', placeholder: 'e.g. PROJECT_GENESIS', full: true },
        { label: 'PRESENTER_IDENT', key: 'presenter', type: 'text', placeholder: 'NAME / DEPT' }
    ]},
    { id: 's2', num: '02', title: 'Meta Protocol', hint: 'The rules of engagement for this framework.', fields: [
        { label: 'MODULARITY_STATUS', key: 'meta_modularity', type: 'textarea', placeholder: 'Define how this structure adapts to your specific needs...' },
        { label: 'EVIDENCE_STANDARD', key: 'meta_evidence', type: 'textarea', placeholder: 'Define what counts as validated data for this project...' }
    ]},
    { id: 's3', num: '03', title: 'Problem Logic', hint: 'Focus on the underlying friction and the cost of the status quo.', fields: [
        { label: 'CORE_FRICTION', key: 'problem_core', type: 'textarea', placeholder: 'What is fundamentally broken?' },
        { label: 'QUANTIFIABLE_EVIDENCE', key: 'problem_evidence', type: 'textarea', placeholder: 'Hard numbers, quotes, or loss metrics...' }
    ]},
    { id: 's4', num: '04', title: 'Solution Path', hint: 'Transition from current state to the proposed future state.', fields: [
        { label: 'CURRENT_STATE_DYNAMICS', key: 'solution_current', type: 'textarea', placeholder: 'Manual work, delays, risks...' },
        { label: 'PROPOSED_TRANSFORMATION', key: 'solution_future', type: 'textarea', placeholder: 'Automated, seamless, unlocked...' }
    ]},
    { id: 's5', num: '05', title: 'Target Vectors', hint: 'Identify the specific segments being addressed.', fields: [
        { label: 'SEGMENT_PRIMARY', key: 'target_primary', type: 'text', placeholder: 'Industry / Role' },
        { label: 'IMPACT_DESCRIPTION', key: 'target_impact', type: 'textarea', placeholder: 'How exactly does this help them?' }
    ]},
    { id: 's6', num: '06', title: 'Success Metrics', hint: 'What does "Done" look like? Define your CTQs.', fields: [
        { label: 'NORTH_STAR_GOAL', key: 'goal_main', type: 'text', placeholder: 'One sentence: Achievement, Timeline, Measure.', full: true },
        { label: 'CTQ_01_RELIABILITY', key: 'goal_ctq1', type: 'text', placeholder: 'Metric + Target' },
        { label: 'CTQ_02_EFFICIENCY', key: 'goal_ctq2', type: 'text', placeholder: 'Metric + Target' }
    ]},
    { id: 's7', num: '07', title: 'Scope Boundary', hint: 'Establish clear guardrails to prevent scope creep.', fields: [
        { label: 'CRITICAL_INCLUSIONS', key: 'scope_in', type: 'textarea', placeholder: 'Deliverables included in Phase 1...' },
        { label: 'EXPLICIT_EXCLUSIONS', key: 'scope_out', type: 'textarea', placeholder: 'What we are NOT doing right now...' }
    ]},
    { id: 's8', num: '08', title: 'Unique Leverage', hint: 'Why this approach? What is the differentiator?', fields: [
        { label: 'COMPETITIVE_GAP', key: 'comp_gap', type: 'textarea', placeholder: 'Where do existing solutions fail?' },
        { label: 'OUR_UNFAIR_ADVANTAGE', key: 'comp_edge', type: 'textarea', placeholder: 'Proprietary tech, process, or speed...' }
    ]},
    { id: 's9', num: '09', title: 'Validation Log', hint: 'What have we learned so far? Evidence of traction.', fields: [
        { label: 'INTERVIEW_COUNT', key: 'val_interviews', type: 'text', placeholder: 'e.g. 15 Users' },
        { label: 'KEY_INSIGHT_REVEALED', key: 'val_insight', type: 'textarea', placeholder: 'The most surprising discovery...' }
    ]},
    { id: 's10', num: '10', title: 'Execution Team', hint: 'The human capital behind the initiative.', fields: [
        { label: 'INITIATIVE_LEAD', key: 'team_lead', type: 'text', placeholder: 'Name + Track Record' },
        { label: 'CORE_CAPABILITIES', key: 'team_skills', type: 'textarea', placeholder: 'Why is this the right team?' }
    ]},
    { id: 's11', num: '11', title: 'Resource Matrix', hint: 'The capital and tools required to launch.', fields: [
        { label: 'ASSETS_SECURED', key: 'res_have', type: 'textarea', placeholder: 'Budget, IP, Infrastructure...' },
        { label: 'CRITICAL_GAPS', key: 'res_need', type: 'textarea', placeholder: 'Hiring, funding, partnership needs...' }
    ]},
    { id: 's12', num: '12', title: 'Risk Protocol', hint: 'Anticipate failure and plan mitigation.', fields: [
        { label: 'HIGH_IMPACT_RISK', key: 'risk_main', type: 'text', placeholder: 'Description of threat' },
        { label: 'MITIGATION_STRATEGY', key: 'risk_fix', type: 'textarea', placeholder: 'How we eliminate or reduce it...' }
    ]},
    { id: 's13', num: '13', title: 'Market Scale', hint: 'The magnitude of the opportunity (TAM/SAM/SOM).', fields: [
        { label: 'MARKET_MAGNITUDE', key: 'market_tam', type: 'text', placeholder: 'e.g. $10B Global Market' },
        { label: 'OBTAINABLE_SHARE', key: 'market_som', type: 'text', placeholder: 'e.g. $5M Year 1' }
    ]},
    { id: 's14', num: '14', title: 'Economic Logic', hint: 'The sustainability and monetization strategy.', fields: [
        { label: 'REVENUE_ARCHITECTURE', key: 'biz_model', type: 'textarea', placeholder: 'SaaS, Transactional, etc.' },
        { label: 'UNIT_ECONOMICS', key: 'biz_units', type: 'text', placeholder: 'CAC vs LTV logic' }
    ]},
    { id: 's15', num: '15', title: 'Closing Signal', hint: 'Final validation and call to action.', fields: [
        { label: 'CALL_TO_BOARDROOM', key: 'close_cta', type: 'text', placeholder: 'Final closing punchline' },
        { label: 'NEXT_MILESTONE', key: 'close_next', type: 'text', placeholder: 'Immediate next step' }
    ]},
    { id: 'result', num: 'FINAL', title: 'Output Generation' }
];

// ── NAVIGATION LOGIC ──────────────────────────────────────────────
function initNav() {
    const nav = document.getElementById('nav-list');
    if (!nav) return;
    nav.innerHTML = '';
    
    SLIDES.forEach((s, i) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.id = `nav-${s.id}`;
        li.innerHTML = `
            <span class="nav-num num-tabular">${s.num}</span>
            <span class="nav-label">${s.title}</span>
        `;
        li.onclick = () => jumpTo(i);
        nav.appendChild(li);
    });
}

function jumpTo(idx) {
    if (idx < 0 || idx >= SLIDES.length) return;
    S.currentIdx = idx;
    const slide = SLIDES[idx];

    // Update Nav UI
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${slide.id}`);
    if (activeNav) activeNav.classList.add('active');

    // Render Logic
    if (slide.id === 'hero') renderHero();
    else if (slide.id === 'result') renderResult();
    else renderStep(idx);

    S.updateProgress();
}

// ── RENDERERS ─────────────────────────────────────────────────────
const container = document.getElementById('section-container');
const templates = document.getElementById('templates');

function renderHero() {
    container.innerHTML = '';
    const clone = templates.querySelector('#tpl-hero').cloneNode(true);
    container.appendChild(clone);

    const input = clone.querySelector('#hero-input');
    input.value = S.ans['raw_intent'] || '';
    input.oninput = () => { S.ans['raw_intent'] = input.value; S.save(); };

    clone.querySelector('#start-btn').onclick = () => {
        if (!input.value.trim()) {
            input.parentElement.style.borderColor = 'var(--accent-red)';
            return;
        }
        jumpTo(1);
    };
}

function renderStep(idx) {
    const slide = SLIDES[idx];
    container.innerHTML = '';
    const clone = templates.querySelector('#tpl-step').cloneNode(true);
    container.appendChild(clone);

    // Meta Data Inversion
    clone.querySelector('#step-num-label').textContent = `STEP_${slide.num}`;
    clone.querySelector('#panel-title').textContent = slide.title.toUpperCase();
    clone.querySelector('#prompt-hint').textContent = slide.hint;

    const body = clone.querySelector('#panel-body');
    const grid = document.createElement('div');
    grid.className = 'grid-stack';

    slide.fields.forEach(f => {
        const group = document.createElement('div');
        group.className = 'field-group';
        if (f.full) group.style.gridColumn = '1 / -1';
        
        group.innerHTML = `
            <label class="label-micro">${f.label}</label>
            ${f.type === 'textarea' 
                ? `<textarea id="${f.key}" class="input-premium" placeholder="${f.placeholder}"></textarea>`
                : `<input type="text" id="${f.key}" class="input-premium" placeholder="${f.placeholder}">`
            }
        `;
        grid.appendChild(group);

        // Bind Data
        const input = group.querySelector('.input-premium');
        input.value = S.ans[f.key] || '';
        input.oninput = () => { S.ans[f.key] = input.value; S.save(); };
    });
    body.appendChild(grid);

    // Navigation
    clone.querySelector('.nav-btn-prev').onclick = () => jumpTo(idx - 1);
    clone.querySelector('.nav-btn-next').onclick = () => jumpTo(idx + 1);
}

function renderResult() {
    container.innerHTML = '';
    const clone = templates.querySelector('#tpl-result').cloneNode(true);
    container.appendChild(clone);

    // Prompt Generation Logic
    const promptList = clone.querySelector('#prompts-list');
    const strategies = [
        { label: "EXECUTIVE_NARRATIVE", prompt: `As a high-level consultant, refine this project vision: "${S.ans['raw_intent']}". Structure it as a 3-act narrative focusing on ${S.ans['problem_core'] || 'current pain points'} and the proposed transformation to ${S.ans['solution_future'] || 'the destination'}.` },
        { label: "MARKET_LOGIC", prompt: `Using the target segment "${S.ans['target_primary'] || 'unknown'}", generate a market entry strategy for "${S.ans['title'] || 'Project Genesis'}". Focus on quantifying the ${S.ans['market_tam'] || 'opportunity'} and mitigate the risk of ${S.ans['risk_main'] || 'standard failures'}.` },
        { label: "EXECUTION_ROADMAP", prompt: `Create a 90-day execution roadmap for "${S.ans['title']}". Starting from ${S.ans['team_lead']}'s core expertise, define the sequence of milestones to achieve ${S.ans['goal_main']}.` }
    ];

    strategies.forEach(s => {
        const div = document.createElement('div');
        div.className = 'prompt-card';
        div.innerHTML = `
            <span class="label-micro text-accent">${s.label}</span>
            <p class="text-body" style="margin: 12px 0; font-weight:600; font-size: 0.9rem;">"${s.prompt}"</p>
            <button class="label-micro" style="background:none; border:none; text-decoration:underline; cursor:pointer;" onclick="copyText('${s.prompt.replace(/'/g, "\\'")}', this)">[COPY_PROMPT]</button>
        `;
        promptList.appendChild(div);
    });

    // Snapshot Preview
    const preview = clone.querySelector('#slide-preview-list');
    SLIDES.slice(1, 16).forEach(s => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;';
        const isReady = s.fields.some(f => S.ans[f.key]) ? '✓ READY' : '░ EMPTY';
        item.innerHTML = `
            <span class="num-tabular" style="font-weight:800;">${s.num}</span>
            <span class="label-micro" style="opacity:0.5;">${s.title}</span>
            <span class="label-micro" style="font-size:0.5rem;">${isReady}</span>
        `;
        preview.appendChild(item);
    });

    clone.querySelector('#download-btn').onclick = downloadPPTX;
    clone.querySelector('#restart-btn').onclick = () => {
        if (confirm('TERMINATE_SESSION // All local buffers will be cleared?')) {
            S.ans = {};
            S.save();
            location.reload();
        }
    };
}

// ── UTILS ─────────────────────────────────────────────────────────
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const old = btn.textContent;
        btn.textContent = '✓ COPIED_TO_CLIPBOARD';
        setTimeout(() => btn.textContent = old, 1500);
    });
}

function updateGlobalDate() {
    const el = document.getElementById('current-date');
    if (el) {
        const d = new Date();
        el.textContent = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
    }
}

// ── PPTX EXPORT ───────────────────────────────────────────────────
function downloadPPTX() {
    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_WIDE';

    // Master Definition
    pres.defineSlideMaster({
        title: 'SD_MASTER',
        background: { color: 'FFFFFF' },
        objects: [
            { line: { x: 0.5, y: 0.8, w: 12.3, h: 0, line: { color: '000000', width: 0.5 } } },
            { text: { text: 'SILVER DUST // PROJECT_STRUCTURIZER', options: { x: 0.5, y: 0.4, fontFace: 'Helvetica Neue', fontSize: 8, color: 'D44122', bold: true } } }
        ]
    });

    // 1. Title Slide
    let s1 = pres.addSlide({ masterName: 'SD_MASTER' });
    s1.addText((S.ans['title'] || 'PROJECT_GENESIS').toUpperCase(), { x: 0.5, y: 3.0, w: 12, fontFace: 'Helvetica Neue', fontSize: 54, bold: true });
    s1.addText('A STRUCTURED FRAMEWORK FOR PRESENTING NEW PROJECTS', { x: 0.5, y: 4.2, w: 12, fontFace: 'Helvetica Neue', fontSize: 14, opacity: 0.6 });
    s1.addText(`PRESENTER: ${S.ans['presenter'] || 'ID_NOT_CAPTURED'}`, { x: 0.5, y: 6.5, fontFace: 'Helvetica Neue', fontSize: 10, bold: true });

    // 2. Loop through all steps
    SLIDES.slice(2, 16).forEach(conf => {
        let slide = pres.addSlide({ masterName: 'SD_MASTER' });
        slide.addText(conf.num, { x: 0.5, y: 1.2, fontFace: 'Helvetica Neue', fontSize: 24, bold: true, color: 'D44122' });
        slide.addText(conf.title.toUpperCase(), { x: 0.5, y: 1.8, fontFace: 'Helvetica Neue', fontSize: 40, bold: true });
        
        let y = 3.2;
        conf.fields.forEach(f => {
            const val = S.ans[f.key] || `[NO_DATA_FOR_${f.label}]`;
            slide.addText(f.label, { x: 0.5, y: y, fontFace: 'Helvetica Neue', fontSize: 10, bold: true, color: '666666' });
            slide.addText(val, { x: 0.5, y: y + 0.3, w: 11, fontFace: 'Helvetica Neue', fontSize: 16 });
            y += 1.2;
        });
    });

    pres.writeFile({ fileName: `Silver-Dust-Project-${S.ans['title'] || 'Genesis'}.pptx` });
}

// ── INITIALIZATION ───────────────────────────────────────────────
function initSystem() {
    updateGlobalDate();
    initNav();
    
    // Privacy
    const modal = document.getElementById('privacy-modal');
    const trigger = document.getElementById('privacy-trigger');
    const close = document.getElementById('close-privacy');
    if (trigger && modal && close) {
        trigger.onclick = (e) => { e.preventDefault(); modal.classList.add('active'); };
        close.onclick = () => modal.classList.remove('active');
    }

    // Header Restart
    document.getElementById('restart-btn-header').onclick = () => {
        if (confirm('START_NEW_SESSION?')) { S.ans = {}; S.save(); jumpTo(0); }
    };

    jumpTo(0);
}

document.addEventListener('DOMContentLoaded', initSystem);
