import {agentSaleVisuals} from './agents-sales-visuals.js';
// Curated summaries accompany the complete sourced answers.
// Sprite panels run left-to-right: top row, then bottom row.
const visuals = [
  {
    question: 'Why is rent versus mortgage repayment an unfair comparison?',
    kind: 'compare', sprite: 'answer-repayment-specific',
    copy: {
      en: {title:'More than a repayment',items:[['The mortgage','Principal reduces debt. Interest is a cost.'],['Other bills','Rates, insurance, upkeep.']],note:'Add applicable shared levies or ground rent, plus buying and selling costs.'},
      'pt-BR': {title:'Além da prestação',items:[['O financiamento','Amortização reduz a dívida. Juros são um custo.'],['Outras contas','Taxas municipais, seguro e manutenção.']],note:'Inclua taxas coletivas ou aluguel do terreno, quando houver, e custos de compra e venda.'},
      es: {title:'Más que la cuota',items:[['La hipoteca','El capital reduce la deuda. Los intereses son un costo.'],['Otros gastos','Tasas municipales, seguro y mantenimiento.']],note:'Añade cuotas comunes o alquiler del terreno cuando correspondan, y gastos de compra y venta.'},
      'zh-Hans': {title:'不只是房贷月供',items:[['房贷','还本金会减少欠款；利息是成本。'],['其他账单','地税、保险和维护。']],note:'如适用，还要加上共用费用或地租，以及买卖房屋的费用。'},
    },
  },
  {
    question: 'Is renting really “dead money”?',
    kind: 'compare', images: ['answer-renting', 'answer-ownership-costs'],
    copy: {
      en: {title:'Two ways to have a home',items:[['Renting','A place to live. Flexibility to move.'],['Owning','Principal reduces debt. Interest, rates, insurance and upkeep are costs.']],note:'Also allow for buying/selling costs and any shared levies or ground rent. Compare your plans and savings too.'},
      'pt-BR': {title:'Dois caminhos para morar',items:[['Alugar','Um lugar para morar. Flexibilidade para mudar.'],['Comprar','Amortização reduz a dívida. Juros, taxas municipais, seguro e manutenção são custos.']],note:'Inclua custos de compra e venda e, quando houver, taxas coletivas ou aluguel do terreno. Compare também seus planos e economias.'},
      es: {title:'Dos formas de tener un hogar',items:[['Alquilar','Un lugar donde vivir. Flexibilidad para mudarte.'],['Comprar','El capital reduce la deuda. Intereses, tasas municipales, seguro y mantenimiento son gastos.']],note:'Incluye gastos de compra y venta y, si corresponden, cuotas comunes o alquiler del terreno. Compara también tus planes y ahorros.'},
      'zh-Hans': {title:'两种安家的方式',items:[['租房','有地方住，也方便搬家。'],['买房','还本金减少欠款；利息、地税、保险和维护是成本。']],note:'还要考虑买卖费用，以及适用的共用费用或地租。也要比较未来计划和积蓄用途。'},
    },
  },
  {
    question: 'Are the bank deposit and sales deposit two separate costs?',
    kind: 'compare', sprite: 'answer-deposit-specific',
    copy: {
      en: {title:'One price, paid in stages',items:[['The whole price','Your contribution plus the loan.'],['Sales deposit','Part of that price, paid earlier.']],note:'Not an extra cost. Confirm amount, timing and funding with your lawyer.'},
      'pt-BR': {title:'Um preço, pago em etapas',items:[['O preço total','Sua contribuição mais o financiamento.'],['Sinal do contrato','Parte desse preço, paga antes.']],note:'Não é um custo extra. Confirme valor, prazo e origem do dinheiro com seu advogado.'},
      es: {title:'Un precio, pagado por etapas',items:[['El precio total','Tu aporte más la hipoteca.'],['Señal del contrato','Parte de ese precio, pagada antes.']],note:'No es un costo adicional. Confirma importe, plazo y origen del dinero con tu abogado.'},
      'zh-Hans': {title:'同一笔房价，分阶段支付',items:[['总房价','自有资金加上房贷。'],['合同预付款','提前支付的部分房价。']],note:'不是额外费用。请律师确认金额、时间和资金来源。'},
    },
  },
  {
    question: 'What does pre-approval actually approve?',
    kind: 'sequence', sprite: 'answer-preapproval-specific',
    copy: {
      en: {title:'Pre-approval is a start',items:[['Your finances','Conditional approval. It expires.'],['Your chosen property','The bank checks the home and final loan.'],['Finance confirmed','Before unconditional commitment or an auction bid.']],note:'Ask the lender what remains outstanding.'},
      'pt-BR': {title:'Pré-aprovação é o começo',items:[['Suas finanças','Aprovação condicional, com prazo de validade.'],['O imóvel escolhido','O banco analisa o imóvel e o financiamento final.'],['Crédito confirmado','Antes do compromisso incondicional ou de dar lances.']],note:'Pergunte ao banco o que ainda falta.'},
      es: {title:'La preaprobación es el comienzo',items:[['Tus finanzas','Aprobación condicional, con fecha de vencimiento.'],['La vivienda elegida','El banco revisa la propiedad y el préstamo definitivo.'],['Financiación confirmada','Antes del compromiso incondicional o de pujar en subasta.']],note:'Pregunta al banco qué sigue pendiente.'},
      'zh-Hans': {title:'预批只是开始',items:[['你的财务状况','有条件的批准，也有有效期。'],['选定的房产','银行还要审核房产和最终贷款。'],['确认贷款','无条件承诺购买或拍卖出价之前。']],note:'问清贷款机构还有哪些事项待完成。'},
    },
  },
  {
    question: 'Where do I start, and what order do I do things in?',
    kind: 'sequence', sprite: 'answer-journey-specific',
    copy: {
      en: {title:'From plans to keys',items:[['Set your limits','Needs, budget, lender or adviser, lawyer.'],['Shortlist homes','Choose properties and plan their checks.'],['Review before signing','Your lawyer reviews the offer and conditions.'],['Before unconditional','Confirm checks, finance and insurance; then prepare settlement.']],note:'At auction, complete checks before bidding. Revisit earlier steps when needed.'},
      'pt-BR': {title:'Dos planos às chaves',items:[['Defina seus limites','Necessidades, orçamento, banco ou assessor e advogado.'],['Selecione imóveis','Escolha opções e planeje as verificações.'],['Revise antes de assinar','Seu advogado revisa a proposta e as condições.'],['Antes de a compra se tornar incondicional','Confirme verificações, crédito e seguro; depois, prepare a conclusão.']],note:'Em leilões, conclua as verificações antes dos lances. Volte a etapas anteriores quando precisar.'},
      es: {title:'De los planes a las llaves',items:[['Define tus límites','Necesidades, presupuesto, banco o asesor y abogado.'],['Selecciona viviendas','Elige opciones y planifica las comprobaciones.'],['Revisa antes de firmar','Tu abogado revisa la oferta y las condiciones.'],['Antes del compromiso incondicional','Confirma revisiones, financiación y seguro; después, prepara el cierre.']],note:'En subasta, completa las comprobaciones antes de pujar. Vuelve a pasos anteriores cuando lo necesites.'},
      'zh-Hans': {title:'从规划到拿钥匙',items:[['定好需求和预算','需求、预算、贷款机构或顾问，以及律师。'],['筛选房源','选出房产，安排检查。'],['签字前审阅','请律师审查报价和附带条件。'],['无条件购买之前','确认检查、贷款和保险，再准备交割。']],note:'参加拍卖，要在出价前完成检查。需要时回头调整前面的步骤。'},
    },
  },
  {
    question: 'Do I need a LIM as well as a building inspection?',
    kind: 'compare', sprite: 'answer-records-specific',
    copy: {
      en: {title:'Condition versus records',items:[['Building inspection','Condition, scope and areas not checked.'],['LIM, title + property file','Council information, ownership, plans and consents.']],note:'None guarantees a defect-free home. Ask your lawyer and inspector what is needed.'},
      'pt-BR': {title:'Estado do imóvel e registros',items:[['Inspeção do imóvel','Estado, escopo e áreas não verificadas.'],['LIM, título e arquivo do imóvel','Informações municipais, propriedade, plantas e autorizações.']],note:'Nenhum garante uma casa sem defeitos. Pergunte ao advogado e ao inspetor o que é necessário.'},
      es: {title:'Estado de la casa y registros',items:[['Inspección del edificio','Estado, alcance y zonas no revisadas.'],['LIM, título y expediente','Información municipal, propiedad, planos y permisos.']],note:'Ninguno garantiza una casa sin defectos. Pregunta a tu abogado e inspector qué necesitas.'},
      'zh-Hans': {title:'房屋状况与相关记录',items:[['验房','房屋状况、检查范围及未检查区域。'],['LIM、产权记录和房产档案','地方政府信息、所有权、图纸及审批记录。']],note:'任何一项都不能保证房屋没有缺陷。请律师和验房师判断需要什么。'},
    },
  },
  {
    question: 'Can I rely on the seller’s building report?',
    kind: 'compare', sprite: 'answer-reliance-specific',
    copy: {
      en: {title:'Whose report? Which limits?',items:[['Seller’s report','Check who ordered it, its date and exclusions.'],['Your own inspection','Ask your own questions about the property.']],note:'Ask your lawyer about legal reliance. Any inspection may exclude inaccessible areas or specialist systems.'},
      'pt-BR': {title:'Relatório de quem? Com quais limites?',items:[['Relatório do vendedor','Confira quem contratou, a data e as exclusões.'],['Sua própria inspeção','Faça suas próprias perguntas sobre o imóvel.']],note:'Pergunte ao advogado se pode se apoiar juridicamente no relatório. Qualquer inspeção pode excluir áreas inacessíveis ou sistemas especializados.'},
      es: {title:'¿Informe de quién? ¿Con qué límites?',items:[['Informe del vendedor','Revisa quién lo encargó, la fecha y las exclusiones.'],['Tu propia inspección','Haz tus propias preguntas sobre la vivienda.']],note:'Consulta al abogado si puedes apoyarte legalmente en el informe. Cualquier inspección puede excluir zonas inaccesibles o sistemas especializados.'},
      'zh-Hans': {title:'谁委托的报告？有哪些限制？',items:[['卖方的报告','查清委托人、日期和排除项目。'],['自己委托验房','针对这套房产提出自己的问题。']],note:'请律师确认法律上能否依赖该报告。任何验房都可能不包括无法进入的区域或专业系统。'},
    },
  },
  {
    question: 'What stays with the house: curtains, appliances and other chattels?',
    kind: 'sequence', sprite: 'answer-chattels-specific',
    copy: {
      en: {title:'Seeing it doesn’t mean it stays.',items:[['Ask what stays','Curtains, blinds, appliances and other items.'],['Write the list','Lawyer checks before signing: models and agreed condition.'],['Check before settlement','Match the agreement; report changes to your lawyer.']]},
      'pt-BR': {title:'Ver na visita não significa que fica.',items:[['Pergunte o que fica','Cortinas, persianas, eletrodomésticos e outros itens.'],['Registre a lista','O advogado confere antes da assinatura: modelos e estado combinado.'],['Confira antes da conclusão','Compare com o contrato; avise ao advogado sobre diferenças.']]},
      es: {title:'Verlo no significa que esté incluido.',items:[['Pregunta qué se queda','Cortinas, persianas, electrodomésticos y otros bienes.'],['Deja la lista por escrito','El abogado revisa antes de firmar: modelos y estado acordado.'],['Revisa antes del cierre','Compara con el contrato; avisa al abogado de cualquier cambio.']]},
      'zh-Hans': {title:'看到了，不代表包含在买卖中。',items:[['问清哪些留下','窗帘、百叶帘、家电和其他物品。'],['写下清单','签字前请律师核对型号和约定状态。'],['交割前检查','对照合同，有变化就告诉律师。']]},
    },
  },
  {
    question: 'What if settlement is delayed and I cannot get the keys?',
    kind: 'sequence', sprite: 'answer-delay-specific',
    copy: {
      en: {title:'Delayed? Start with your lawyer.',items:[['Call your lawyer','Confirm the cause, rights and arrangements.'],['Keep plans flexible','Movers, storage, accommodation and insurance.'],['Wait for confirmation','Collect keys once settlement is complete, as arranged.']],note:'Do not assume a right to move in, cancel or receive compensation.'},
      'pt-BR': {title:'Atrasou? Comece pelo advogado.',items:[['Ligue para seu advogado','Confirme a causa, seus direitos e as providências combinadas.'],['Mantenha planos flexíveis','Mudança, armazenamento, hospedagem e seguro.'],['Espere a confirmação','Retire as chaves após a conclusão, conforme combinado.']],note:'Não presuma que pode entrar no imóvel, cancelar ou receber compensação.'},
      es: {title:'¿Retraso? Empieza por tu abogado.',items:[['Llama a tu abogado','Confirma la causa, tus derechos y los acuerdos.'],['Mantén planes flexibles','Mudanza, almacenamiento, alojamiento y seguro.'],['Espera la confirmación','Recoge las llaves tras completarse el cierre, según lo acordado.']],note:'No supongas que puedes entrar, cancelar o recibir una compensación.'},
      'zh-Hans': {title:'交割延迟？先找律师。',items:[['联系律师','确认原因、权利和相关安排。'],['保留调整余地','搬家、存放物品、临时住宿和保险。'],['等待确认','交割完成后，再按约定拿钥匙。']],note:'不要假设自己可以入住、取消合同或获得赔偿。'},
    },
  },
];

const lifeVisual = {
  kind: 'compare', sprite: 'answer-life-specific',
  copy: {
    en: {title:'Fit the home around your life',items:[['Your everyday','Work and daily travel need to fit.'],['Your people','Think about family and the space you need.'],['Your next move','Could work or family plans change?']],note:'Write three must-haves.'},
    'pt-BR': {title:'O imóvel precisa caber na sua vida',items:[['Seu dia a dia','O trabalho e o trajeto precisam funcionar.'],['Quem vai morar com você','Pense na família e no espaço necessário.'],['Sua próxima mudança','Seus planos de trabalho ou família podem mudar?']],note:'Anote três necessidades essenciais.'},
    es: {title:'La vivienda debe encajar con tu vida',items:[['Tu día a día','El trabajo y los trayectos deben funcionar.'],['Tu gente','Piensa en la familia y el espacio necesario.'],['Tu próxima mudanza','¿Pueden cambiar tus planes laborales o familiares?']],note:'Anota tres necesidades esenciales.'},
    'zh-Hans': {title:'让房子适合你的生活',items:[['日常安排','工作和每天的通勤要合适。'],['一起生活的人','想想家人和所需的空间。'],['下一次搬家','工作或家庭计划会不会改变？']],note:'写下三项必备条件。'},
  },
};

visuals.push(...agentSaleVisuals);
const byQuestion = new Map(visuals.map(visual => [visual.question, visual]));
function localVisual(visual, language) {
  const copy = visual?.copy[language];
  if (!copy) return null;
  return {
    kind: visual.kind,
    title: copy.title,
    items: copy.items.map(([title, body], index) => ({
      image: visual.sprite || visual.images[index],
      panel: visual.sprite ? index : 0,
      columns: visual.sprite ? 2 : 1,
      rows: visual.sprite ? 2 : 1,
      title, body,
    })),
    ...(copy.note ? {note: copy.note} : {}),
  };
}
export function answerVisual(faq, language = 'en') {
  return localVisual(byQuestion.get(faq.searchQuestion || faq.question), language);
}

const cardQuestions = {
  'agents/roles': 'Who does the real estate agent work for?',
  'sales/process': 'How do negotiation, deadline, tender and auction differ?',
  'decide/compare': 'Is renting really “dead money”?',
  'budget/ongoing': 'Why is rent versus mortgage repayment an unfair comparison?',
  'team/prepare': 'What does pre-approval actually approve?',
  'inspection/scope': 'Can I rely on the seller’s building report?',
  'records/council': 'Do I need a LIM as well as a building inspection?',
  'viewing/questions': 'What stays with the house: curtains, appliances and other chattels?',
  'settlement/inspection': 'What stays with the house: curtains, appliances and other chattels?',
  'settlement/keys': 'What if settlement is delayed and I cannot get the keys?',
};
export function cardVisual(key, language = 'en') {
  if (key === 'decide/life') return localVisual(lifeVisual, language);
  return cardQuestions[key] ? answerVisual({question:cardQuestions[key]},language) : null;
}
