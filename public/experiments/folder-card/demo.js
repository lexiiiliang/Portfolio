// Isolated material study. No production components, styles or source content are changed.
export function mountProjectFolder(host) {
  host.innerHTML = `<article class="folder" data-open="false" aria-label="From Query to Quest 项目卡片">
    <div class="ground" aria-hidden="true"></div><div class="back" aria-hidden="true"></div>
    <div class="sheet-clip"><div class="sheet-move"><div class="sheet-flip">
    <div class="paper visual" aria-hidden="true"><img src="./cover.webp" alt=""></div>
    <section class="paper summary" id="project-summary" aria-label="项目摘要" aria-hidden="true" inert>
      <div class="summary-top"><span>/ 太长不看版</span><button class="close" aria-label="收起摘要">×</button></div>
      <h3>将 Prompting 拓展为启发思考与持续反思的旅程。</h3>
      <dl><dt>挑战</dt><dd>当人感到不确定或思考受阻时，AI 对话如何超越线性的“请求 → 优化 → 结果”模式，支持深度思考？</dd><dt>我的成果</dt><dd>我结合批判性与参与式设计，提出三项设计原则与一个概念框架，将模糊想法、对话探索与现实行动连接起来。</dd></dl>
      <a href="http://localhost:3000/projects/from-query-to-quest">仔细看看 <span aria-hidden="true">↗</span></a>
    </section></div></div></div>
    <button class="pull" aria-label="快速了解 From Query to Quest" aria-expanded="false" aria-controls="project-summary"></button>
    <div class="front">
      <div class="frosted-flap" aria-hidden="true"></div>
      <svg class="flap-reflection" viewBox="0 0 392 250" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="rim-light" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0" stop-color="var(--rim-bright)"/>
            <stop offset=".32" stop-color="var(--rim-soft)"/>
            <stop offset=".7" stop-color="var(--rim-shade)"/>
            <stop offset="1" stop-color="var(--rim-bright)" stop-opacity=".65"/>
          </linearGradient>
          <filter id="rim-inset" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="soft"/>
            <feComposite in="SourceAlpha" in2="soft" operator="out" result="inner-edge"/>
            <feFlood flood-color="var(--rim-bright)" flood-opacity=".42"/>
            <feComposite in2="inner-edge" operator="in"/>
          </filter>
        </defs>
        <path d="M24 1H197Q209 1 217 11L233 30Q239 37 251 37H368Q391 37 391 60V225Q391 249 367 249H25Q1 249 1 225V25Q1 1 24 1Z" fill="white" filter="url(#rim-inset)"/>
        <path d="M24 1H197Q209 1 217 11L233 30Q239 37 251 37H368Q391 37 391 60V225Q391 249 367 249H25Q1 249 1 225V25Q1 1 24 1Z" fill="none" stroke="url(#rim-light)" stroke-width="1" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="front-copy"><h2><span class="title-en">From Query to Quest</span><span class="title-zh">从「询」到「寻」</span></h2><div class="meta"><span>03 &nbsp; / &nbsp; 硕士毕业设计</span><b>2025</b></div></div><span class="entry" aria-hidden="true">↗</span>
    </div></article>`;
  const folder = host.querySelector('.folder');
  const trigger = host.querySelector('.pull');
  const panel = host.querySelector('.summary');
  const close = host.querySelector('.close');
  const coverImage = host.querySelector('.visual img');
  const measureSheet = () => {
    const width = host.querySelector('.sheet-move').clientWidth;
    const ratio = coverImage.naturalWidth && coverImage.naturalHeight
      ? coverImage.naturalWidth / coverImage.naturalHeight : 368 / 221;
    folder.style.setProperty('--cover-height', `${width / ratio}px`);
    folder.style.setProperty('--sheet-height', `${Math.max(370, panel.scrollHeight)}px`);
  };
  new ResizeObserver(measureSheet).observe(host);
  coverImage.addEventListener('load', measureSheet);
  measureSheet();
  function setOpen(open, keyboard = false, returnFocus = false) {
    folder.dataset.instant = String(keyboard);
    folder.dataset.open = String(open);
    trigger.setAttribute('aria-expanded', String(open));

    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
    if (open && keyboard) close.focus({preventScroll:true});
    if (!open && returnFocus) trigger.focus({preventScroll:true});
  }
  trigger.addEventListener('pointerenter', () => { folder.dataset.instant = 'false'; });
  trigger.addEventListener('click', e => setOpen(true, e.detail === 0));
  close.addEventListener('click', e => setOpen(false, e.detail === 0, true));
  document.addEventListener('keydown', e => {if(e.key === 'Escape' && folder.dataset.open === 'true') setOpen(false, true, true)});
  document.addEventListener('pointerdown', e => {if(!folder.contains(e.target)) setOpen(false)});
}
mountProjectFolder(document.querySelector('#component'));
document.querySelector('#theme').addEventListener('click', e => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  e.currentTarget.setAttribute('aria-pressed', String(dark));
  e.currentTarget.textContent = dark ? '浅色模式' : '深色模式';
});

// Pointer-only labels live outside the card and never intercept input.
const cursorLabel = document.createElement('div');
cursorLabel.className = 'project-cursor';
cursorLabel.setAttribute('aria-hidden', 'true');
document.body.append(cursorLabel);
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
function hideCursorLabel() { cursorLabel.dataset.visible = 'false'; }
document.addEventListener('pointermove', event => {
  const target = event.target instanceof Element ? event.target : null;
  const surface = target?.closest('.pull, .front');
  if (!finePointer.matches || event.pointerType === 'touch' || !surface) {
    hideCursorLabel();
    return;
  }
  cursorLabel.textContent = surface.matches('.pull') ? '快速了解' : '项目详情 ↗';
  cursorLabel.style.left = `${Math.min(event.clientX + 16, innerWidth - 132)}px`;
  cursorLabel.style.top = `${Math.min(event.clientY + 16, innerHeight - 48)}px`;
  cursorLabel.dataset.visible = 'true';
});
document.addEventListener('pointerout', event => { if (!event.relatedTarget) hideCursorLabel(); });
document.addEventListener('pointerdown', hideCursorLabel);
document.addEventListener('keydown', hideCursorLabel);
window.addEventListener('blur', hideCursorLabel);
window.addEventListener('scroll', hideCursorLabel, true);
finePointer.addEventListener('change', hideCursorLabel);
