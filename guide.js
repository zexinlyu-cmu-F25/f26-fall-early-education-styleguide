'use strict';
/* Vanilla, browser-local examples. No camera, GPS, AI or messaging services. */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = name => window.KIDDASH_ASSETS?.[name] || 'assets/'+name;
const icon = name => `<img class="kd-icon" src="${asset('icon-'+name+'.svg')}" alt="">`;
const groups = [
 ['Documentation', ['overview','branding']],
 ['Foundations', ['colors','typography','layout']],
 ['Components', ['icons','navigation','buttons','forms','menus','dialogs','lists','messages','verification','arrival','location']],
 ['Guidelines', ['patterns','responsive','library']],
 ['Resources', ['downloads']]
];
$('#guide-nav').innerHTML = groups.map(([label, ids]) => `<div class="nav-group"><div class="nav-label">${label}</div>${ids.map(id => `<a href="#${id}">${esc($('#'+id).dataset.title)}</a>`).join('')}</div>`).join('');
const mobileQuery = matchMedia('(max-width:767px)');
function closeNavigation() { $('#sidebar').classList.remove('open'); $('#sidebar').inert=mobileQuery.matches; $('#mobile-menu').setAttribute('aria-expanded','false'); }
mobileQuery.addEventListener('change',closeNavigation);
function route() {
 const requested = location.hash.slice(1) || 'overview';
 const aliases={brand:'branding',pickup:'verification',parent:'arrival',map:'location',states:'buttons'};
 const id = aliases[requested] || requested;
 if (id === 'main') { $('#main').focus(); return; }
 const page = $('.page#'+CSS.escape(id)) || $('#overview');
 $$('.page').forEach(p => { p.hidden = p !== page; });
 $$('#guide-nav a').forEach(a => a.hash === '#'+page.id ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));
 document.title = `${page.dataset.title} · Kiddash Style Guide`;
 closeNavigation(); window.scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange', () => { route(); $('#main').focus({preventScroll:true}); }); route();
$('#mobile-menu').addEventListener('click', () => { const open = $('#sidebar').classList.toggle('open'); $('#sidebar').inert=!open&&mobileQuery.matches; $('#mobile-menu').setAttribute('aria-expanded',String(open)); if (open) $('#guide-nav a').focus(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && $('#sidebar').classList.contains('open')) { closeNavigation(); $('#mobile-menu').focus(); } });
document.addEventListener('click', e => { if (!e.target.closest('#sidebar,#mobile-menu')) closeNavigation(); });
let toastTimer;
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false; toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4000); }
async function copy(text, trigger) {
 try { await navigator.clipboard.writeText(text); toast('Copied to clipboard.'); }
 catch { const field = document.createElement('textarea'); field.value = text; document.body.append(field); field.select(); const ok = document.execCommand('copy'); field.remove(); toast(ok ? 'Copied to clipboard.' : 'Copy unavailable. Select the text or download the CSS.'); trigger?.focus(); }
}
const triggers = new WeakMap();
function openDialog(id, trigger = document.activeElement) { const d = $('#'+id); triggers.set(d, trigger); d.showModal(); }
$$('dialog').forEach(d => d.addEventListener('close', () => { const trigger = triggers.get(d); if(trigger?.isConnected && !trigger.closest('[hidden]')) trigger.focus(); }));
document.addEventListener('click', e => {
 const b = e.target.closest('button,a'); if(!b) return;
 if(b.dataset.go) location.hash = b.dataset.go;
 if(b.dataset.toast) toast(b.dataset.toast);
 if(b.dataset.dialog) openDialog(b.dataset.dialog,b);
 if(b.hasAttribute('data-close')) b.closest('dialog').close();
 if(b.dataset.sheetAction) { b.closest('dialog').close(); toast('Demo: '+b.dataset.sheetAction); }
 if(b.dataset.reply) reply(b.dataset.reply,b);
 if(b.dataset.quick) { $('#reply-text').value = b.dataset.quick; $('#reply-text').focus(); $('#reply-text').dispatchEvent(new Event('input')); }
 if(b.dataset.source) { const source = $('#'+b.dataset.source); source.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth',block:'center'}); source.focus(); }
});

// Foundations are actual specimens, not images of documentation.
const colors = [
 ['Ink','#3E322A','Primary text'],['Cocoa','#6B5A4C','Secondary text'],['White','#FFFFFF','App canvas'],
 ['Honey','#F6C35A','Primary action'],['Blush','#F79A8B','Needs attention'],['Clay','#DE7462','Deliberate decision'],
 ['Mist','#E2EADE','Remaining / support'],['Sage','#5F7F68','Large accents'],['Sky','#DCE7E5','Summary surface'],
 ['Line','#D8CFC0','Subtle separators'],['Paper','#FBF5EA','Reference surface'],['Cream','#FFFBF4','Reference surface'],
 ['Neutral 50','#F7F7F6','Subtle surface'],['Neutral 100','#ECECEB','Picked up']
];
$('#palette').innerHTML = colors.map(([name,hex,role]) => `<button class="swatch" data-hex="${hex}" aria-label="Copy ${name}, ${hex}"><div class="swatch-color" style="background:${hex}"></div><div class="swatch-info"><strong>${name}</strong><span>${hex}</span><small>${role}</small></div></button>`).join('');
$$('[data-hex]').forEach(b => b.addEventListener('click', () => copy(b.dataset.hex,b)));
const types = [['Count',48,56,700,'count'],['Display',32,40,700,'display'],['Heading',28,36,700,'heading'],['Title',24,32,700,'title'],['Button',20,28,700,'button'],['Name / emphasis',16,24,700,'strong'],['Body',16,24,400,'body'],['Metadata',12,16,400,'caption']];
$('#type-specimens').innerHTML = types.map(([name,size,line,weight,key]) => `<div class="type-row"><div><strong>${name}</strong><div class="type-meta">${size} px / ${line} px · ${weight}<br>.kd-type-${key}</div></div><div class="type-sample kd-type-${key}" style="font-weight:${weight}"></div></div>`).join('');
function updateType() { $$('.type-sample').forEach(s => {s.textContent = $('#type-input').value || 'Student name · Pickup status';}); }
$('#type-input').addEventListener('input',updateType); $('#type-reset').addEventListener('click', () => {$('#type-input').value = 'Student name · Pickup status';updateType();}); updateType();
$('#grid-toggle').addEventListener('change', e => {$('#layout-grid').hidden = !e.target.checked;});
$('#padding-select').addEventListener('change', e => {$('#padding-demo').style.padding = e.target.value+'px';$('#padding-label').textContent = e.target.value+' px';});
$('#space-scale').innerHTML = [4,8,12,16,20,24,32,40,48,56,64].map(n => `<div class="space-row"><span>${n} px</span><i style="width:${n*3}px"></i><code>--kd-space-${n}</code></div>`).join('');
const icons = ['scan','map','pickup','chat','alerts','search','back','check','close','pin','history','qr','arrow','menu'];
$('#icon-gallery').innerHTML = icons.map(name => `<a class="icon-cell" href="${asset('icon-'+name+'.svg')}" download="kiddash-${name}.svg" aria-label="Download ${name} icon">${icon(name)}<span>${name}</span></a>`).join('');
$$('.kd-table').forEach(table => {if(table.parentElement.classList.contains('kd-table-wrap'))return;const wrap=document.createElement('div');wrap.className='kd-table-wrap';wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label',(table.querySelector('caption')?.textContent||'Reference table')+'; scroll horizontally on small screens');table.before(wrap);wrap.append(table);});

// Buttons, validation and keyboard menus.
$('#loading-button').addEventListener('click', async e => {const b=e.currentTarget;b.disabled=true;b.setAttribute('aria-busy','true');b.innerHTML=icon('history')+' Saving…';await new Promise(r=>setTimeout(r,1000));b.disabled=false;b.removeAttribute('aria-busy');b.textContent='Try loading state';toast('Demo result saved.');});
$$('#count-samples button').forEach(b => b.addEventListener('click', () => {$$('#count-samples button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#count-sample-result').textContent = $('span',b).textContent+' selected. The active surface is inset.';}));
function validate(field, helper, message) { const valid = !!field.value.trim(); field.setAttribute('aria-invalid',String(!valid)); helper.classList.toggle('kd-error',!valid);helper.textContent = valid ? 'Ready to send. This is a local demo.' : message; return valid; }
$('#message-form').addEventListener('submit',e=>{e.preventDefault();const field=$('#message-field');if(!validate(field,$('#message-help'),'Enter a message so the teacher knows what changed.')){field.focus();return;}$('#form-feedback').textContent=`Demo update sent: ${new FormData(e.currentTarget).get('delay')} minutes late. “${field.value.trim()}”`;});
$('#message-field').addEventListener('input',e=>{if(e.target.hasAttribute('aria-invalid'))validate(e.target,$('#message-help'),'Enter a message so the teacher knows what changed.');$('#form-feedback').textContent='';});
$('#search-sample').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();const names=['Justin H.','Sofia R.','Noah K.'].filter(n=>n.toLowerCase().includes(q));$('#search-sample-result').textContent=!q ? 'Try “Justin”, “Sofia” or “Noah”.' : names.length ? names.join(' · ') : 'No matching students. Try a different name.';});
const menu=$('#class-menu'), menuTrigger=$('#class-menu-button');
function closeMenu(restore=true){menu.hidden=true;menuTrigger.setAttribute('aria-expanded','false');if(restore)menuTrigger.focus();}
function showMenu(){menu.hidden=false;menuTrigger.setAttribute('aria-expanded','true');$('[aria-checked=true]',menu).focus();}
menuTrigger.addEventListener('click',()=>menu.hidden?showMenu():closeMenu());
menuTrigger.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();showMenu();}});
$$('[data-grade]',menu).forEach(b=>b.addEventListener('click',()=>{$$('[data-grade]',menu).forEach(x=>{x.setAttribute('aria-checked',String(x===b));x.innerHTML=esc(x.dataset.grade)+(x===b?icon('check'):'<span></span>');});menuTrigger.textContent=b.dataset.grade;closeMenu();toast(b.dataset.grade+' selected.');}));
menu.addEventListener('keydown',e=>{const options=$$('[data-grade]',menu),i=options.indexOf(document.activeElement);if(e.key==='Escape'){e.preventDefault();closeMenu();}if(e.key==='Tab'){closeMenu(false);}if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();options[e.key==='Home'?0:e.key==='End'?options.length-1:(i+(e.key==='ArrowDown'?1:-1)+options.length)%options.length].focus();}});
document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('.menu-preview'))closeMenu(false);});


const patterns = [
 ['Persistent navigation','Keep the primary destinations visible.','Teacher: Map, Pickup, Chat, Alerts. Parent: Pickup, Chat, My code. Selected destinations use color, a soft shape and weight.','navigation'],
 ['Progressive disclosure','Default to unresolved items; expose the full roster through labeled count controls.','Attention is the default list. Count controls reveal Remaining or Picked up without making the teacher remember hidden children.','buttons'],
 ['Contextual replies','Keep the message attached to the child.','A full-width message opens the reply dialog. The child’s name stays in the title; the whole surface is tappable.','lists'],
 ['Modal confirmation','Reserve a focused pause for a consequential action.','Keep trip active is the safe first action. Escape and Close dismiss the dialog and return focus.','dialogs'],
 ['Search and filter','Narrow the information around a known name.','Show class, location source and update time. Only the chosen child and place are highlighted.','location'],
 ['Visible feedback','Show whether an action is pending, successful or needs correction.','Loading blocks duplicate submission; errors stay beside fields. Successful submissions require explicit feedback.','forms'],
 ['Direct manipulation','Provide gesture feedback and equivalent visible controls.','Swipe the identity pair right for Match or left to stop. Visible buttons provide the same options. The swipe is not a handoff.','verification'],
 ['Journey progress','Separate trip, arrival, preparation and pickup.','A parent starts sharing explicitly. Manual updates stay available. A pass does not mean a child has been released.','arrival'],
 ['Source-linked summary','Help a teacher find changes while preserving context.','Each summary item links to a source message. An AI summary can never grant pickup permission.','messages']
];
$('#pattern-list').innerHTML=patterns.map(([name,problem,rule,page])=>`<article class="pattern-row"><div><h3>${name}</h3><a class="kd-link" href="#${page}">View component</a></div><div><strong>${problem}</strong><p>${rule}</p></div></article>`).join('')+'<p class="component-note">Pattern reference: <a href="https://ui-patterns.com/patterns" target="_blank" rel="noopener">UI Patterns catalog</a>. These are Kiddash’s documented applications; confirm the team’s Task 4 list before submission.</p>';

// Component-scoped dialog examples; no application or roster state.
let replyChild='';
function reply(name,origin){replyChild=name;$('#reply-title').textContent='Reply about '+name;$('#reply-text').value='';$('#reply-text').removeAttribute('aria-invalid');$('#reply-help').classList.remove('kd-error');$('#reply-help').textContent='Component preview. No message will be sent.';openDialog('reply-dialog',origin);}
$('#reply-text').addEventListener('input',e=>{if(e.target.hasAttribute('aria-invalid'))validate(e.target,$('#reply-help'),'Write a reply or choose a quick response.');});
$('#reply-form').addEventListener('submit',e=>{e.preventDefault();if(!validate($('#reply-text'),$('#reply-help'),'Write a reply or choose a quick response.')){$('#reply-text').focus();return;}$('#reply-dialog').close();toast('Reply specimen submitted. No message was sent.');});
$('#confirm-end-trip').addEventListener('click',()=>{$('#end-trip-dialog').close();toast('Confirmation component activated. No trip was changed.');});

// Breakpoint preview mirrors the downloadable responsive.css.
function updateViewport(width){width=Number(width);$('#viewport-width').value=String(width);$('#viewport-output').textContent=width+' px';const cols=width>=1200?12:width>=768?8:4;const margin=width<=360?16:width>=768?32:24;const gap=width<=360?8:width>=1200?24:width>=768?16:12;
 $('#responsive-canvas').style.width=width+'px';const grid=$('#sim-grid');grid.style.gridTemplateColumns=`repeat(${cols},minmax(0,1fr))`;grid.style.gap=gap+'px';grid.style.paddingInline=margin+'px';grid.innerHTML=Array.from({length:cols},(_,i)=>`<i>${i+1}</i>`).join('');grid.style.maxWidth='1280px';grid.style.marginInline='auto';
 $('#sim-content').style.gridTemplateColumns=`repeat(${width>=1200?3:width>=768?2:1},minmax(0,1fr))`;$('#sim-content').style.paddingInline=margin+'px';$('#breakpoint-result').innerHTML=`${width>=1200?'Desktop':width>=768?'Tablet':'Phone'} · ${cols} columns <small>${margin} px margins · ${gap} px gutters · ${width} px simulated viewport</small>`;
}
$('#viewport-width').addEventListener('input',e=>updateViewport(e.target.value));$$('[data-viewport]').forEach(b=>b.addEventListener('click',()=>updateViewport(b.dataset.viewport)));updateViewport(402);

// CSS examples are extracted from the same stylesheet used by every specimen.
const cssFamilies={brand:['.kd-logo'],colors:[':root'],typography:['.kd-type'],layout:['.kd-screen','.kd-content','.kd-stack','.kd-row'],buttons:['.kd-button','.kd-link','.kd-icon-button','.kd-count','.kd-metrics'],forms:['.kd-field','.kd-label','.kd-input','.kd-textarea','.kd-select','.kd-help','.kd-error','.kd-search','.kd-choice'],menus:['.kd-menu'],navigation:['.kd-nav','.kd-home-indicator'],states:['.kd-button','.kd-count','.kd-chip','.kd-search','.kd-response','.kd-pair','.kd-journey','.kd-arrival','.kd-open-row','.kd-message','.kd-spinner','.kd-avatar','.kd-identity'],dialogs:['.kd-dialog','.kd-sheet'],lists:['.kd-list','.kd-attention','.kd-avatar','.kd-chip','.kd-table','.kd-empty'],icons:['.kd-icon'],patterns:['.kd-progress','.kd-notice'],verification:['.kd-scanner','.kd-scan-window','.kd-identity','.kd-pair','.kd-pass','.kd-button'],arrival:['.kd-response','.kd-journey','.kd-arrival','.kd-open-row','.kd-progress'],location:['.kd-map','.kd-location','.kd-search-result','.kd-empty'],messages:['.kd-message','.kd-summary']};
Promise.resolve([window.KIDDASH_RESOURCES.css,window.KIDDASH_RESOURCES.responsive]).then(([css,responsive])=>{
 const sheet=new CSSStyleSheet(); sheet.replaceSync(css.replace(/@import[^;]+;/g,''));
 const extract=(rules,selectors)=>[...rules].map(rule=>{
  if(rule.type===CSSRule.STYLE_RULE)return selectors.some(s=>rule.selectorText.includes(s))?rule.cssText:'';
  if(rule.type===CSSRule.KEYFRAMES_RULE)return rule.cssText;
  if(rule.cssRules){const inner=extract(rule.cssRules,selectors);return inner?rule.cssText.slice(0,rule.cssText.indexOf('{')+1)+'\n'+inner+'\n}':'';}
  return '';
 }).filter(Boolean).join('\n\n');
 $$('[data-css]').forEach(host=>{const key=host.dataset.css;const code=key==='responsive'?responsive:extract(sheet.cssRules,cssFamilies[key]||[]);const section=document.createElement('section');section.className='section';section.innerHTML=`<h2>${key==='responsive'?'responsive.css':'Component CSS'}</h2><p class="component-note">${key==='responsive'?'Complete media-query file, ready to download.':'These rules come from the shared kiddash.css used on this page. Include its root tokens and base styles when reusing components.'}</p><div class="code-panel"><div class="code-head"><span>${key==='responsive'?'responsive.css':'kiddash.css'}</span><button class="copy-code">Copy CSS</button></div><details><summary>View CSS</summary><pre><code></code></pre></details></div>`;$('code',section).textContent=code;$('.copy-code',section).addEventListener('click',e=>copy(code,e.currentTarget));host.append(section);});
}).catch(()=>{$$('[data-css]').forEach(host=>{host.innerHTML='<p>CSS reference unavailable. <a href="kiddash.css" download>Download the full CSS</a>.</p>';});});
// Standalone exports embed their downloadable resources as Blob URLs.
if(window.KIDDASH_DOWNLOADS){
 $$('a[href]').forEach(a=>{const name=a.getAttribute('href'),item=window.KIDDASH_DOWNLOADS[name];if(!item)return;const bytes=Uint8Array.from(atob(item.data),c=>c.charCodeAt(0));a.href=URL.createObjectURL(new Blob([bytes],{type:item.type}));if(name==='overview.html'){a.download=name;a.removeAttribute('target');a.textContent='Download one-pager';}});
}
