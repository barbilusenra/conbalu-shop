import { chromium } from '@playwright/test';
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await p.goto('http://127.0.0.1:5173/');
console.log(await p.evaluate(()=>[...document.querySelectorAll('main>*,.site-header,.site-footer')].map(el=>{el.style.display='none';const w=document.documentElement.scrollWidth;el.style.display='';return {class:el.className,withoutWidth:w,own:el.scrollWidth};})));
console.log(await p.evaluate(()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const out=[];while(w.nextNode()){const n=w.currentNode;if(!n.textContent.trim())continue;const r=document.createRange();r.selectNode(n);const box=r.getBoundingClientRect();if(box.right>innerWidth+1&&box.width>0)out.push({text:n.textContent.slice(0,40),right:box.right,parent:n.parentElement.className});}return out;}));
await b.close();
