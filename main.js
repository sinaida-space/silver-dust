// ── STATE ─────────────────────────────────────────────────────────
const S = {
    ans: JSON.parse(sessionStorage.getItem('sd_v2') || '{}'),
    currentIdx: 0,
    save() { sessionStorage.setItem('sd_v2', JSON.stringify(this.ans)); }
};

// ── SLIDE DEFINITIONS ─────────────────────────────────────────────
const SLIDES = [
    { id: 'hero',  num: '00', title: 'Moment Before' },
    { id: 's1',    num: '01', title: 'Project Title' },
    { id: 's2',    num: '02', title: 'Meta' },
    { id: 's3',    num: '03', title: 'Problem' },
    { id: 's4',    num: '04', title: 'Solution' },
    { id: 's5',    num: '05', title: 'Target Clients' },
    { id: 's6',    num: '06', title: 'Goal & CTQs' },
    { id: 's7',    num: '07', title: 'Scope' },
    { id: 's8',    num: '08', title: 'Competition' },
    { id: 's9',    num: '09', title: 'Progress' },
    { id: 's10',   num: '10', title: 'Team' },
    { id: 's11',   num: '11', title: 'Resources' },
    { id: 's12',   num: '12', title: 'Risks' },
    { id: 's13',   num: '13', title: 'Market' },
    { id: 's14',   num: '14', title: 'Business Model' },
    { id: 's15',   num: '15', title: 'Closing' },
    { id: 'result', num: 'Final', title: 'Result' }
];

// ── NAVIGATION ────────────────────────────────────────────────────
function initNav() {
    const nav = document.getElementById('nav-list');
    nav.innerHTML = '';
    SLIDES.forEach(s => {
        const li = document.createElement('li');
        li.className = `nav-item ${s.id === 'hero' ? 'active' : ''}`;
        li.id = `nav-${s.id}`;
        li.innerHTML = `
            <div class="nav-num num-tabular">${s.num}</div>
            <div class="nav-title">${s.title}</div>
        `;
        li.onclick = () => jumpTo(s.id);
        nav.appendChild(li);
    });
}

function jumpTo(id) {
    const idx = SLIDES.findIndex(s => s.id === id);
    if (idx === -1) return;
    
    // Update Nav UI
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`nav-${id}`).classList.add('active');
    
    // Update Progress
    const progress = (idx / (SLIDES.length - 1)) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';

    // Render Body
    if (id === 'hero') renderHero();
    else if (id === 'result') renderResult();
    else renderSlide(id);
}

// ── RENDERING ─────────────────────────────────────────────────────
const container = document.getElementById('section-container');
const templates = document.getElementById('templates');

function renderHero() {
    container.innerHTML = '';
    const clone = templates.querySelector('#tpl-hero').cloneNode(true);
    container.appendChild(clone);
    clone.classList.add('active');

    const input = clone.querySelector('#hero-concept');
    input.value = S.ans['big_idea'] || '';
    input.oninput = () => { S.ans['big_idea'] = input.value; S.save(); };

    clone.querySelector('#start-btn').onclick = () => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--accent-red)';
            return;
        }
        jumpTo('s1');
    };
}

function renderSlide(id) {
    container.innerHTML = '';
    const clone = templates.querySelector(`#tpl-${id}`).cloneNode(true);
    container.appendChild(clone);
    clone.classList.add('active');

    // Load/Save Logic for Inputs & Textareas
    const inputs = clone.querySelectorAll('input, textarea');
    inputs.forEach((inp, i) => {
        const key = `${id}_${i}`;
        // Special case for Slide 1 Title
        if (id === 's1' && inp.id === 's1-title') {
             inp.textContent = S.ans[key] || 'PROJECT TITLE';
             inp.oninput = () => { S.ans[key] = inp.textContent; S.save(); };
        } else {
             inp.value = S.ans[key] || '';
             inp.oninput = () => { S.ans[key] = inp.value; S.save(); };
        }
    });

    // Special logic for contenteditable (Slide 1 title)
    const titleEl = clone.querySelector('#s1-title');
    if (titleEl) {
        titleEl.textContent = S.ans['s1_title'] || 'PROJECT TITLE';
        titleEl.oninput = () => { S.ans['s1_title'] = titleEl.textContent; S.save(); };
    }

    // Dynamic Date on Slide 1
    const dateEl = clone.querySelector('#s1-date');
    if (dateEl) {
        const d = new Date();
        dateEl.textContent = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
    }

    // Navigation Buttons
    const currIdx = SLIDES.findIndex(s => s.id === id);
    clone.querySelector('.nav-btn-prev').onclick = () => jumpTo(SLIDES[currIdx-1].id);
    clone.querySelector('.nav-btn-next').onclick = () => jumpTo(SLIDES[currIdx+1].id);
}

function renderResult() {
    container.innerHTML = '';
    const clone = templates.querySelector('#tpl-result').cloneNode(true);
    container.appendChild(clone);
    clone.classList.add('active');

    // 1. Generate Prompt Section
    const promptList = clone.querySelector('#prompts-list');
    const prompts = [
        { label: "Executive Narrative", prompt: `Write a high-stakes executive summary for my project: "${S.ans['big_idea']}". Use a professional, persuasive tone suitable for board members.` },
        { label: "Market Sizing Logic", prompt: `Analyze the market potential for "${S.ans['big_idea']}". Provide realistic TAM/SAM/SOM estimates with justification based on recent industry trends.` },
        { label: "Competitive Edge", prompt: `Identify 3 key areas where "${S.ans['big_idea']}" would outperform existing solutions in terms of speed, cost, and user experience.` }
    ];

    prompts.forEach(p => {
        const div = document.createElement('div');
        div.className = 'data-card';
        div.style.padding = '20px';
        div.innerHTML = `
            <span class="label-micro" style="color:var(--accent-red);">${p.label}</span>
            <p class="text-body" style="font-size:12px; margin-top:12px; font-weight:600; line-height:1.4;">"${p.prompt}"</p>
            <button class="label-micro" style="margin-top:16px; background:none; border:none; text-decoration:underline; cursor:pointer;" onclick="copyText('${p.prompt.replace(/'/g, "\\'")}', this)">Copy Prompt →</button>
        `;
        promptList.appendChild(div);
    });

    // 2. Summary List
    const list = clone.querySelector('#slide-preview-list');
    SLIDES.slice(1, 16).forEach(s => {
        const row = document.createElement('div');
        row.style.cssText = 'padding:16px 0; border-bottom:var(--border-thin); display:flex; gap:20px; align-items:center;';
        row.innerHTML = `
            <div class="num-tabular" style="color:var(--accent-red); font-weight:800;">${s.num}</div>
            <div class="label-micro" style="opacity:0.6;">${s.title}</div>
            <div style="flex:1; text-align:right;">✓ READY</div>
        `;
        list.appendChild(row);
    });

    clone.querySelector('#download-btn').onclick = downloadPPTX;
    clone.querySelector('#restart-btn').onclick = () => {
        if (confirm('Clear session and start over?')) {
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
        btn.textContent = '✓ COPIED';
        setTimeout(() => btn.textContent = old, 1500);
    });
}

// ── PPTX GENERATION ───────────────────────────────────────────────
function downloadPPTX() {
    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_WIDE';
    pres.defineSlideMaster({
        title: 'SD_MASTER',
        background: { color: 'FFFFFF' },
        objects: [
            { line: { x: 0.5, y: 0.8, w: 12.3, h: 0, line: { color: '000000', width: 0.5 } } },
            { text: { text: 'SILVER DUST // INTRO PLAN', options: { x: 0.5, y: 0.4, fontFace: 'Helvetica Neue', fontSize: 8, color: 'D44122', bold: true } } }
        ]
    });

    // Slide 1: Title
    let s1 = pres.addSlide({ masterName: 'SD_MASTER' });
    s1.addText((S.ans['s1_title'] || 'PROJECT TITLE').toUpperCase(), { x: 0.5, y: 3.0, w: 12, fontFace: 'Helvetica Neue', fontSize: 54, bold: true });
    s1.addText('A STRUCTURED FRAMEWORK FOR PRESENTING NEW PROJECTS', { x: 0.5, y: 4.2, w: 12, fontFace: 'Helvetica Neue', fontSize: 14, opacity: 0.6 });

    // Slide 2: Meta
    let s2 = pres.addSlide({ masterName: 'SD_MASTER' });
    s2.addText('HOW TO USE THIS TEMPLATE', { x: 0.5, y: 1.5, fontFace: 'Helvetica Neue', fontSize: 32, bold: true, color: 'D44122' });

    // Core Content Slides (Simple mapping for now)
    SLIDES.slice(3, 15).forEach(meta => {
        let sc = pres.addSlide({ masterName: 'SD_MASTER' });
        sc.addText(meta.num, { x: 0.5, y: 1.2, fontFace: 'Helvetica Neue', fontSize: 24, bold: true, color: 'D44122' });
        sc.addText(meta.title.toUpperCase(), { x: 0.5, y: 1.8, fontFace: 'Helvetica Neue', fontSize: 40, bold: true });
        
        sc.addText('[DATA CAPTURED FROM APP INTERFACE]', { x: 0.5, y: 3.5, w: 12, fontFace: 'Helvetica Neue', fontSize: 18, italic: true });
    });

    // Slide 15: Closing
    let s15 = pres.addSlide({ masterName: 'SD_MASTER' });
    s15.addText('THANK YOU.', { x: 0.5, y: 3.0, w: 12, fontFace: 'Helvetica Neue', fontSize: 72, bold: true, align: 'center' });

    pres.writeFile({ fileName: `Silver-Dust-Framework.pptx` });
}

// ── INIT ──────────────────────────────────────────────────────────
initNav();
renderHero();
