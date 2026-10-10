import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--remote-debugging-port=9224']});
try {
  const result=await lighthouse(process.env.BASE_URL || 'http://127.0.0.1:4174/',{port:9224,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
  await writeFile('test-results/lighthouse-mobile.json',result.report);
  console.log(JSON.stringify({scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(key=>[key,result.lhr.audits[key].displayValue]))},null,2));
} finally { await browser.close(); }
