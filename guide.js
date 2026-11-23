'use strict';
/* Vanilla, browser-local examples. No camera, GPS, AI or messaging services. */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = name => window.KIDDASH_ASSETS?.[name] || 'assets/'+name;
const icon = name => `<img class="kd-icon" src="${asset('icon-'+name+'.svg')}" alt="">`;
const groups = [
 ['Foundations', ['overview','brand','colors','typography','layout']],
 ['Components', ['buttons','forms','menus','dialogs','lists','icons']],
 ['Behavior', ['patterns','pickup','parent','map','messages']],
 ['Handoff', ['responsive','downloads']]
];
$('#guide-nav').innerHTML = groups.map(([label, ids]) => `<div class="nav-group"><div class="nav-label">${label}</div>${ids.map(id => `<a href="#${id}">${esc($('#'+id).dataset.title)}</a>`).join('')}</div>`).join('');
const mobileQuery = matchMedia('(max-width:767px)');
function closeNavigation() { $('#sidebar').classList.remove('open'); $('#sidebar').inert=mobileQuery.matches; $('#mobile-menu').setAttribute('aria-expanded','false'); }
mobileQuery.addEventListener('change',closeNavigation);
function route() {
 const id = location.hash.slice(1) || 'overview';
 if (id === 'main') { $('#main').focus(); return; }
 const page = $('.page#'+CSS.escape(id)) || $('#overview');
 $$('.page').forEach(p => { p.hidden = p !== page; });
 $$('#guide-nav a').forEach(a => a.hash === '#'+page.id ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));
 document.title = `${page.dataset.title} · Kiddash Style Guide`;
 closeNavigation(); window.scrollTo(0,0);
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
function updateType() { $$('.type-sample').forEach(s => {s.textContent = $('#type-input').value || 'A little closer, safely together.';}); }
$('#type-input').addEventListener('input',updateType); $('#type-reset').addEventListener('click', () => {$('#type-input').value = 'A little closer, safely together.';updateType();}); updateType();
$('#grid-toggle').addEventListener('change', e => {$('#layout-grid').hidden = !e.target.checked;});
$('#padding-select').addEventListener('change', e => {$('#padding-demo').style.padding = e.target.value+'px';$('#padding-label').textContent = e.target.value+' px';});
$('#space-scale').innerHTML = [4,8,12,16,20,24,32,40,48,56,64].map(n => `<div class="space-row"><span>${n} px</span><i style="width:${n*3}px"></i><code>--kd-space-${n}</code></div>`).join('');
const icons = ['scan','map','pickup','chat','alerts','search','back','check','close','pin','history','qr'];
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
$$('.nav-example a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();$$('a',a.closest('nav')).forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','page');toast(a.textContent.trim()+' navigation selected.');}));

const patterns = [
 ['Persistent navigation','Keep the primary destinations visible.','Teacher: Map, Pickup, Chat, Alerts. Parent: Pickup, Chat, My code. Selected destinations use a marker and weight.','menus'],
 ['Progressive disclosure','Show what needs action before the full roster.','Attention is the default list. Count controls reveal Remaining or Picked up without making the teacher remember hidden children.','pickup'],
 ['Contextual replies','Keep the message attached to the child.','A full-width message opens the reply dialog. The child’s name stays in the title; the whole surface is tappable.','lists'],
 ['Modal confirmation','Reserve a focused pause for a consequential action.','Keep trip active is the safe first action. Escape and Close dismiss the dialog and return focus.','dialogs'],
 ['Search and filter','Narrow the information around a known name.','Show class, location source and update time. Only the chosen child and place are highlighted.','map'],
 ['Visible feedback','Show whether an action is pending, successful or needs correction.','Loading blocks duplicate submission; errors stay beside fields. A handoff success changes the visible roster and count.','forms'],
 ['Direct manipulation','Make a decision feel physical without hiding the controls.','Swipe the identity pair right for Match or left to stop. Visible buttons provide the same options. The swipe is not a handoff.','pickup'],
 ['Journey progress','Separate trip, arrival, preparation and pickup.','A parent starts sharing explicitly. Manual updates stay available. A pass does not mean a child has been released.','parent'],
 ['Source-linked summary','Help a teacher find changes while preserving context.','Each summary item links to a source message. An AI summary can never grant pickup permission.','messages']
];
$('#pattern-list').innerHTML=patterns.map(([name,problem,rule,page])=>`<article class="pattern-row"><div><h3>${name}</h3><a class="kd-link" href="#${page}">Try the example</a></div><div><strong>${problem}</strong><p>${rule}</p></div></article>`).join('')+'<p class="component-note">Pattern reference: <a href="https://ui-patterns.com/patterns" target="_blank" rel="noopener">UI Patterns catalog</a>. These are Kiddash’s documented applications; confirm the team’s Task 4 list before submission.</p>';

// Teacher: one source of truth for counts, lists and handoff state.
const rosterNames=['Justin H.','Sofia R.','Noah K.','Emma L.','Lucas P.','Mia T.','Oliver M.','Ava W.'];
const pastNames=['Ben L.','Ella T.','Henry R.','Isla M.','Leo P.','Amelia N.','Jack C.','Grace D.','Liam S.','Chloe W.','Ethan B.','Lily A.'];
let remaining, picked, attention, filter='attention',replyChild='', replyOrigin=null, scanState='scan';
const initials=n=>n.split(' ').map(x=>x[0]).join('');
function log(message){const li=document.createElement('li');li.textContent=message;const s=document.createElement('small');s.textContent=`${picked.length} picked up + ${remaining.length} remaining = ${picked.length+remaining.length} children`;li.append(s);$('#event-log').prepend(li);}
function resetTeacher(){remaining=[...rosterNames];picked=[...pastNames];attention=new Set(['Justin H.','Sofia R.']);filter='attention';$('#event-log').innerHTML='';renderTeacher();log('Ready for today’s pickups.');}
function renderTeacher(){
 $('#attention-number').textContent=attention.size;$('#picked-number').textContent=picked.length;$('#remaining-number').textContent=remaining.length;
 const arrivals=['Justin H.','Noah K.','Emma L.'].filter(n=>remaining.includes(n));$('#arrival-queue').textContent=arrivals.length+' at gate';
 $$('[data-list]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.list===filter)));
 $('#queue-heading').textContent={attention:'Needs attention',picked:'Picked up',remaining:'Still with school',arrival:'Arrival order'}[filter];
 if(filter==='attention'){
  $('#live-queue').innerHTML=[...attention].map(n=>`<button class="kd-attention-card" data-reply="${n}"><span class="kd-row"><span class="kd-avatar">${initials(n)}</span><span><strong>${n}</strong><br><span class="kd-chip attention">${n==='Justin H.'?'Dad arrived · Just now':'New message · 2 min ago'}</span></span></span><p>${n==='Justin H.'?'“I’m at the North gate.”':'“I’ll be 20 minutes late today.”'}</p><span class="reply">Reply</span></button>`).join('')||'<div class="kd-empty"><strong>All caught up.</strong><p>No unresolved messages. Remaining students are one tap away.</p></div>';
 } else {
  const names=filter==='picked'?picked:filter==='arrival'?arrivals:[...remaining].sort();
  $('#live-queue').innerHTML='<ol class="kd-list">'+names.map((n,i)=>`<li class="kd-list-item">${filter==='arrival'?`<span data-order>${i+1}</span>`:`<span class="kd-avatar">${initials(n)}</span>`}<div><strong>${n}</strong><small>${filter==='picked'?'Handoff confirmed':filter==='arrival'?'Parent at North gate':'In school’s care'}</small></div>${filter==='picked'?icon('check'):''}</li>`).join('')+'</ol>';
 }
}
$$('[data-list]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.list;renderTeacher();}));
$('#arrival-queue').addEventListener('click',()=>{filter='arrival';renderTeacher();});
$('#reset-pickup').addEventListener('click',resetTeacher);resetTeacher();
function reply(name,origin){replyChild=name;replyOrigin=origin;$('#reply-title').textContent='Reply about '+name;$('#reply-text').value='';$('#reply-text').removeAttribute('aria-invalid');$('#reply-help').classList.remove('kd-error');$('#reply-help').textContent='This demo keeps replies in this browser session.';openDialog('reply-dialog',origin);}
$('#reply-text').addEventListener('input',e=>{if(e.target.hasAttribute('aria-invalid'))validate(e.target,$('#reply-help'),'Write a reply or choose a quick response.');});
$('#reply-form').addEventListener('submit',e=>{e.preventDefault();if(!validate($('#reply-text'),$('#reply-help'),'Write a reply or choose a quick response.')){$('#reply-text').focus();return;}const message=$('#reply-text').value.trim();$('#reply-dialog').close();attention.delete(replyChild);renderTeacher();log(`Reply about ${replyChild}: “${message}”`);toast('Demo reply sent. Pickup is not recorded.');if(!replyOrigin?.isConnected)$('#open-scanner').focus();});
function pair(){return `<div class="kd-identity"><div><span class="kd-avatar">JH</span><br><strong>Justin H.</strong><br><small>Grade 2</small></div><span aria-label="paired with">+</span><div><span class="kd-avatar" style="background:var(--kd-sky)">DH</span><br><strong>David Han</strong><br><small>Dad · Authorized</small></div></div>`;}
const scannerArt=`<div class="kd-scanner"><div class="kd-scan-window">${icon('qr')}</div><div class="scan-line"></div><small>Demo code · no live camera</small></div>`;
function renderScan(state){
 scanState=state;const body=$('#scan-body');
 const already=picked.includes('Justin H.');
 if(state==='scan'){ $('#scan-title').textContent='Scan pickup pass';body.innerHTML=`${scannerArt}<p style="margin-top:16px">Aim at the parent’s pickup code. For this demo, choose a result below.</p><div class="kd-stack"><button class="kd-button" data-scan="${already?'duplicate':'pair'}">Simulate valid code</button><button class="kd-button outline compact" data-scan="expired">Simulate expired code</button></div>`; }
 if(state==='expired'||state==='duplicate'){ $('#scan-title').textContent=state==='expired'?'This code has expired.':'Pickup already recorded.';body.innerHTML=`<div class="kd-notice warning">${state==='expired'?'Ask the parent to refresh their pickup pass. Keep the child with school until the pass and guardian are checked.':'Justin’s handoff is already in today’s history. This scan cannot record a second pickup.'}</div><button style="margin-top:24px" class="kd-button outline" data-scan="scan">Back to scanner</button>`; }
 if(state==='pair'){ $('#scan-title').textContent='Match the pickup.';body.innerHTML=`<p><span class="kd-chip success">Pickup pass verified</span></p><p>Does David match the person at the gate? Photos belong here in the live app; this guide uses initials.</p><div class="identity-swipe"><div class="swipe-labels"><span>Match</span><span>Stop</span></div>${pair()}</div><p class="component-note" style="margin:16px 0">Swipe right to match, left to stop, or tap below.</p><div class="kd-stack"><button class="kd-button secondary" data-scan="verify">Matches</button><button class="kd-button outline" data-scan="mismatch">Doesn’t match</button></div>`;setupSwipe(); }
 if(state==='mismatch'){ $('#scan-title').textContent='School verification needed.';body.innerHTML=`<div class="kd-notice warning">Keep Justin in the school’s care. Check with the school office before continuing. No pickup has been recorded.</div><div class="kd-stack" style="margin-top:24px"><button class="kd-button outline" data-scan="pair">Back to identity check</button><button class="kd-link" data-close>Close scanner</button></div>`;log('Identity did not match. Handoff blocked.'); }
 if(state==='verify'){ $('#scan-title').textContent='One last check.';body.innerHTML=`<p>Hand Justin to David, then confirm below.</p>${pair()}<div class="kd-notice" style="margin:24px 0">Identity checked. The child is still counted as remaining until you confirm the handoff.</div><div class="kd-stack"><button class="kd-button decision" data-scan="confirm">Confirm handoff</button><button class="kd-link" data-scan="pair">Back to identity check</button></div>`; }
 if(state==='done'){ $('#scan-title').textContent='Pickup confirmed.';body.innerHTML=`<div class="kd-notice"><strong>Justin left with David.</strong><p style="margin:8px 0 0">The roster and pickup history are updated.</p></div><button class="kd-button" style="margin-top:24px" data-close>Back to pickup</button>`; }
 if($('#scan-dialog').open) $('button',body)?.focus();
}
$('#scan-body').addEventListener('click',e=>{const b=e.target.closest('[data-scan]');if(!b)return;const next=b.dataset.scan;if(next==='confirm'){
 if(scanState!=='verify')return;
 if(remaining.includes('Justin H.')){remaining=remaining.filter(n=>n!=='Justin H.');picked.unshift('Justin H.');attention.delete('Justin H.');renderTeacher();log('Handoff confirmed: Justin H. left with David Han.');}
 renderScan('done');
 }else renderScan(next);
});
$('#open-scanner').addEventListener('click',e=>{renderScan('scan');openDialog('scan-dialog',e.currentTarget);});
function setupSwipe(){const card=$('.identity-swipe .kd-identity');let start=null;
 card.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,y:e.clientY};card.setPointerCapture(e.pointerId);card.classList.add('dragging');});
 card.addEventListener('pointermove',e=>{if(!start)return;const dx=e.clientX-start.x;card.style.transform=`translateX(${Math.max(-120,Math.min(120,dx))}px)`;});
 const end=e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;card.classList.remove('dragging');card.style.transform='';if(e.type!=='pointercancel'&&Math.abs(dx)>=80&&Math.abs(dx)>Math.abs(dy)){renderScan(dx>0?'verify':'mismatch');}};
 card.addEventListener('pointerup',end);card.addEventListener('pointercancel',end);
}

// Parent journey is explicitly separate from verified pickup state.
let parentState='idle',parentMethod='';
function parentButton(label,next,kind=''){return `<button class="kd-button ${kind}" data-parent="${next}">${label}</button>`;}
function renderParent(){
 const progress={idle:0,choose:0,denied:0,onway:1,arrived:2,wait:2,ready:2,pass:2,complete:3}[parentState];
 $('#parent-track').innerHTML=['Start','On the way','At school','Picked up'].map((t,i)=>`<div class="journey-stop ${i===progress?'active':i<progress?'done':''}" ${i===progress?'aria-current="step"':''}><b>${i<progress?'✓':i+1}</b>${t}</div>`).join('');
 const config={
  idle:['Ready for pickup?','Start when you leave. The school only receives an arrival update after you choose a method.','',parentButton('Start pickup','choose')],
  choose:['How would you like to update school?','Your choice applies to this pickup only.','<div class="kd-notice">Sharing sends approaching updates for this trip. It ends after handoff or cancellation.</div>',parentButton('Share for this pickup','shared')+parentButton('Use manual updates','manual','outline')+parentButton('Simulate permission denied','denied','outline compact')],
  denied:['Location is unavailable.','You can still tell school when you are on the way and when you arrive.','<div class="kd-notice warning">Permission denied in this simulation. No location has been accessed.</div>',parentButton('Continue with manual updates','manual')+parentButton('Back to choices','choose','outline')],
  onway:['You’re on your way.',parentMethod==='shared'?'Arrival sharing is on for this pickup. Approaching is not the same as arrived.':'Manual updates are on. Tell school when you reach the gate.','<div class="kd-notice"><strong>Picking up Justin H.</strong><br>Grade 2 · North gate · Ms. Chen</div>',parentButton('I’m at the North gate','arrived')+parentButton('End this trip','end','outline')],
  arrived:['You’re at the North gate.','Ms. Chen has your arrival update. Wait for her response.','<div class="kd-notice"><strong>Waiting for the teacher</strong><br>Justin is still in the school’s care.</div>',parentButton('Show pickup pass','pass')+parentButton('Simulate: teacher needs time','wait','outline compact')+parentButton('Simulate: teacher is getting ready','ready','outline compact')],
  wait:['Just a little moment.','Ms. Chen needs a little more time. Stay at the North gate.','<div class="kd-notice warning">“I’m with another student. Please wait a minute.”</div>',parentButton('Got it, I’ll wait here','ack','secondary')+parentButton('Simulate: teacher is getting ready','ready','outline compact')],
  ready:['Justin is getting ready.','Ms. Chen accepted your arrival update. Have your pickup pass ready.','<div class="kd-notice">“Got it! I’m getting Justin ready for you.”</div>',parentButton('Show pickup pass','pass')],
  pass:['Your pickup pass.','Show this to the teacher. They will check your identity before handing Justin to you.',`<div class="kd-pass"><img src="${asset('icon-qr.svg')}" alt="Illustrative demo code, not a valid pickup pass" style="width:128px;height:128px"><p><strong>Justin H. + David Han</strong><br>Authorized dad · Demo only</p></div>`,parentButton('Simulate: teacher confirms handoff','complete','secondary')+parentButton('Back to arrival','arrived','outline')],
  complete:['Together again.','The teacher confirmed the handoff. Sharing has ended for this trip.','<div class="kd-notice"><strong>Pickup recorded</strong><br>Justin H. · David Han</div>',parentButton('Start another demo','idle','outline')]
 }[parentState];
 $('#parent-title').textContent=config[0];$('#parent-copy').textContent=config[1];$('#parent-body').innerHTML=config[2];$('#parent-actions').innerHTML=config[3];$('#parent-body').style.marginBottom=config[2]?'24px':'0';
}
$('#parent-actions').addEventListener('click',e=>{const b=e.target.closest('[data-parent]');if(!b)return;let next=b.dataset.parent;$('#parent-feedback').textContent='';if(next==='end'){openDialog('end-trip-dialog',b);return;}if(next==='ack'){$('#parent-feedback').textContent='Demo acknowledgement sent. You are still waiting at the gate.';return;}if(['shared','manual'].includes(next)){parentMethod=next;next='onway';}parentState=next;renderParent();$('#parent-title').setAttribute('tabindex','-1');$('#parent-title').focus({preventScroll:true});});
$('#confirm-end-trip').addEventListener('click',()=>{$('#end-trip-dialog').close();parentState='idle';parentMethod='';renderParent();toast('Demo trip ended. Sharing stopped; child remains with school.');if(!$('#parent').hidden)$('#reset-parent').focus();});
$('#reset-parent').addEventListener('click',()=>{parentState='idle';parentMethod='';$('#parent-feedback').textContent='';renderParent();});renderParent();

// A focused, staff-reported location; other buildings remain neutral.
const students=[{name:'Justin H.',place:'Playground',teacher:'Ms. Chen'},{name:'Sofia R.',place:'Library',teacher:'Mr. Patel'},{name:'Noah K.',place:'Classroom 2B',teacher:'Ms. Chen'}];
function showMapResults(){const q=$('#map-search').value.trim().toLowerCase();const matches=students.filter(s=>s.name.toLowerCase().includes(q));$('#map-results').innerHTML=!q?'<p class="component-note">Enter a name to find a student.</p>':matches.length?matches.map(s=>`<button class="kd-attention-card" data-student="${s.name}"><strong>${s.name}</strong> · Grade 2<br><span class="muted">${s.place}</span></button>`).join(''):'<div class="kd-empty">No matching student. Check the spelling or try another name.</div>';}
$('#map-search').addEventListener('input',()=>{showMapResults();$('#student-map').innerHTML='<span class="muted">Select a result to highlight their location.</span>';$('#map-detail').textContent='Locations are staff-reported, not live GPS.';});
$('#map-results').addEventListener('click',e=>{const b=e.target.closest('[data-student]');if(!b)return;const s=students.find(x=>x.name===b.dataset.student);$('#map-search').value=s.name;$('#student-map').innerHTML=`<div class="map-building one">Classrooms</div><div class="map-building two">Library</div><div class="map-building three">Gym</div><div class="kd-location"><span class="kd-avatar">${initials(s.name)}</span><strong>${s.name}</strong><span>${s.place}</span></div>`;$('#map-detail').textContent=`${s.name} · ${s.place} · With ${s.teacher}. Staff update: just now (demo).`;$('#map-results').innerHTML='<span class="kd-chip success">1 student selected</span>';});
$('#clear-map').addEventListener('click',()=>{$('#map-search').value='';$('#map-search').dispatchEvent(new Event('input'));$('#map-search').focus();});showMapResults();

// Breakpoint preview mirrors the downloadable responsive.css.
function updateViewport(width){width=Number(width);$('#viewport-width').value=String(width);$('#viewport-output').textContent=width+' px';const cols=width>=1200?12:width>=768?8:4;const margin=width<=360?16:width>=768?32:24;const gap=width<=360?8:width>=1200?24:width>=768?16:12;
 $('#responsive-canvas').style.width=width+'px';const grid=$('#sim-grid');grid.style.gridTemplateColumns=`repeat(${cols},minmax(0,1fr))`;grid.style.gap=gap+'px';grid.style.paddingInline=margin+'px';grid.innerHTML=Array.from({length:cols},(_,i)=>`<i>${i+1}</i>`).join('');grid.style.maxWidth='1280px';grid.style.marginInline='auto';
 $('#sim-content').style.gridTemplateColumns=`repeat(${width>=1200?3:width>=768?2:1},minmax(0,1fr))`;$('#sim-content').style.paddingInline=margin+'px';$('#breakpoint-result').innerHTML=`${width>=1200?'Desktop':width>=768?'Tablet':'Phone'} · ${cols} columns <small>${margin} px margins · ${gap} px gutters · ${width} px simulated viewport</small>`;
}
$('#viewport-width').addEventListener('input',e=>updateViewport(e.target.value));$$('[data-viewport]').forEach(b=>b.addEventListener('click',()=>updateViewport(b.dataset.viewport)));updateViewport(402);

// CSS examples are extracted from the same stylesheet used by every specimen.
const cssFamilies={brand:['.kd-logo'],colors:[':root'],typography:['.kd-type'],layout:['.kd-screen','.kd-content','.kd-stack','.kd-row'],buttons:['.kd-button','.kd-link','.kd-icon-button','.kd-count','.kd-metrics'],forms:['.kd-field','.kd-label','.kd-input','.kd-textarea','.kd-select','.kd-help','.kd-error','.kd-search','.kd-choice'],menus:['.kd-menu','.kd-nav'],dialogs:['.kd-dialog','.kd-sheet'],lists:['.kd-list','.kd-attention','.kd-avatar','.kd-chip','.kd-table','.kd-empty'],icons:['.kd-icon'],patterns:['.kd-progress','.kd-notice'],pickup:['.kd-scanner','.kd-scan-window','.kd-identity'],parent:['.kd-pass','.kd-progress'],map:['.kd-map'],messages:['.kd-message','.kd-summary']};
Promise.resolve([window.KIDDASH_RESOURCES.css,window.KIDDASH_RESOURCES.responsive]).then(([css,responsive])=>{
 const rules=css.match(/[^{}]+\{[^{}]*\}/g)||[];
 $$('[data-css]').forEach(host=>{const key=host.dataset.css;const code=key==='responsive'?responsive:rules.filter(rule=>(cssFamilies[key]||[]).some(selector=>rule.trim().startsWith(selector)||rule.split('{')[0].includes(selector))).join('\n\n');const section=document.createElement('section');section.className='section';section.innerHTML=`<h2>${key==='responsive'?'responsive.css':'Component CSS'}</h2><p class="component-note">${key==='responsive'?'Complete media-query file, ready to download.':'These rules come from the shared kiddash.css used on this page. Include its root tokens and base styles when reusing components.'}</p><div class="code-panel"><div class="code-head"><span>${key==='responsive'?'responsive.css':'kiddash.css'}</span><button class="copy-code">Copy CSS</button></div><pre><code></code></pre></div>`;$('code',section).textContent=code;$('.copy-code',section).addEventListener('click',e=>copy(code,e.currentTarget));host.append(section);});
}).catch(()=>{$$('[data-css]').forEach(host=>{host.innerHTML='<p>CSS reference unavailable. <a href="kiddash.css" download>Download the full CSS</a>.</p>';});});
// Standalone exports embed their downloadable resources as Blob URLs.
if(window.KIDDASH_DOWNLOADS){
 $$('a[href]').forEach(a=>{const name=a.getAttribute('href'),item=window.KIDDASH_DOWNLOADS[name];if(!item)return;const bytes=Uint8Array.from(atob(item.data),c=>c.charCodeAt(0));a.href=URL.createObjectURL(new Blob([bytes],{type:item.type}));if(name==='overview.html'){a.download=name;a.removeAttribute('target');a.textContent='Download one-pager';}});
}
