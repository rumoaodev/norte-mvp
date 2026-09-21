const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const safeJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
const state={
  view:'home',
  theme:localStorage.getItem('norte-theme')||'dark',
  step:+(localStorage.getItem('norte-step')||0),
  answers:safeJSON('norte-answers',{}),
  stage:+(localStorage.getItem('norte-stage')||0),
  stageResults:safeJSON('norte-stage-results',{})
};
const questions=[
['business','O que você quer abrir?','Conta pra gente do seu jeito. Pode escrever como você falaria com alguém.','text','Ex.: Quero abrir uma barbearia com meu irmão','Aqui a Norte só quer entender sua ideia. Depois ela traduz isso para os termos oficiais.'],
['partners','Você vai tocar esse negócio sozinho ou com alguém?','Escolha a opção que mais parece com sua situação agora.','options',['Sozinho','Com sócio','Ainda não sei'],'Isso ajuda a entender como a empresa pode ser organizada.'],
['place','Onde esse negócio vai funcionar?','Pode ser em casa, numa loja, só pela internet ou indo até o cliente.','options',['Na minha casa','Loja ou sala','Só pela internet','Na casa do cliente','Outro lugar'],'O local pode mudar regras e licenças.'],
['city','Em qual cidade vai ser?','Cada cidade pode ter regras diferentes.','text','Ex.: Rio de Janeiro - RJ','A cidade ajuda a identificar quais regras locais precisam ser verificadas.'],
['address','Você já sabe o endereço?','Se ainda estiver procurando, tudo bem.','options',['Sim','Ainda estou procurando'],'Depois a Norte ajuda a verificar se sua atividade pode funcionar nesse endereço.'],
['activity','O que você vai fazer nesse negócio?','Escolha uma opção simples.','options',['Vender produtos','Prestar serviços','Os dois'],'Por trás disso existe a atividade oficial da empresa, chamada CNAE.'],
['revenue','Quanto você acha que vai entrar de dinheiro por mês?','É só uma estimativa. Se não souber, tudo bem.','options',['Até R$ 5 mil','R$ 5 mil a R$ 20 mil','Mais de R$ 20 mil','Não faço ideia'],'Essa estimativa ajuda no planejamento e no enquadramento inicial.'],
['employees','Vai ter funcionário logo no começo?','Se ainda não decidiu, marque “Ainda não sei”.','options',['Sim','Não','Ainda não sei'],'Ter funcionário pode mudar obrigações e custos.'],
['name','Você já pensou num nome pra empresa?','Pode ser o nome que gostaria de usar.','text','Ex.: Norte Barbearia','A disponibilidade do nome é verificada depois.'],
['simple','Seu objetivo é entrar no Simples Nacional?','Se não tiver certeza, a Norte explica antes de você decidir.','options',['Sim','Quero entender primeiro','Ainda não sei'],'Para empresa nova, a intenção de optar pelo Simples é feita no MAT no momento da inscrição do CNPJ.']
];

const requiredDiagnosis=['business','partners','place','city','address','activity','revenue','employees','name','simple'];
const hasDiagnosis=()=>requiredDiagnosis.every(k=>String(state.answers[k]||'').trim());
const diagnosisConfirmed=()=>localStorage.getItem('norte-diagnosis-v051')==='yes' && hasDiagnosis();
const firstMissingStep=()=>{
 const i=requiredDiagnosis.findIndex(k=>!String(state.answers[k]||'').trim());
 return i<0?0:i;
};

const stages=[
{title:'Conte sobre o seu negócio',desc:'Antes de qualquer órgão, responda perguntas simples sobre o que você quer abrir. A Norte usa isso para montar a sua rota.',kind:'diagnosis'},
{title:'Ver se o endereço pode ser usado',desc:'Fazer a Consulta Prévia de Viabilidade e verificar atividade, endereço e nome empresarial.',kind:'official',label:'Ir para a Viabilidade oficial',url:'https://www.gov.br/empresas-e-negocios/pt-br/redesim/abrir-cnpj/viabilidade'},
{title:'Organizar sua empresa',desc:'Reunir sócios, atividade, endereço, nome, documentos e decisões antes do registro.',kind:'inside'},
{title:'Registro da empresa',desc:'Enviar os dados e documentos ao órgão de registro competente para constituir a empresa.',kind:'official',label:'Ir para Abrir CNPJ / Redesim',url:'https://www.gov.br/empresas-e-negocios/pt-br/redesim/abrir-cnpj'},
{title:'CNPJ + Simples Nacional',desc:'Após o registro, acompanhar o protocolo, preencher o MAT e manifestar a intenção pelo Simples no momento da inscrição do CNPJ.',kind:'official',label:'Acompanhar protocolo na Redesim',url:'https://www.gov.br/empresas-e-negocios/pt-br/redesim'},
{title:'Licenças necessárias',desc:'Verificar as autorizações exigidas para a empresa poder funcionar regularmente.',kind:'official',label:'Ir para Licenciamento oficial',url:'https://www.gov.br/empresas-e-negocios/pt-br/redesim/abrir-cnpj/licenciamento'},
{title:'Empresa funcionando',desc:'Conferir o que ficou concluído e começar o acompanhamento pós-abertura.',kind:'inside'}
];

function save(){
 localStorage.setItem('norte-theme',state.theme);
 localStorage.setItem('norte-step',state.step);
 localStorage.setItem('norte-answers',JSON.stringify(state.answers));
 localStorage.setItem('norte-stage',state.stage);
 localStorage.setItem('norte-stage-results',JSON.stringify(state.stageResults));
}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove('show'),1900)}
function home(){const done=Object.values(state.stageResults).filter(v=>v==='done').length;return `<section class="hero"><div class="hero-lockup"><img src="norte-mark.png" alt=""><div><strong>NORTE</strong><small>Sua rota para empreender.</small></div></div><div class="eyebrow">Destino: Simples Nacional</div><h1>Abra sua empresa.<br><span class="gradient">Sem se perder no caminho.</span></h1><p class="lead">Você conta o que quer fazer do seu jeito. A Norte organiza a rota, traduz a burocracia e leva você ao serviço oficial certo na hora certa.</p><svg class="route-art" viewBox="0 0 760 120"><path d="M20 86 C150 12,250 115,390 50 S610 18,740 76" fill="none" stroke="var(--line)" stroke-width="2"/><path class="run" d="M20 86 C150 12,250 115,390 50 S610 18,740 76" fill="none" stroke-width="3"/></svg><div class="row"><button class="btn primary" id="start">${diagnosisConfirmed()?'Continuar minha abertura':'Começar meu diagnóstico'}</button><button class="btn secondary" data-go="route">Ver minha rota</button></div><p class="muted" style="font-size:12px">A Norte não é um portal do governo. Quando uma ação oficial for necessária, você será direcionado ao serviço público correspondente.</p></section><div class="grid grid2" style="margin-top:14px"><article class="card"><div class="eyebrow">Princípio Norte</div><h3>Burocracia por trás. Português de gente normal na frente.</h3><p class="muted">Você entende o que está fazendo antes de sair para qualquer portal.</p></article><article class="card"><div class="eyebrow">Sua jornada</div><h3>${done} de ${stages.length} etapas concluídas</h3><div class="progress"><i style="width:${done/stages.length*100}%"></i></div></article></div>`}

function route(){
 const remaining=stages.filter((_,i)=>state.stageResults[i]!=='done').length;
 return `<section class="journey-head"><div class="goal-card"><div class="goal-top"><div><div class="goal-badge">Seu destino</div><h2>Empresa regularizada e preparada para o Simples.</h2><p class="muted">A Norte mostra somente o próximo passo necessário.</p></div><div class="goal-count"><strong>${remaining}</strong><span>passos restantes</span></div></div></div></section><div class="route-list">${stages.map((s,i)=>stageCard(s,i)).join('')}</div>`
}
function stageCard(s,i){
 const done=state.stageResults[i]==='done';
 const status=done?'done':i===state.stage?'current':i>state.stage?'locked':'';
 const marker=done?'✓':i+1;
 let actions='';
 if(s.kind==='diagnosis'){
   if(i===state.stage && !done){
     actions+=`<button class="official" id="startDiagnosis">Responder as perguntas</button>`;
     actions+=`<button class="ghost" data-ai="${i}">✦ Me explica esta etapa</button>`;
   }else if(done){
     actions+=`<button class="ghost" id="reviewDiagnosis">Revisar minhas respostas</button>`;
   }
 }else if(i===state.stage && !done){
   if(s.kind==='official'){
     actions+=`<a class="official" href="${s.url}" target="_blank" rel="noopener">↗ ${s.label}</a>`;
     actions+=`<button class="ghost" data-result="${i}">Já voltei / informar resultado</button>`;
   }else{
     actions+=`<button class="official" data-complete="${i}">Concluir esta preparação</button>`;
   }
   actions+=`<button class="ghost" data-ai="${i}">✦ Não entendi / Norte IA</button>`;
 }
 let diagnosisSummary='';
 if(i===0 && done){
   diagnosisSummary=`<div class="summary" style="margin-top:14px"><div><span>Negócio</span><strong>${state.answers.business||'—'}</strong></div><div><span>Cidade</span><strong>${state.answers.city||'—'}</strong></div><div><span>Atividade</span><strong>${state.answers.activity||'—'}</strong></div><div><span>Simples</span><strong>${state.answers.simple||'—'}</strong></div></div>`;
 }
 return `<article class="stage ${status}"><div class="stage-line"><div class="stage-index">${marker}</div><div class="stage-copy"><div class="eyebrow">${done?'Concluído':i===state.stage?'Agora':i>state.stage?'Depois':'Revisar'}</div><h3>${s.title}</h3><p>${s.desc}</p></div></div>${diagnosisSummary}<div class="stage-actions">${actions}</div><div id="result-${i}" class="result-panel"><strong>Como essa etapa terminou?</strong><div class="result-options"><button data-stage-result="${i}:done">✓ Concluí</button><button data-stage-result="${i}:pending">⏳ Está em análise</button><button data-stage-result="${i}:error">! Deu erro / pendência</button><button data-stage-result="${i}:confused">? Não entendi</button></div></div></article>`
}

function tools(){return `<section class="card"><div class="eyebrow">Ferramentas</div><h2>Ferramentas da sua empresa.</h2><p class="muted">Aqui entram simuladores e organizadores que ajudam na jornada. Eles serão informativos e não substituirão análise profissional quando ela for necessária.</p></section>`}
function company(){const a=state.answers;return `<section class="card"><div class="eyebrow">Minha Empresa</div><h2>${a.business||'Seu negócio começa aqui.'}</h2><p class="muted">${a.city||'Faça o diagnóstico inicial para montar seu painel.'}</p>${Object.keys(a).length?`<div class="summary"><div><span>Negócio</span><strong>${a.business||'—'}</strong></div><div><span>Cidade</span><strong>${a.city||'—'}</strong></div><div><span>Sócios</span><strong>${a.partners||'—'}</strong></div><div><span>Objetivo tributário</span><strong>${a.simple||'—'}</strong></div></div>`:''}</section>`}
function ai(){
 const current=stages[Math.min(state.stage,stages.length-1)];
 return `<section class="ai-panel"><div class="ai-orb">✦</div><div class="context-chip">Contexto atual: ${current.title}</div><h2>Norte IA</h2><p>Mostra o que aquela tela, mensagem ou etapa significa em linguagem simples — usando o ponto da jornada em que você está.</p><div class="ai-actions"><button class="ai-action" id="explainCurrent">Me explica minha etapa atual<small>Entenda o que você precisa fazer agora.</small></button><button class="ai-action" id="askProblem">Apareceu um erro ou mensagem<small>Diga o que apareceu para receber orientação.</small></button></div><div class="upload-box"><p><strong>Não entendeu a tela do órgão?</strong></p><p class="muted">Envie um print para a Norte.</p><input id="screenInput" type="file" accept="image/*"><label for="screenInput">Selecionar print</label><div id="preview" class="preview"><img id="previewImg" alt="Prévia do print selecionado"></div><p class="ai-note">Nesta versão o print fica somente no seu navegador para pré-visualização. A leitura automática por IA será conectada na próxima camada.</p></div></section>`
}
function render(){
 const v=$('#view');
 v.innerHTML=state.view==='home'?home():state.view==='route'?route():state.view==='tools'?tools():state.view==='company'?company():ai();
 $$('[data-go]').forEach(b=>b.onclick=()=>nav(b.dataset.go));
 if($('#start'))$('#start').onclick=()=>diagnosisConfirmed()?nav('route'):openWizard(true);
 if($('#startDiagnosis'))$('#startDiagnosis').onclick=()=>openWizard(true);
 if($('#reviewDiagnosis'))$('#reviewDiagnosis').onclick=()=>openWizard(false,true);
 $$('[data-complete]').forEach(b=>b.onclick=()=>completeStage(+b.dataset.complete));
 $$('[data-result]').forEach(b=>b.onclick=()=>$('#result-'+b.dataset.result).classList.toggle('open'));
 $$('[data-stage-result]').forEach(b=>b.onclick=()=>handleResult(b.dataset.stageResult));
 $$('[data-ai]').forEach(b=>b.onclick=()=>{state.view='ai';render();syncNav()});
 if($('#explainCurrent'))$('#explainCurrent').onclick=()=>toast('Norte IA contextual será conectada nesta tela.');
 if($('#askProblem'))$('#askProblem').onclick=()=>toast('Na próxima camada você poderá colar a mensagem do órgão.');
 if($('#screenInput'))$('#screenInput').onchange=e=>previewImage(e.target.files[0]);
}
function completeStage(i){state.stageResults[i]='done';state.stage=Math.min(stages.length-1,i+1);save();render();toast('Etapa concluída. Próximo passo liberado.')}
function handleResult(value){
 const [idxRaw,result]=value.split(':');const i=+idxRaw;
 state.stageResults[i]=result;
 if(result==='done'){state.stage=Math.min(stages.length-1,i+1);toast('Boa. Próxima etapa liberada.')}
 else if(result==='pending'){toast('Certo. A Norte mantém essa etapa como pendente.')}
 else{state.view='ai';toast('Vamos entender o que aconteceu.')}
 save();render();syncNav();
}
function previewImage(file){
 if(!file)return;
 if(!file.type.startsWith('image/'))return toast('Escolha uma imagem.');
 const reader=new FileReader();
 reader.onload=()=>{const p=$('#preview'),img=$('#previewImg');img.src=reader.result;p.classList.add('show');toast('Print carregado para pré-visualização.');};
 reader.readAsDataURL(file);
}
function syncNav(){$$('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view))}
function nav(v){state.view=v;syncNav();render();scrollTo({top:0,behavior:'smooth'})}
function openWizard(forceMissing=false,review=false){
 if(review) state.step=0;
 else if(forceMissing) state.step=firstMissingStep();
 else state.step=Math.min(state.step,questions.length-1);
 $('#wizard').classList.remove('hidden');document.body.style.overflow='hidden';drawQuestion()
}
function closeWizard(){$('#wizard').classList.add('hidden');document.body.style.overflow='';save()}
function drawQuestion(){
 if(state.step>=questions.length)return summary();
 const q=questions[state.step],pct=Math.round((state.step+1)/questions.length*100);
 $('#stepText').textContent=`${state.step+1} de ${questions.length}`;$('#pct').textContent=pct+'%';$('#bar').style.width=pct+'%';
 let input=q[3]==='text'?`<input id="input" class="biginput" value="${state.answers[q[0]]||''}" placeholder="${q[4]}"><button id="next" class="next">Continuar</button>`:`<div class="answers">${q[4].map(o=>`<button class="answer" data-answer="${o}"><span>${o}</span><span>→</span></button>`).join('')}</div>`;
 $('#question').innerHTML=`<div class="qcard"><div class="qtag">Passo ${state.step+1}</div><h2>${q[1]}</h2><p>${q[2]}</p>${input}<div class="helpers"><button id="voice">● Falar em vez de digitar</button><button id="explainBtn">Me explica essa pergunta</button></div><div id="explain" class="explain">${q[5]}</div></div>`;
 $$('[data-answer]').forEach(b=>b.onclick=()=>{state.answers[q[0]]=b.dataset.answer;state.step++;save();drawQuestion()});
 if($('#next'))$('#next').onclick=()=>{const val=$('#input').value.trim();if(!val)return toast('Escreve uma resposta pra continuar.');state.answers[q[0]]=val;state.step++;save();drawQuestion()};
 $('#explainBtn').onclick=()=>{$('#explain').style.display=$('#explain').style.display==='block'?'none':'block'};
 $('#voice').onclick=()=>toast('Microfone entra em uma próxima versão.');
}
function summary(){
 const a=state.answers;$('#stepText').textContent='Pronto';$('#pct').textContent='100%';$('#bar').style.width='100%';
 $('#question').innerHTML=`<div class="qcard"><div class="qtag">Diagnóstico inicial</div><h2>Pronto. Agora temos um ponto de partida.</h2><p>A Norte vai transformar isso numa jornada até sua empresa estar regularizada e preparada para o Simples Nacional.</p><div class="summary"><div><span>Negócio</span><strong>${a.business||'—'}</strong></div><div><span>Com quem</span><strong>${a.partners||'—'}</strong></div><div><span>Onde</span><strong>${a.place||'—'}</strong></div><div><span>Cidade</span><strong>${a.city||'—'}</strong></div><div><span>Objetivo</span><strong>${a.simple||'—'}</strong></div></div><button id="build" class="next">Montar minha rota</button></div>`;
 $('#build').onclick=()=>{
  localStorage.setItem('norte-diagnosis-v051','yes');
  state.stageResults[0]='done';
  state.stage=1;
  save();
  closeWizard();
  nav('route');
  toast('Diagnóstico concluído. Próximo passo liberado.');
};
}
if(diagnosisConfirmed()){
 state.stageResults[0]='done';
 if(state.stage===0)state.stage=1;
}else{
 delete state.stageResults[0];
 state.stage=0;
}
save();
document.body.classList.toggle('dark',state.theme==='dark');
$('#theme').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';document.body.classList.toggle('dark',state.theme==='dark');save()};
$$('[data-view]').forEach(b=>b.onclick=()=>nav(b.dataset.view));
$('#close').onclick=closeWizard;
render();syncNav();
