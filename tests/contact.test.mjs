import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('contact prepares an encoded draft without claiming delivery or clearing input',()=> {
  let onReady,onSubmit,reset=false;
  const fields={contactName:{value:'Test & Name'},contactEmail:{value:'test@example.com'},contactCity:{value:'Osh'},contactMessage:{value:'A question & another line\nThanks'}};
  const status={style:{},scrollIntoView(){}};
  const form={addEventListener(event,fn){onSubmit=fn;},reset(){reset=true;}};
  const window={location:{href:''}};
  const context=vm.createContext({window,document:{addEventListener(event,fn){onReady=fn;},getElementById(id){return id==='pogodaContactForm'?form:id==='formSuccessAlert'?status:fields[id];}},initTheme(){},initMiniWeather(){},initLangSwitcher(){},refreshMiniWeather(){},getCurrentLang(){return 'EN';},TRANSLATIONS:{EN:{}},encodeURIComponent});
  const source=fs.readFileSync(new URL('../src/js/contact.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
  vm.runInContext(source,context);onReady();onSubmit({preventDefault(){}});
  const url=new URL(window.location.href);
  assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,'info.pogoda.kg@gmail.com');
  assert.match(url.searchParams.get('body'),/Test & Name/);
  assert.match(url.searchParams.get('body'),/A question & another line\nThanks/);
  assert.equal(status.style.display,'block');assert.equal(reset,false);
});
