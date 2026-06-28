/* ──────────────────────────────────────
   NAVBAR MOBILE TOGGLE
────────────────────────────────────── */
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

document.addEventListener('click', e => {
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('navToggle');
  if(nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) {
    nav.classList.remove('open');
  }
});

/* ──────────────────────────────────────
   UTILS
────────────────────────────────────── */
const $ = id => document.getElementById(id);
const showErr = (id, v) => { $(id).style.display = v ? 'flex' : 'none'; };
const sanitize = v => v.replace(/<[^>]*>/g,'').trim();

/* ──────────────────────────────────────
   MODE TOGGLE
────────────────────────────────────── */
const MODES = {
  empresa: {
    title: 'Cadastro de Empresa',
    sideTitle: 'Conecte sua empresa aos melhores devs',
    sideDesc: 'Cadastre sua empresa e encontre desenvolvedores verificados para seus projetos em minutos.',
    features: ['Acesso a +12 mil devs verificados','Publicação ilimitada de vagas','Dados com criptografia AES-256','Suporte dedicado 24/7'],
    cssAccent: '#3B82F6', cssAccent2: '#6366F1',
  },
  dev: {
    title: 'Cadastro de Desenvolvedor',
    sideTitle: 'Seu perfil dev, visível para quem importa',
    sideDesc: 'Crie seu portfólio técnico e seja encontrado por empresas que usam as suas stacks.',
    features: ['3.200+ empresas cadastradas','8.400+ vagas abertas','Perfil com verificação GitHub','Controle total da sua visibilidade'],
    cssAccent: '#3FB950', cssAccent2: '#58A6FF',
  }
};

let currentMode = 'empresa';

function setMode(mode) {
  if(mode === currentMode) return;
  currentMode = mode;

  /* flash transition */
  const overlay = $('modeOverlay');
  overlay.classList.add('flash');
  setTimeout(() => overlay.classList.remove('flash'), 200);

  const m = MODES[mode];

  /* body class */
  document.body.className = 'mode-' + mode;

  /* CSS vars */
  document.documentElement.style.setProperty('--accent',  m.cssAccent);
  document.documentElement.style.setProperty('--accent2', m.cssAccent2);
  document.documentElement.style.setProperty('--border-f', m.cssAccent);

  /* toggle buttons */
  $('btnEmpresa').classList.toggle('active', mode === 'empresa');
  $('btnDev').classList.toggle('active', mode === 'dev');
  $('btnEmpresa').setAttribute('aria-pressed', mode === 'empresa');
  $('btnDev').setAttribute('aria-pressed', mode === 'dev');

  /* content */
  $('cardTitle').textContent   = m.title;
  $('sideTitle').textContent   = m.sideTitle;
  $('sideDesc').textContent    = m.sideDesc;

  /* features */
  $('sideFeatures').innerHTML = m.features
    .map(f => `<div class="feature-item"><span class="feature-dot"></span>${f}</div>`)
    .join('');

  /* panels */
  $('panelEmpresa').classList.toggle('active', mode === 'empresa');
  $('panelDev').classList.toggle('active', mode === 'dev');

  /* reset progress to step 1 */
  resetProgress(1);
  window.scrollTo({top:0, behavior:'smooth'});
}

/* init features */
setMode('empresa'); 
currentMode = null; 
setMode('empresa');

/* ──────────────────────────────────────
   PROGRESS BAR (shared)
────────────────────────────────────── */
function resetProgress(n) {
  ['ps1','ps2','ps3'].forEach((id,i) => $(id).classList.toggle('active', i < n));
}
function setProgress(n) {
  ['ps1','ps2','ps3'].forEach((id,i) => $(id).classList.toggle('active', i < n));
}

/* ──────────────────────────────────────
   EMPRESA LOGIC
────────────────────────────────────── */
let eStep = 1;

$('e-cnpj').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').slice(0,14);
  v = v.replace(/^(\d{2})(\d)/,'$1.$2')
       .replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3')
       .replace(/\.(\d{3})(\d)/,'.$1/$2')
       .replace(/(\d{4})(\d)/,'$1-$2');
  this.value = v;
  const valid = validaCNPJ(v);
  $('cnpjBadge').classList.toggle('show', valid);
});

$('e-tel').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').slice(0,11);
  v = v.replace(/^(\d{2})(\d)/,'($1) $2');
  v = v.replace(/\D/g,'').length > 10 ? v.replace(/(\d{5})(\d{1,4})$/,'$1-$2') : v.replace(/(\d{4})(\d{1,4})$/,'$1-$2');
  this.value = v;
});

$('e-senha').addEventListener('input', function() { updateStrength(this.value,'e'); });

function validaCNPJ(s) {
  const c = s.replace(/\D/g,'');
  if(c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const calc = n => {
    let sum=0, pos=n-7;
    for(let i=n;i>=1;i--){ sum+=parseInt(c[n-i])*pos--; if(pos<2)pos=9; }
    const r=sum%11<2?0:11-sum%11; return r===parseInt(c[n]);
  };
  return calc(12)&&calc(13);
}

function eValidate(n) {
  let ok = true;
  if(n===1) {
    if(!sanitize($('e-razao').value)) { showErr('err-e-razao',true); ok=false; } else showErr('err-e-razao',false);
    if(!validaCNPJ($('e-cnpj').value)) { showErr('err-e-cnpj',true); ok=false; } else showErr('err-e-cnpj',false);
    if(!$('e-seg').value) { showErr('err-e-seg',true); ok=false; } else showErr('err-e-seg',false);
    if($('e-tel').value.replace(/\D/g,'').length < 10) { showErr('err-e-tel',true); ok=false; } else showErr('err-e-tel',false);
    const site=$('e-site').value;
    if(site && !/^https?:\/\/.+\..+/.test(site)) { showErr('err-e-site',true); ok=false; } else showErr('err-e-site',false);
  }
  if(n===2) {
    if(!sanitize($('e-nome').value)) { showErr('err-e-nome',true); ok=false; } else showErr('err-e-nome',false);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('e-email').value)) { showErr('err-e-email',true); ok=false; } else showErr('err-e-email',false);
    const s=$('e-senha').value;
    if(!(s.length>=12&&/[A-Z]/.test(s)&&/[0-9]/.test(s)&&/[^A-Za-z0-9]/.test(s))) { showErr('err-e-senha',true); ok=false; } else showErr('err-e-senha',false);
    if($('e-conf').value !== s) { showErr('err-e-conf',true); ok=false; } else showErr('err-e-conf',false);
  }
  if(n===3) {
    if(!$('e-perg').value) { showErr('err-e-perg',true); ok=false; } else showErr('err-e-perg',false);
    if(!sanitize($('e-resp').value)) { showErr('err-e-resp',true); ok=false; } else showErr('err-e-resp',false);
    if(!$('e-termos').checked) { showErr('err-e-termos',true); ok=false; } else showErr('err-e-termos',false);
  }
  return ok;
}

function eGoStep(n) {
  if(n > eStep && !eValidate(eStep)) return;
  $('e-step'+eStep).classList.remove('active');
  eStep = n;
  $('e-step'+eStep).classList.add('active');
  setProgress(n);
}

function eSubmit() {
  if(!eValidate(3)) return;
  if($('e-bot').value) return;
  const btn = $('eBtnSubmit');
  btn.disabled = true; btn.textContent = 'Criando conta…';
  setTimeout(() => {
    $('e-step3').classList.remove('active');
    $('e-success').classList.add('active');
    $('progressBar').style.opacity = '0';
  }, 1400);
}

/* ──────────────────────────────────────
   DEV LOGIC
────────────────────────────────────── */
let dStep = 1;
const tags = [];

function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderTags() {
  $('tagsWrap').querySelectorAll('.tag').forEach(t=>t.remove());
  tags.forEach((tag,i) => {
    const el = document.createElement('div');
    el.className = 'tag';
    el.innerHTML = `${escHtml(tag)}<button onclick="removeTag(${i})" type="button">×</button>`;
    $('tagsWrap').insertBefore(el, $('tagInput'));
  });
}

function addTag(raw) {
  const val = sanitize(raw).replace(/[,;]/g,'').slice(0,25);
  if(!val || tags.includes(val) || tags.length >= 15) return;
  tags.push(val); renderTags();
}

function removeTag(i) { tags.splice(i,1); renderTags(); }

function tagKeydown(e) {
  if(e.key==='Enter'||e.key===',') { e.preventDefault(); addTag(e.target.value); e.target.value=''; }
  if(e.key==='Backspace'&&!e.target.value&&tags.length) { tags.pop(); renderTags(); }
}

let userTimer;
function checkUsername(el) {
  clearTimeout(userTimer);
  showErr('err-d-user',false); showErr('ok-d-user',false);
  if(!el.value) return;
  if(!/^[a-zA-Z0-9_]{3,30}$/.test(el.value)) { showErr('err-d-user',true); return; }
  userTimer = setTimeout(()=>{ showErr('ok-d-user',true); }, 500);
}

function checkGitHub(el) {
  $('ghBadge').classList.toggle('show', /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/?$/.test(el.value));
}

function previewAvatar(input) {
  const file = input.files[0];
  if(!file) return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)) { alert('Formato inválido.'); return; }
  if(file.size > 2*1024*1024) { alert('Máximo 2 MB.'); return; }
  const r = new FileReader();
  r.onload = e => { $('d-avatarPreview').innerHTML = `<img src="${e.target.result}" alt="Avatar" />`; };
  r.readAsDataURL(file);
}

$('d-senha').addEventListener('input', function() { updateStrength(this.value,'d'); });

function dValidate(n) {
  let ok = true;
  if(n===1) {
    if(!sanitize($('d-nome').value)) { showErr('err-d-nome',true); ok=false; } else showErr('err-d-nome',false);
    if(!/^[a-zA-Z0-9_]{3,30}$/.test($('d-user').value)) { showErr('err-d-user',true); ok=false; }
    if(!sanitize($('d-headline').value)) { showErr('err-d-headline',true); ok=false; } else showErr('err-d-headline',false);
    if(!document.querySelector('input[name="seniority"]:checked')) { showErr('err-d-sen',true); ok=false; } else showErr('err-d-sen',false);
    if(tags.length===0) { showErr('err-d-tags',true); ok=false; } else showErr('err-d-tags',false);
  }
  if(n===2) {
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('d-email').value)) { showErr('err-d-email',true); ok=false; } else showErr('err-d-email',false);
  }
  if(n===3) {
    const s=$('d-senha').value;
    if(!(s.length>=12&&/[A-Z]/.test(s)&&/[0-9]/.test(s)&&/[^A-Za-z0-9]/.test(s))) { showErr('err-d-senha',true); ok=false; } else showErr('err-d-senha',false);
    if($('d-conf').value !== s) { showErr('err-d-conf',true); ok=false; } else showErr('err-d-conf',false);
    if(!$('d-termos').checked) { showErr('err-d-termos',true); ok=false; } else showErr('err-d-termos',false);
  }
  return ok;
}

function dGoStep(n) {
  if(n > dStep && !dValidate(dStep)) return;
  $('d-step'+dStep).classList.remove('active');
  dStep = n;
  $('d-step'+dStep).classList.add('active');
  setProgress(n);
}

function dSubmit() {
  if(!dValidate(3)) return;
  if($('d-bot').value) return;
  const btn = $('dBtnSubmit');
  btn.disabled = true; btn.textContent = 'Criando perfil…';
  const username = sanitize($('d-user').value).toLowerCase();
  setTimeout(() => {
    $('d-step3').classList.remove('active');
    $('d-success').classList.add('active');
    $('progressBar').style.opacity = '0';
    $('d-profileUrl').textContent = `devconnect.io/@${username}`;
  }, 1400);
}

/* ──────────────────────────────────────
   SHARED HELPERS
────────────────────────────────────── */
function togglePass(id, btn) {
  const el = $(id);
  el.type = el.type==='password' ? 'text' : 'password';
  btn.textContent = el.type==='password' ? '👁' : '🙈';
}

function updateStrength(v, prefix) {
  const checks = [v.length>=12, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)];
  const score = checks.filter(Boolean).length;
  const colors = ['','#EF4444','#F59E0B','#10B981','#3FB950'];
  const labels = ['','Muito fraca','Média','Forte','Excelente'];
  [1,2,3,4].forEach(i => {
    $(prefix+'-sb'+i).style.background = i <= score ? colors[score] : '#1A1F30';
  });
  $(prefix+'-sLabel').textContent = labels[score] || 'Digite a senha';
  $(prefix+'-sLabel').style.color = colors[score] || 'var(--muted)';
}