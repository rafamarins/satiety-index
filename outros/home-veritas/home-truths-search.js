const groups = [
 ['renovat','renovation','renovations','renovated','renovating','alteration','alterations','reforma','reformas','reformado','renovacion','renovaciones','renovado','装修','改建','翻修'],
 ['approval','approvals','consent','consents','permit','permits','aprovacao','autorizacao','licenca','licencas','aprobacion','permiso','permisos','许可','审批'],
 ['damp','moisture','mould','mold','umidade','mofo','humedad','moho','潮湿','霉菌'],
 ['auction','auctions','leilao','subasta','拍卖'],
 ['broker','brokers','adviser','advisor','corretor','asesor','顾问'],
 ['roof','roofing','telhado','techo','屋顶'],
 ['insurance','seguro','seguros','保险'],
 ['deposit','deposits','entrada','entradas','deposito','depositos','首付'],
 ['appliance','appliances','fridge','fridges','refrigerator','refrigerators','geladeira','geladeiras','nevera','neveras','frigorifico','frigorificos','冰箱','eletrodomestico','eletrodomesticos','electrodomestico','electrodomesticos','家电'],
 ['curtain','curtains','cortina','cortinas','窗帘'],
 ['delay','delayed','delays','atraso','atrasado','demora','retraso','retrasado','延迟'],
 ['report','reports','relatorio','relatorios','informe','informes','报告'],
 ['mortgage','mortgages','hipoteca','financiamento','房贷'],
 ['preapproval','preapproved','preaprovacao','preaprobacion','预批'],
 ['salesdeposit','sinal','senal','订金','定金','预付款'],
 ['mortgage','loan','loans','emprestimo','emprestimos','prestamo','prestamos','贷款'],
 ['inspection','inspections','inspecao','inspecoes','inspeccion','inspecciones','验房'],
 ['flood','flooding','inundacao','inundacoes','inundacion','inundaciones','洪水','水灾'],
 ['include','included','includes','incluido','incluida','incluidos','incluidas','incluir','包含'],
 ['pay','paid','payment','payments','paying','pagar','paga','pago','pagos','pagamento','pagamentos','付款','支付'],
 ['key','keys','chave','chaves','llave','llaves','钥匙'],
 ['renovat','reformar','reformada','reformadas','reformados','reformado'],
 ['sale','sales','sell','seller','sellers','selling','venda','vendas','vendedor','vendedores','venta','ventas','出售','售房','卖房','售出'],
 ['lender','lenders','bank','banks','banco','bancos','credor','credores','prestamista','prestamistas','银行','贷款机构'],
 ['agent','agents','agente','agentes','corretor','corretores','中介'],
 ['offer','offers','oferta','ofertas','proposta','propostas','报价'],
 ['multi','multiple','multiples','multipla','multiplas','multiplo','multiplos','多报价'],
 ['tender','tenders','密封投标','投标'],
 ['property','properties','estate','imovel','imoveis','imobiliario','imobiliarios','inmobiliario','inmobiliarios','房产','房地产','房屋','物业'],
];
export const normalizeSearch = value => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\bpre[\s\p{Pd}]*approv(?:als?|ed)\b/gu,'preapproval').replace(/\bpre[\s\p{Pd}]*aprovacao\b/gu,'preaprovacao').replace(/\bpre[\s\p{Pd}]*aprobacion\b/gu,'preaprobacion');
const synonym=new Map(groups.flatMap(g=>g.map(word=>[normalizeSearch(word),g[0]])));
const chineseWords=new Intl.Segmenter('zh',{granularity:'word'});
// Keep domain terms together where the general segmenter splits 首付 / 验房 / 预批.
const chineseTerms=new RegExp(`(${[...synonym.keys()].filter(word=>/\p{Script=Han}/u.test(word)).sort((a,b)=>b.length-a.length).join('|')})`,'gu');
const words=value=>(normalizeSearch(value).match(/[\p{Script=Han}]+|[\p{L}\p{N}]+/gu)||[])
  .flatMap(word=>/\p{Script=Han}/u.test(word)?word.split(chineseTerms).filter(Boolean).flatMap(part=>synonym.has(part)?[part]:[...chineseWords.segment(part)].filter(token=>token.isWordLike).map(token=>token.segment)):[word])
  .map(word=>synonym.get(word)||word);
const stop=new Set(['a','an','the','is','are','do','does','i','my','can','how','what','to','of','for','o','os','as','de','da','como','el','la','los','las','que','mi',
  'e','ou','com','em','no','na','nos','nas','ao','aos','das','dos','pelo','pela','pelos','pelas','um','uma','quando','onde','qual','quais','posso','preciso','quero','antes','depois','contra',
  'y','o','con','en','al','del','un','una','cuando','donde','cual','cuales','puedo','necesito','quiero','despues','para',
  'comprar','compra','entrega','和','与','及','的','吗','我','如何','怎么','什么','需要','可以']);
export function searchScore(query,text){
  const q=normalizeSearch(query).trim(),body=normalizeSearch(text);
  if(!q)return 1;
  const queryWords=words(q),meaningful=queryWords.filter(w=>!stop.has(w));
  const tokens=meaningful.length?meaningful:queryWords,haystack=words(body);
  if(!tokens.length)return 0;
  if(!tokens.every(w=>haystack.includes(w)||(/[\u3400-\u9fff]/.test(w)&&body.includes(w))))return 0;
  return (body.includes(q)?10:1)+tokens.length;
}
export function faqSearchText(faq){
  const question=faq.searchQuestion||faq.question;
  const extra=/home has been renovated/i.test(question)?' roof work roof approval building approvals renovation alterations':
    /building consent and resource consent the same/i.test(question)?' renovation alterations':
    /check flood, landslip or earthquake risks/i.test(question)?' insurance seguro 保险':'';
  return `${faq.question} ${faq.answer} ${faq.searchQuestion||''} ${faq.searchAnswer||''}${extra}`;
}
const priorities={
  records:/LIM|paperwork|renovat|consent|compliance|cross.lease|easement|covenant/i,
  team:/broker|advis|agent|lawyer|paid|commission|lender/i,
  inspection:/inspection|building report|leak|damp|asbestos|roof/i,
  insurance:/insuran|flood|hazard|earthquake|claims/i,
  homes:/title|ownership|cross.lease|unit|body corporate/i,
  neighbourhood:/neighbour|area|school|commute/i,
};
export function orderTopicFAQs(topic,faqs){
  const related=faqs.filter(f=>topic.chapterIds.includes(f.chapter)),pattern=priorities[topic.id];
  if(!pattern)return {focused:related,other:[]};
  return {focused:related.filter(f=>pattern.test(f.searchQuestion||f.question)),other:related.filter(f=>!pattern.test(f.searchQuestion||f.question))};
}
