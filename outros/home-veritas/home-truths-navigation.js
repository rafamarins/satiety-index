import { topics } from './home-truths-content.js';

export const areas = [
  {id:'begin',label:'Starting out',title:'Is buying right for me?',description:'Your plans. Renting or buying. Buying together.',image:'decide',topics:['decide'],tone:'cream'},
  {id:'money',label:'Money & people',title:'What can I afford?',description:'Deposit, KiwiSaver, banks, brokers and loans.',image:'costs',topics:['budget','deposit','team','mortgage'],tone:'blue'},
  {id:'find',label:'Finding a home',title:'Where would I feel at home?',description:'Neighbourhoods, home types, agents and visits.',image:'neighbourhood',topics:['neighbourhood','homes','agents','viewing'],tone:'cream'},
  {id:'checks',label:'Checking a property',title:'What am I really buying?',description:'Inspections, records, hazards and insurance.',image:'inspection',topics:['inspection','records','insurance'],tone:'cream'},
  {id:'buy',label:'Making it happen',title:'How do I get the keys?',description:'Sale methods, offers, contracts and settlement.',image:'contract',topics:['sales','offer','settlement'],tone:'yellow'},
  {id:'own',label:'Life as an owner',title:'What happens after moving in?',description:'Maintenance, renovations and staying on top of things.',image:'own',topics:['living','renovate'],tone:'cream'},
];
export const areaForTopic = id => areas.find(a=>a.topics.includes(id));
export const topicRoute = (topic,card) => `#/${topic.id}${card?'/'+card.id:''}`;
export const areaRoute = area => `#/explore/${area.id}`;
export function resolveRoute(hash) {
  let parts;
  try { parts=decodeURIComponent(hash).replace(/^#\/?/,'').split('/'); } catch { parts=[]; }
  if(parts[0]==='explore'){
    const area=areas.find(a=>a.id===parts[1]);
    if(area)return {kind:'area',area,canonical:areaRoute(area)};
  }
  const aliases={search:'neighbourhood',inspect:'inspection'};
  const topic=topics.find(t=>t.id===(aliases[parts[0]]||parts[0]));
  if(topic){const card=topic.cards.find(c=>c.id===parts[1]);return {kind:'topic',topic,card,area:areaForTopic(topic.id),canonical:topicRoute(topic,card)};}
  return {kind:'home',canonical:'#/'};
}
