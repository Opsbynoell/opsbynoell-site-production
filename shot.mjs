import { chromium } from 'playwright-core';
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:EXE,args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
const p=await ctx.newPage();
await p.goto('http://localhost:3220/lp/v8',{waitUntil:'networkidle',timeout:30000});
await p.waitForTimeout(2000);
console.log('err?', await p.getByText('We hit a snag').count(), '| reveal init hidden? toggling by scrolling');
const H=await p.evaluate(()=>document.body.scrollHeight); console.log('H',H);
// scroll fully first to trigger reveals, then scroll back and capture
await p.evaluate(()=>scrollTo(0,document.body.scrollHeight)); await p.waitForTimeout(1500);
const n=Math.ceil(H/844);
for(let i=0;i<n;i++){ await p.evaluate(y=>scrollTo(0,y),i*844); await p.waitForTimeout(500); await p.screenshot({path:`/tmp/v8b-${String(i+1).padStart(2,'0')}.png`}); }
console.log('frames',n);
await b.close();
