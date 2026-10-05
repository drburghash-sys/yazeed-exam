const QUESTIONS=[...(window.Q1||[]),...(window.Q2||[]),...(window.Q3||[]),...(window.Q4||[])],KEY='yazeed-roadmap-a2-v4';
let state=JSON.parse(localStorage.getItem(KEY)||'{"results":{}}'),view='home',qUnit=1,qPos=0,order=[];
const norm=s=>String(s??'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[–—]/g,'-').replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').replace(/\s*,\s*/g,',').trim();
const qkey=q=>`${q.unit}-${q.exercise}-${q.n}`, done=u=>QUESTIONS.filter(q=>q.unit===u&&state.results[qkey(q)]).length, correct=u=>QUESTIONS.filter(q=>q.unit===u&&state.results[qkey(q)]?.ok).length;
function save(){localStorage.setItem(KEY,JSON.stringify(state));document.getElementById('overall').textContent=Object.keys(state.results).length+'/120'}
function setTab(v){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.v===v))}
function chips(items,cls=''){return '<div class="chips">'+items.map(x=>`<span class="chip ${cls}">${x}</span>`).join('')+'</div>'}
function home(){
  return `<section class="card hero"><div><span class="pill">ROADMAP A2 · Units 1–4</span><h2>مذاكرة منظمة قبل الاختبار</h2><p class="muted">البرنامج الآن لا يكتفي بالملخص: كل درس فيه شرح خطوة بخطوة، مفردات، أمثلة، أشكال الأسئلة، الأخطاء الشائعة وخطة مراجعة، ثم اختبار الوحدة من أسئلة الكتاب.</p><div class="note"><b>الطريقة الأفضل:</b> افتح الوحدة → ادرس كل Lesson بالترتيب → راجع «كيف يأتي السؤال؟» → نفّذ خطة المراجعة → ابدأ اختبار الـ30 سؤالًا.</div></div><img src="icon.svg" alt="Roadmap A2"></section>
  <div class="grid">${UNITS.map(u=>`<article class="card unitcard"><span class="pill">Pages ${u.pages}</span><h3>Unit ${u.id} — ${u.title}</h3><p class="muted">${u.overview}</p><div class="progress"><div style="width:${done(u.id)/30*100}%"></div></div><p class="mini">تمت الإجابة: ${done(u.id)}/30 · الصحيح: ${correct(u.id)}</p><button class="btn" onclick="openUnit(${u.id})">شرح الوحدة بالتفصيل</button> <button class="btn secondary" onclick="startQuiz(${u.id})">اختبار 30 سؤالًا</button></article>`).join('')}</div>`
}
function lessonCard(l){
  return `<article class="card lesson">
    <div class="lessonhead"><div><span class="pill">${l.code} · p.${l.pages}</span><h3>${l.title}</h3><div class="goal">🎯 ${l.goal}</div></div></div>
    <div class="focusbar"><div><b>Grammar / Function</b><span class="english">${l.grammar}</span></div><div><b>Vocabulary</b><span class="english">${l.vocab}</span></div></div>
    <details open><summary>شرح الدرس خطوة بخطوة</summary>
      <div class="steps">${l.explain.map((x,i)=>`<section class="step"><div class="stepno">${i+1}</div><div><h4>${x.t}</h4><p>${x.b}</p><div class="examples">${x.e.map(e=>`<div class="example english">${e}</div>`).join('')}</div></div></section>`).join('')}</div>
    </details>
    <details><summary>المفردات المهمة</summary>${chips(l.vocabItems,'english')}</details>
    <details><summary>كيف قد يأتي السؤال في الاختبار؟</summary>
      <div class="patterns">${l.questionPatterns.map(p=>`<div class="pattern"><div class="pattern-title">${p.type}</div><p>${p.how}</p><div class="english sample">${p.sample}</div><div class="source">المصدر داخل الكتاب: ${p.ref}</div></div>`).join('')}</div>
    </details>
    <details><summary>الأخطاء الشائعة</summary><ul class="tips traps">${l.traps.map(t=>`<li class="english">${t}</li>`).join('')}</ul></details>
    <details><summary>خطة مذاكرة هذا الدرس</summary><ol class="studyplan">${l.plan.map(x=>`<li>${x}</li>`).join('')}</ol></details>
  </article>`
}
function unitPage(id){
  const u=UNITS.find(x=>x.id===id);
  return `<section class="card unitintro"><div class="quizhead"><div><span class="pill">Pages ${u.pages}</span><h2>Unit ${u.id} — ${u.title}</h2></div><button class="btn" onclick="startQuiz(${id})">اختبار 30 سؤالًا</button></div><p class="muted">${u.overview}</p><h4>نقاط التركيز في الاختبار</h4>${chips(u.examFocus,'english')}</section><div class="lessonstack">${u.lessons.map(lessonCard).join('')}</div>`
}
function quizLanding(){
  return `<section class="card"><h2>اختبارات الكتاب</h2><p class="muted">كل وحدة = 30 بندًا من صفحة Check and reflect الخاصة بها، مع مرجع الصفحة والتمرين والسؤال. الشرح منفصل عن الاختبار حتى يعرف الطالب ما هو شرح وما هو نص السؤال.</p><div class="grid">${UNITS.map(u=>`<article class="card"><h3>Unit ${u.id}</h3><p>Page ${u.check} · 30 questions</p><p>الصحيح: <b>${correct(u.id)}</b> من <b>${done(u.id)}</b></p><button class="btn" onclick="startQuiz(${u.id})">ابدأ</button></article>`).join('')}</div><button class="btn gold" onclick="resetAll()">مسح كل النتائج</button></section>`
}
function startQuiz(u){qUnit=u;qPos=0;order=QUESTIONS.filter(q=>q.unit===u);view='quiz';setTab('quiz');render();scrollTo(0,0)}
function quiz(){
  if(!order.length)return quizLanding();
  const q=order[qPos],r=state.results[qkey(q)];
  return `<section class="card"><div class="quizhead"><div><span class="pill">Unit ${qUnit}</span><h2>السؤال ${qPos+1} من 30</h2></div><div><b>${correct(qUnit)}</b> صحيح / <b>${done(qUnit)}</b> مجاب</div></div><div class="progress"><div style="width:${(qPos+1)/30*100}%"></div></div><div class="toc" style="margin-top:12px">${order.map((x,i)=>`<button class="qnum ${state.results[qkey(x)]?'done':''} ${i===qPos?'current':''}" onclick="jump(${i})">${i+1}</button>`).join('')}</div></section>
  <section class="card"><div class="source">${q.source}</div><div class="help">${q.help||''}</div>${q.context?`<div class="context">${q.context}</div>`:''}<div class="qtext">${q.text}</div><div class="answerrow"><input id="ans" autocomplete="off" placeholder="Type your answer here" value="${r?String(r.value).replace(/"/g,'&quot;'):''}" ${r?'disabled':''}><button class="btn" onclick="check()" ${r?'disabled':''}>تحقق</button></div><div id="fb" class="feedback ${r?(r.ok?'ok':'bad'):''}">${r?(r.ok?'✓ Correct':'✗ Incorrect') : ''}${r?`<div class="key">Answer: ${q.answer}</div>`:''}</div><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button class="btn secondary" onclick="prev()" ${qPos===0?'disabled':''}>السابق</button><button class="btn secondary" onclick="reveal()">عرض الإجابة</button><button class="btn" onclick="next()">${qPos===29?'النتيجة':'التالي'}</button></div></section>`
}
function check(){const q=order[qPos],el=document.getElementById('ans'),n=norm(el.value),ok=q.accept.some(a=>norm(a)===n);state.results[qkey(q)]={value:el.value,ok};save();render()}
function reveal(){const q=order[qPos],fb=document.getElementById('fb');fb.className='feedback bad';fb.innerHTML=`<div>الإجابة الصحيحة:</div><div class="key">${q.answer}</div>`}
function prev(){if(qPos>0){qPos--;render();scrollTo(0,0)}}
function next(){if(qPos<29){qPos++;render();scrollTo(0,0)}else finish()}
function jump(i){qPos=i;render();scrollTo(0,0)}
function finish(){const c=correct(qUnit);document.getElementById('app').innerHTML=`<section class="card"><span class="pill">Unit ${qUnit}</span><h2>النتيجة: ${c}/30</h2><p class="muted">${c>=27?'ممتاز جدًا. راجع البنود التي أخطأت فيها فقط.':c>=24?'جيد جدًا؛ أعد الأسئلة الخاطئة.':c>=18?'تحتاج مراجعة القواعد قبل الإعادة.':'ارجع لشرح الوحدة ثم أعد الاختبار كاملًا.'}</p><button class="btn" onclick="startQuiz(${qUnit})">إعادة الاختبار</button> <button class="btn secondary" onclick="openUnit(${qUnit})">مراجعة الشرح</button></section>`;order=[]}
function resetAll(){if(confirm('هل تريد مسح جميع النتائج؟')){state={results:{}};save();render()}}
function openUnit(id){view='u'+id;setTab(view);render();scrollTo(0,0)}
function render(){const app=document.getElementById('app');if(view==='home')app.innerHTML=home();else if(view.startsWith('u'))app.innerHTML=unitPage(Number(view.slice(1)));else app.innerHTML=quiz();save()}
document.querySelector('.tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;view=b.dataset.v;if(view!=='quiz')order=[];setTab(view);render();scrollTo(0,0)});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
render();
