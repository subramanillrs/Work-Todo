(function(){
'use strict';
var KEY='bankingTodoNotesV3';
var notes=[];
function $(id){return document.getElementById(id);}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
function load(){try{notes=JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){notes=[];}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(notes));}catch(e){alert('Storage is full. Remove some large images.');}render();}
function openModal(){$('modal').classList.add('show');$('title').focus();}
function closeModal(){$('modal').classList.remove('show');$('title').value='';$('details').value='';$('due').value='';$('images').value='';$('preview').innerHTML='';}
function readImages(files){return Promise.all(Array.from(files).map(function(f){return new Promise(function(resolve,reject){var r=new FileReader();r.onload=function(){resolve({name:f.name,data:r.result});};r.onerror=reject;r.readAsDataURL(f);});}));}
function addNote(){
 var title=$('title').value.trim(); if(!title){alert('Please enter a title.');return;}
 readImages($('images').files).then(function(imgs){
  notes.push({id:Date.now(),title:title,details:$('details').value.trim(),priority:$('priority').value,category:$('category').value,due:$('due').value,images:imgs,done:false});
  persist();closeModal();
 }).catch(function(){alert('Could not read the selected image.');});
}
function toggle(id){var n=notes.find(function(x){return x.id===id;});if(n){n.done=!n.done;persist();}}
function removeNote(id){if(confirm('Delete this note?')){notes=notes.filter(function(x){return x.id!==id;});persist();}}
window.toggleNote=toggle;window.removeNote=removeNote;
function card(n){
 var s='<div class="note '+(n.done?'done':'')+'"><div class="note-row">';
 s+='<input class="check" type="checkbox" '+(n.done?'checked':'')+' onchange="toggleNote('+n.id+')">';
 s+='<div class="note-title">'+esc(n.title)+'</div><button class="delete" type="button" onclick="removeNote('+n.id+')">Delete</button></div>';
 if(n.details)s+='<div class="meta">'+esc(n.details).replace(/\n/g,'<br>')+'</div>';
 if(n.due)s+='<div class="meta">Due: '+new Date(n.due+'T00:00:00').toLocaleDateString()+'</div>';
 if(n.images&&n.images.length){s+='<div class="note-imgs">';n.images.forEach(function(i){s+='<img src="'+i.data+'" alt="">';});s+='</div>';}
 return s+'</div>';
}
function fill(id,list){$(id).innerHTML=list.length?list.map(card).join(''):'<div class="empty">No items yet</div>';}
function render(){var a=notes.filter(function(n){return !n.done;});fill('high',a.filter(function(n){return n.priority==='high';}));fill('medium',a.filter(function(n){return n.priority==='medium';}));fill('low',a.filter(function(n){return n.priority==='low';}));fill('today',a.filter(function(n){return n.category==='today';}));fill('general',a.filter(function(n){return n.category==='general';}));fill('reminders',a.filter(function(n){return n.category==='reminders';}));fill('followup',a.filter(function(n){return n.category==='followup';}));fill('completed',notes.filter(function(n){return n.done;}));}
document.addEventListener('DOMContentLoaded',function(){
 load();render();
 $('addTop').addEventListener('click',openModal);$('addFab').addEventListener('click',openModal);
 $('cancel').addEventListener('click',closeModal);$('save').addEventListener('click',addNote);
 $('modal').addEventListener('click',function(e){if(e.target===$('modal'))closeModal();});
 $('images').addEventListener('change',function(){$('preview').innerHTML='';Array.from(this.files).forEach(function(f){var im=document.createElement('img');im.src=URL.createObjectURL(f);$('preview').appendChild(im);});});
});
})();