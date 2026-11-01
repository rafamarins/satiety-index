import { monthlyPayment } from './finance.js';

const copy = {
  en: {
    locale:'en-NZ', example:'See an example',
    rateChoice:'Example interest rate', recordsLimit:'Records do not confirm the home’s current physical condition.', inspectionLimit:'An inspection does not confirm council approval.',
    depositTitle:'How do the deposit and loan add up?', price:'Example home price', share:'Your contribution', loan:'Loan needed',
    depositNote:'These are example amounts, not a typical house price. Keep buying costs and emergency savings separate. A smaller deposit still needs lender approval.',
    mortgageTitle:'What would a higher interest rate cost?', mortgageIntro:'The same NZ$560,000 loan, repaid over 30 years.', rate:'At {rate}% interest', monthly:'per month', difference:'That is {amount} more each month.',
    mortgageNote:'Illustrative rates, not current offers. Monthly principal-and-interest payments, with each rate held constant for 30 years. Excludes fees, insurance, rates and other ownership costs.',
    recordsTitle:'What do records and an inspection tell you?', recordsIntro:'They answer different questions about the same home.',
    recordsLabel:'Council records', recordsBody:'Check what approvals and completion documents the council holds for the work.', inspectionLabel:'Building inspection', inspectionBody:'Ask the inspector about the condition of the work they can access, and anything that needs a specialist.',
  },
  'pt-BR': {
    locale:'pt-BR', example:'Veja um exemplo',
    rateChoice:'Juros de exemplo', recordsLimit:'Os documentos não confirmam o estado físico atual do imóvel.', inspectionLimit:'A inspeção não confirma a aprovação do council.',
    depositTitle:'Como a entrada e o empréstimo cobrem o preço?', price:'Preço de exemplo', share:'Sua contribuição', loan:'Empréstimo necessário',
    depositNote:'São valores de exemplo, não o preço típico de um imóvel. Separe os custos da compra e a reserva de emergência. Uma entrada menor também precisa da aprovação do banco.',
    mortgageTitle:'Quanto custaria uma taxa de juros maior?', mortgageIntro:'O mesmo empréstimo de NZ$560.000, pago em 30 anos.', rate:'Com juros de {rate}%', monthly:'por mês', difference:'São {amount} a mais por mês.',
    mortgageNote:'Juros ilustrativos, não ofertas atuais. Parcelas mensais de capital e juros, com cada taxa constante por 30 anos. Não inclui tarifas, seguro, taxas municipais ou outros custos do imóvel.',
    recordsTitle:'O que os documentos e a inspeção mostram?', recordsIntro:'Eles respondem a perguntas diferentes sobre o mesmo imóvel.',
    recordsLabel:'Documentos do council', recordsBody:'Confira quais aprovações e documentos de conclusão o council tem sobre a obra.', inspectionLabel:'Inspeção do imóvel', inspectionBody:'Pergunte ao inspetor sobre o estado do que ele consegue acessar e o que precisa de um especialista.',
  },
  es: {
    locale:'es-NZ', example:'Ver un ejemplo',
    rateChoice:'Interés de ejemplo', recordsLimit:'Los registros no confirman el estado físico actual de la vivienda.', inspectionLimit:'La inspección no confirma la aprobación municipal.',
    depositTitle:'¿Cómo se reparten la entrada y el préstamo?', price:'Precio de ejemplo', share:'Tu aporte', loan:'Préstamo necesario',
    depositNote:'Son cantidades de ejemplo, no el precio habitual de una vivienda. Separa los gastos de compra y el fondo de emergencia. Una entrada menor también necesita la aprobación del banco.',
    mortgageTitle:'¿Cuánto costaría una tasa de interés mayor?', mortgageIntro:'El mismo préstamo de NZ$560.000, pagado en 30 años.', rate:'Con un interés del {rate}%', monthly:'al mes', difference:'Son {amount} más cada mes.',
    mortgageNote:'Tasas ilustrativas, no ofertas actuales. Cuotas mensuales de capital e intereses, con cada tasa constante durante 30 años. No incluye comisiones, seguro, tasas municipales ni otros gastos de la vivienda.',
    recordsTitle:'¿Qué muestran los registros y la inspección?', recordsIntro:'Responden a preguntas distintas sobre la misma vivienda.',
    recordsLabel:'Registros del council', recordsBody:'Revisa qué permisos y documentos de finalización tiene el council sobre la obra.', inspectionLabel:'Inspección de la vivienda', inspectionBody:'Pregunta al inspector por el estado de las partes accesibles y qué necesita revisar un especialista.',
  },
  'zh-Hans': {
    locale:'zh-Hans-NZ', example:'看一个例子',
    rateChoice:'示例利率', recordsLimit:'档案不能确认房屋目前的实际状况。', inspectionLimit:'验房不能确认议会批准情况。',
    depositTitle:'首付和贷款如何凑齐房价？', price:'示例房价', share:'你的出资', loan:'所需贷款',
    depositNote:'这些只是示例金额，不代表典型房价。购房费用和应急储蓄需要另外预留。首付较低仍需贷款机构批准。',
    mortgageTitle:'利率提高后，每月要多付多少？', mortgageIntro:'同一笔 560,000 新西兰元贷款，分 30 年还清。', rate:'利率为 {rate}%', monthly:'每月', difference:'每月多付 {amount}。',
    mortgageNote:'仅为示例利率，并非当前贷款报价。假设按月偿还本金和利息，各利率在 30 年内保持不变。不包括手续费、保险、地方税费及其他持有成本。',
    recordsTitle:'档案和验房分别能告诉你什么？', recordsIntro:'它们回答关于同一栋房屋的不同问题。',
    recordsLabel:'地方议会档案', recordsBody:'查看地方议会保存了哪些工程审批和竣工文件。', inspectionLabel:'房屋检查', inspectionBody:'询问检查员能够进入的区域状况如何，以及哪些问题需要专业人员进一步检查。',
  },
};
const escape = value => String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const content = language => copy[language] || copy.en;
const money = (amount,c) => new Intl.NumberFormat(c.locale,{style:'currency',currency:'NZD',currencyDisplay:'code',maximumFractionDigits:0}).format(amount);
const phrase = (text,values) => text.replace(/\{(\w+)\}/g,(_,key)=>values[key]);

export function depositExample(percent=20) {
  if(!Number.isFinite(percent)||percent<0||percent>100)throw new RangeError('Contribution must be between 0 and 100 percent.');
  const price=700000,contribution=price*percent/100;
  return {price,percent,contribution,loan:price-contribution};
}
export function repaymentExample() {
  const lower=Math.round(monthlyPayment(560000,6,30)),higher=Math.round(monthlyPayment(560000,7,30));
  return {lower,higher,difference:higher-lower};
}
const recordCollage = panel => `<div class="record-collage" style="--panel:${panel}"><img src="assets/home-truths/answer-records-specific.webp" width="1200" height="800" loading="lazy" alt=""></div>`;
const repaymentStatus = (rate,c) => {
  const d=repaymentExample(),payment=rate===6?d.lower:d.higher;
  return `${phrase(c.rate,{rate})}: ${money(payment,c)} ${c.monthly}.${rate===7?' '+phrase(c.difference,{amount:money(d.difference,c)}):''}`;
};
function depositHTML(c){
  const d=depositExample();
  return `<p class="example-price">${escape(c.price)}<strong>${escape(money(d.price,c))}</strong></p><label class="example-choice">${escape(c.share)}<select data-example-deposit><option value="20">20%</option><option value="10">10%</option></select></label><div class="example-split" aria-hidden="true"><span class="example-share-bar" style="width:${d.percent}%"></span></div><dl class="example-values" aria-live="polite" aria-atomic="true"><div><dt>${escape(c.share)}</dt><dd data-example-contribution>${escape(money(d.contribution,c))}</dd></div><div><dt>${escape(c.loan)}</dt><dd data-example-loan>${escape(money(d.loan,c))}</dd></div></dl><p class="example-note">${escape(c.depositNote)}</p>`;
}
function mortgageHTML(c){
  const d=repaymentExample();
  return `<p>${escape(c.mortgageIntro)}</p><div class="rate-controls" role="group" aria-label="${escape(c.rateChoice)}"><span>${escape(c.rateChoice)}</span>${[6,7].map(rate=>`<button type="button" data-example-rate="${rate}" aria-pressed="${rate===6}">${rate}%</button>`).join('')}</div><div class="example-rates">${[[6,d.lower],[7,d.higher]].map(([rate,payment])=>`<div data-active="${rate===6}"><div class="example-rate-label"><span>${escape(phrase(c.rate,{rate}))}</span><strong>${escape(money(payment,c))}<small>${escape(c.monthly)}</small></strong></div><div class="example-rate-track" aria-hidden="true"><span style="width:${payment/d.higher*100}%"></span></div></div>`).join('')}</div><p class="example-status" role="status">${escape(repaymentStatus(6,c))}</p><p class="example-note">${escape(c.mortgageNote)}</p>`;
}
function recordsHTML(c){
  return `<p>${escape(c.recordsIntro)}</p><div class="example-checks">${[[1,c.recordsLabel,c.recordsBody,c.recordsLimit],[0,c.inspectionLabel,c.inspectionBody,c.inspectionLimit]].map(([panel,title,body,limit])=>`<section>${recordCollage(panel)}<h3>${escape(title)}</h3><p>${escape(body)}</p><p class="check-limit">${escape(limit)}</p></section>`).join('')}</div>`;
}
export function updateRepayment(target,language='en'){
  const button=target?.closest?.('[data-example-rate]');
  const root=button?.closest('[data-worked-example="mortgage"]');
  const rate=Number(button?.dataset.exampleRate);
  if(!root||![6,7].includes(rate))return false;
  root.querySelectorAll('[data-example-rate]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  root.querySelectorAll('.example-rates>div').forEach((row,i)=>row.dataset.active=String(i===(rate===6?0:1)));
  root.querySelector('.example-status').textContent=repaymentStatus(rate,content(language));
  return true;
}
export function exampleHTML(topicId,language='en'){
  const c=content(language),render={deposit:depositHTML,mortgage:mortgageHTML,records:recordsHTML}[topicId];
  if(!render)return '';
  return `<details class="worked-example" data-worked-example="${topicId}"><summary><span><small>${escape(c.example)}</small>${escape(c[`${topicId}Title`])}</span></summary><div class="example-body">${render(c)}</div></details>`;
}
export function updateExample(target,language='en'){
  if(!target?.matches?.('[data-example-deposit]'))return false;
  const root=target.closest('[data-worked-example="deposit"]');
  if(!root)return false;
  const percent=Number(target.value);
  if(![10,20].includes(percent))return false;
  const d=depositExample(percent),c=content(language);
  root.querySelector('.example-share-bar').style.width=`${d.percent}%`;
  root.querySelector('[data-example-contribution]').textContent=money(d.contribution,c);
  root.querySelector('[data-example-loan]').textContent=money(d.loan,c);
  return true;
}
