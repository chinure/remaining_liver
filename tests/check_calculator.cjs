const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const code = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
const nodes = new Map();
const frames = [];
function node(id) {
  if (!nodes.has(id)) nodes.set(id, {value:'', textContent:'', className:'', style:{}, classList:{toggle(){},add(){},remove(){}}});
  return nodes.get(id);
}
const sandbox = {
  document: {getElementById:node},
  performance:{now:()=>0},
  requestAnimationFrame:fn=>frames.push(fn),
  window:{}, navigator:{}, setTimeout(){}, console
};
vm.createContext(sandbox);vm.runInContext(code,sandbox);
const fixture = {bw:'70',bh:'170',tlv:'1500',ttv:'200',flv:'600',resected:'900'};
function calculate(values={},mode='known',drain=true) {
  for (const [k,v] of Object.entries({...fixture,...values})) node(k).value=v;
  vm.runInContext(`mode = '${mode}'; calculate();`,sandbox);
  if(drain) {const pending=frames.splice(0); for(const fn of pending)fn(400);}
}
function hidden() {assert.equal(node('res-slvr').textContent,'—');assert.equal(node('interpretation').style.display,'none');}
calculate();assert.notEqual(node('res-slvr').textContent,'—');
for (const values of [{bw:'-70'},{bh:'-170'},{bw:'Infinity'},{ttv:'-1'},{ttv:'1500'},{flv:'1501'},{flv:'1301'},{flv:'0'}]) {calculate(values);hidden();}
for(const values of [{resected:'-1'},{resected:'1500'},{resected:'1501'},{resected:'100'}]) {calculate(values,'resected');hidden();}
calculate({},'resected');assert.notEqual(node('res-slvr').textContent,'—');
calculate({},'known',false);calculate({bw:''},'known',true);hidden();
console.log('PASS: valid modes, 12 invalid-input cases, and stale-animation reset');
