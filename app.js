
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const money = v => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v)||0);
const pct = v => new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(v)+'%';

const defaultState = {
  view:'home',
  theme: localStorage.getItem('norte-theme') || 'dark',
  routeProgress: Number(localStorage.getItem('norte-route') || 2),
  annualLimit: Number(localStorage.getItem('norte-limit') || 81000),
  revenue: Number(localStorage.getItem('norte-revenue') || 48350),
  monthly: Number(localStorage.getItem('norte-monthly') || 4820),
};
const state = {...defaultState};

const steps = [
  ['Definir o negócio','Conte, em linguagem simples, o que você pretende fazer.'],
  ['Confirmar perfil','Revise forma de atuação, cidade, sócios e estimativa inicial.'],
  ['Confirmar atividade','Confira se a atividade identificada representa o que você realmente fará.'],
  ['Preparar dados','Organize as informações necessárias antes de ir ao serviço oficial.'],
  ['Formalização oficial','Conclua a formalização diretamente no portal oficial correspondente.'],
  ['Pós-abertura','Acompanhe obrigações, faturamento e próximos passos da empresa.']
];

function save(){
  localStorage.setItem('norte-theme',state.theme);
  localStorage.setItem('norte-route',state.routeProgress);
  localStorage.setItem('norte-limit',state.annualLimit);
  localStorage.setItem('norte-revenue',state.revenue);
  localStorage.setItem('norte-monthly',state.monthly);
}
function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove('show'),2200);
}
function setTheme(theme){
  state.theme=theme; document.body.classList.toggle('dark',theme==='dark'); save();
}
function navigate(view){
  state.view=view;
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}
function routePercent(){ return Math.round((state.routeProgress/steps.length)*100); }

function home(){
  const remain=Math.max(0,state.annualLimit-state.revenue);
  return `
    <section class="hero glass">
      <div class="eyebrow">Norte • MVP</div>
      <h1>Clareza para abrir.<br>Controle para continuar.</h1>
      <p class="lead">A Norte transforma a burocracia empresarial em uma rota visual, guiada e fácil de entender — sem fingir ser contador, advogado ou portal do governo.</p>
      <svg class="route-art" viewBox="0 0 760 120" role="img" aria-label="Rota visual">
        <path class="base" d="M20 86 C150 12,250 115,390 50 S610 18,740 76" fill="none" stroke-width="2"/>
        <path class="live" d="M20 86 C150 12,250 115,390 50 S610 18,740 76" fill="none" stroke-width="3" stroke-linecap="round"/>
        <circle cx="20" cy="86" r="6" fill="var(--accent)"/><circle cx="390" cy="50" r="7" fill="var(--bg)" stroke="var(--accent)" stroke-width="3"/><circle cx="740" cy="76" r="6" fill="var(--border)"/>
      </svg>
      <div class="cta-row">
        <button class="btn btn-primary" data-go="route">Continuar minha rota</button>
        <button class="btn btn-secondary" data-go="tools">Abrir ferramentas</button>
      </div>
    </section>

    <div class="grid grid-2" style="margin-top:15px">
      <article class="card clickable" data-go="route">
        <div class="eyebrow">Sua rota</div><h3>Próximo passo: ${steps[Math.min(state.routeProgress,5)][0]}</h3>
        <p class="muted small">${routePercent()}% da jornada inicial concluída.</p>
        <div class="progress"><span style="width:${routePercent()}%"></span></div>
      </article>
      <article class="card clickable" data-go="tools">
        <div class="eyebrow">Faturamento</div><div class="stat">${money(remain)}</div>
        <p class="muted small">ainda disponível no limite de referência informado.</p>
        <span class="chip">Simulação informativa</span>
      </article>
    </div>

    <div class="grid grid-3" style="margin-top:15px">
      <article class="card"><div class="eyebrow">01</div><h3>Entende</h3><p class="muted small">A pessoa explica o negócio do jeito dela.</p></article>
      <article class="card"><div class="eyebrow">02</div><h3>Organiza</h3><p class="muted small">A Norte transforma informação em uma sequência de ações.</p></article>
      <article class="card"><div class="eyebrow">03</div><h3>Direciona</h3><p class="muted small">Etapas oficiais continuam sendo feitas nos serviços oficiais.</p></article>
    </div>`;
}

function route(){
  return `
    <section class="card">
      <div class="eyebrow">Sua rota</div>
      <h2>Abertura guiada</h2>
      <p class="muted">Você sempre sabe onde está, o que já fez e o que vem depois.</p>
      <div class="kpi-row">
        <div class="kpi"><span class="tiny muted">Progresso</span><b>${routePercent()}%</b></div>
        <div class="kpi"><span class="tiny muted">Concluídas</span><b>${state.routeProgress}/${steps.length}</b></div>
        <div class="kpi"><span class="tiny muted">Agora</span><b style="font-size:16px">${state.routeProgress<6?steps[state.routeProgress][0]:'Pós-abertura'}</b></div>
      </div>
      <div class="progress" style="margin-top:16px"><span style="width:${routePercent()}%"></span></div>
    </section>

    <section class="route-list" style="margin-top:16px">
      ${steps.map((s,i)=>{
        const done=i<state.routeProgress, current=i===state.routeProgress, locked=i>state.routeProgress;
        return `<article class="route-step ${done?'done':''} ${current?'current':''} ${locked?'locked':''}">
          <div class="eyebrow">${done?'Concluído':current?'Etapa atual':'Depois'}</div>
          <h3>${done?'✓ ':current?'→ ':''}${s[0]}</h3>
          <p class="muted small">${s[1]}</p>
          ${current&&state.routeProgress<6?`<button class="btn btn-primary route-complete">Concluir etapa</button>`:''}
        </article>`;
      }).join('')}
    </section>
    <div class="disclaimer" style="margin-top:16px">A Norte organiza e explica o caminho. Quando houver decisão contábil, jurídica ou fiscal específica, o produto deve recomendar análise profissional.</div>`;
}

function tools(){
  const used=state.annualLimit>0?(state.revenue/state.annualLimit)*100:0;
  const remain=Math.max(0,state.annualLimit-state.revenue);
  return `
    <section class="card">
      <div class="eyebrow">Ferramentas</div><h2>Números simples. Decisões mais claras.</h2>
      <p class="muted">Calculadoras informativas usando os valores que você fornecer.</p>
      <div class="tool-tabs">
        <button class="active" data-tool="limit">Limite</button>
        <button data-tool="projection">Projeção</button>
        <button data-tool="excess">Excesso</button>
        <button data-tool="das">DAS</button>
      </div>
      <div id="toolBody">
        <form class="form" id="limitForm">
          <label><span class="label">Limite anual de referência</span><input id="limitInput" type="number" min="1" step="0.01" value="${state.annualLimit}"></label>
          <label><span class="label">Faturamento acumulado</span><input id="revenueInput" type="number" min="0" step="0.01" value="${state.revenue}"></label>
          <button class="btn btn-primary" type="submit">Calcular</button>
          <div class="result">
            <div class="tiny muted">AINDA DISPONÍVEL</div><div class="result-value">${money(remain)}</div>
            <div class="progress"><span style="width:${Math.min(100,used)}%"></span></div>
            <p class="small muted" style="margin:9px 0 0">${pct(used)} do limite informado já utilizado.</p>
          </div>
        </form>
      </div>
    </section>
    <div class="disclaimer" style="margin-top:15px">Simulações informativas. O resultado depende dos dados informados e não substitui análise contábil, fiscal ou jurídica quando necessária.</div>`;
}

function company(){
  return `
    <section class="card">
      <div class="eyebrow">Minha Empresa</div><h2>O negócio continua depois do CNPJ.</h2>
      <p class="muted">A área pós-abertura mantém o usuário dentro da Norte.</p>
    </section>
    <div class="grid grid-2" style="margin-top:15px">
      <article class="card"><div class="eyebrow">Faturamento do mês</div><div class="stat">${money(state.monthly)}</div><p class="muted small">Informado manualmente no protótipo.</p></article>
      <article class="card"><div class="eyebrow">Situação</div><div class="stat" style="font-size:25px">Tudo sob controle</div><p class="muted small">Nenhum alerta crítico configurado.</p><span class="chip success">● Em dia</span></article>
    </div>
    <section class="card" style="margin-top:15px">
      <h3>Próximos compromissos</h3>
      <div class="sep"></div>
      <p><strong>DAS mensal</strong><br><span class="muted small">Acompanhar vencimento e direcionar ao serviço oficial.</span></p>
      <div class="sep"></div>
      <p><strong>Declaração anual</strong><br><span class="muted small">Acompanhar prazo e explicar o que significa.</span></p>
      <div class="sep"></div>
      <p><strong>Documentos</strong><br><span class="muted small">Organização de informações importantes, sem armazenar credenciais gov.br.</span></p>
    </section>`;
}

function help(){
  return `
    <section class="card">
      <div class="eyebrow">Assistente Norte</div><h2>Pergunte do seu jeito.</h2>
      <p class="muted">No produto real, a resposta deve ser fundamentada em fontes oficiais e sinalizar claramente quando o caso exige profissional.</p>
      <form id="helpForm" class="form">
        <label><span class="label">Qual é sua dúvida?</span><textarea id="question" placeholder="Ex.: Posso trabalhar em casa sendo MEI?"></textarea></label>
        <button class="btn btn-primary" type="submit">Perguntar à Norte</button>
        <div id="helpResult" class="result" style="display:none"></div>
      </form>
    </section>
    <div class="disclaimer" style="margin-top:15px"><strong>Escopo seguro do MVP:</strong> orientar, explicar, organizar e direcionar. Nada de guardar senha gov.br, protocolar em nome do usuário ou tomar decisão tributária individualizada.</div>`;
}

function projectionTool(){
  return `<form class="form" id="projectionForm">
    <label><span class="label">Faturado até agora</span><input id="pCurrent" type="number" min="0" value="${state.revenue}"></label>
    <label><span class="label">Média mensal esperada</span><input id="pAvg" type="number" min="0" value="7500"></label>
    <label><span class="label">Meses restantes</span><input id="pMonths" type="number" min="0" max="12" value="4"></label>
    <button class="btn btn-primary" type="submit">Projetar</button><div id="pResult" class="result"></div>
  </form>`;
}
function excessTool(){
  return `<form class="form" id="excessForm">
    <label><span class="label">Limite de referência</span><input id="eLimit" type="number" min="1" value="${state.annualLimit}"></label>
    <label><span class="label">Faturamento anual</span><input id="eRevenue" type="number" min="0" value="92000"></label>
    <button class="btn btn-primary" type="submit">Analisar excesso</button><div id="eResult" class="result"></div>
  </form>`;
}
function dasTool(){
  return `<form class="form" id="dasForm">
    <label><span class="label">Valor de referência do DAS</span><input id="dasValue" type="number" min="0" step="0.01" placeholder="Informe o valor vigente"></label>
    <label><span class="label">Quantidade de meses</span><input id="dasMonths" type="number" min="1" max="12" value="12"></label>
    <button class="btn btn-primary" type="submit">Simular total</button><div id="dasResult" class="result"></div>
    <div class="disclaimer">No MVP, o valor vigente deve vir de uma base oficial atualizável. Evitamos deixar regra fiscal sensível fixa no código.</div>
  </form>`;
}

function bindTools(){
  $$('.tool-tabs button').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.tool-tabs button').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    const type=btn.dataset.tool, body=$('#toolBody');
    body.innerHTML=type==='limit'?tools().match(/<form class="form" id="limitForm">[\s\S]*?<\/form>/)[0]:
      type==='projection'?projectionTool():type==='excess'?excessTool():dasTool();
    bindToolForms();
  }));
  bindToolForms();
}
function bindToolForms(){
  const lf=$('#limitForm'); if(lf) lf.addEventListener('submit',e=>{
    e.preventDefault(); state.annualLimit=Math.max(1,Number($('#limitInput').value)||1); state.revenue=Math.max(0,Number($('#revenueInput').value)||0); save(); render();
  });
  const pf=$('#projectionForm'); if(pf){
    const run=()=>{const cur=Math.max(0,Number($('#pCurrent').value)||0),avg=Math.max(0,Number($('#pAvg').value)||0),m=Math.min(12,Math.max(0,Number($('#pMonths').value)||0));$('#pResult').innerHTML=`<div class="tiny muted">PROJEÇÃO</div><div class="result-value">${money(cur+avg*m)}</div><p class="small muted">Estimativa matemática mantendo a média informada.</p>`};
    pf.addEventListener('submit',e=>{e.preventDefault();run()}); run();
  }
  const ef=$('#excessForm'); if(ef){
    const run=()=>{const l=Math.max(1,Number($('#eLimit').value)||1),r=Math.max(0,Number($('#eRevenue').value)||0),x=Math.max(0,r-l),p=x/l*100;$('#eResult').innerHTML=x===0?`<strong>Dentro do limite informado.</strong>`:`<div class="tiny muted">EXCESSO MATEMÁTICO</div><div class="result-value">${money(x)}</div><p class="small muted">${pct(p)} acima do limite informado.</p><span class="chip warning">⚠ Recomendar análise profissional</span>`};
    ef.addEventListener('submit',e=>{e.preventDefault();run()}); run();
  }
  const df=$('#dasForm'); if(df){
    const run=()=>{const v=Math.max(0,Number($('#dasValue').value)||0),m=Math.min(12,Math.max(1,Number($('#dasMonths').value)||1));$('#dasResult').innerHTML=v?`<div class="tiny muted">TOTAL SIMULADO</div><div class="result-value">${money(v*m)}</div><p class="small muted">${m} mês(es) × ${money(v)}.</p>`:`<span class="muted">Informe um valor de referência vigente.</span>`};
    df.addEventListener('submit',e=>{e.preventDefault();run()}); run();
  }
}

function render(){
  const v=$('#view');
  v.style.animation='none'; void v.offsetWidth; v.style.animation='';
  v.innerHTML=state.view==='home'?home():state.view==='route'?route():state.view==='tools'?tools():state.view==='company'?company():help();

  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));
  if(state.view==='route'){
    const c=$('.route-complete'); if(c)c.addEventListener('click',()=>{if(state.routeProgress<6){state.routeProgress++;save();toast('Etapa concluída. Próximo passo liberado.');render();}});
  }
  if(state.view==='tools') bindTools();
  if(state.view==='help'){
    $('#helpForm').addEventListener('submit',e=>{
      e.preventDefault(); const q=$('#question').value.trim(); if(!q)return;
      const r=$('#helpResult'); r.style.display='block'; r.innerHTML=`<strong>Protótipo:</strong> no app real, a Norte buscaria a regra oficial aplicável à sua pergunta, mostraria a fonte e indicaria análise profissional quando a resposta dependesse do seu caso específico.`;
    });
  }
}

document.body.classList.toggle('dark',state.theme==='dark');
$('#themeBtn').addEventListener('click',()=>setTheme(state.theme==='dark'?'light':'dark'));
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
render();
