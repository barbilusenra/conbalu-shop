import test from 'node:test';
import assert from 'node:assert/strict';
import { products, cleanCart } from '../src/catalog.js';
import { briefToText, createCheckout } from '../src/integrations.js';
test('catalog keeps the supplied category counts and unique product IDs',()=>{
  assert.equal(products.filter(p=>p.category==='carousel').length,10);
  assert.equal(products.filter(p=>p.category==='portfolio').length,3);
  assert.equal(new Set(products.map(p=>p.id)).size,products.length);
  assert.ok(products.every(p=>['carousel','portfolio','media'].includes(p.category)));
});
test('untrusted or stale bag data cannot introduce products or duplicates',()=>{
  assert.deepEqual(cleanCart(['c1','c1','missing',null,{},'m1']),['c1','m1']);
  assert.deepEqual(cleanCart({id:'c1'}),[]);
});
test('brief export preserves all client information and never claims submission',()=>{
  const text=briefToText({name:'María',email:'m@example.com',product:'Media kit',instagram:'@marca',logo:'Sí',colors:'Rosa',assets:'Fotos',goal:'Marcas',timeline:'Un mes',budget:'USD 200',notes:'Editorial'});
  for(const value of ['María','m@example.com','Media kit','@marca','Sí','Rosa','Fotos','Marcas','Un mes','USD 200','Editorial','No enviado']) assert.ok(text.includes(value));
});
test('pending checkout fails closed instead of simulating a payment',async()=>{
  await assert.rejects(createCheckout(),/No se realizó ningún cobro/);
});
