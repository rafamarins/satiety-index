import {agentSaleVisuals} from './agents-sales-visuals.js';
// Curated summaries accompany the complete sourced answers.
// Sprite panels run left-to-right: top row, then bottom row.
const visuals = [
  {
    question: 'Why is rent versus mortgage repayment an unfair comparison?',
    kind: 'compare', sprite: 'answer-repayment-specific',
    copy: {
      en: {title:'More than a repayment',items:[['The mortgage','Principal reduces debt. Interest is a cost.'],['Other bills','Rates, insurance, upkeep.']],note:'Add applicable shared levies or ground rent, plus buying and selling costs.'},
      hi: {"title": "सिर्फ़ किस्त से आगे का खर्च", "items": [["होम लोन", "मूलधन चुकाने से कर्ज़ घटता है। ब्याज एक खर्च है।"], ["दूसरे बिल", "काउंसिल के संपत्ति कर, बीमा और रखरखाव।"]], "note": "जहाँ लागू हों, साझा शुल्क या ज़मीन का किराया जोड़ें। खरीदने और बेचने के खर्च भी गिनें।"},
      ko: {"title": "대출 상환액 외에 드는 돈", "items": [["주택대출", "원금을 갚으면 빚이 줄고, 이자는 비용으로 나갑니다."], ["그 밖의 지출", "지방세, 보험료, 유지보수비가 듭니다."]], "note": "해당된다면 공동 부담금이나 토지 임대료, 주택을 사고팔 때 드는 비용도 더하세요."},
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
      hi: {"title": "रहने के दो तरीके", "items": [["किराये पर रहना", "रहने की जगह मिलती है और ज़रूरत पड़ने पर घर बदलना आसान रहता है।"], ["अपना घर", "मूलधन की अदायगी से कर्ज़ घटता है। ब्याज, संपत्ति कर, बीमा और रखरखाव आपके खर्च हैं।"]], "note": "खरीदने और बेचने के खर्च और लागू साझा शुल्क या ज़मीन का किराया भी जोड़ें। अपनी योजनाओं और बचत पर भी विचार करें।"},
      ko: {"title": "임차와 매입 비교하기", "items": [["빌려 살기", "살 곳을 확보하고 필요할 때 이사하기도 쉽습니다."], ["내 집 마련", "원금을 갚으면 빚이 줄어듭니다. 이자, 지방세, 보험료와 유지보수비는 비용입니다."]], "note": "매매 비용과 해당되는 공동 부담금이나 토지 임대료도 계산하세요. 앞으로의 계획과 저축까지 함께 고려하세요."},
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
      hi: {"title": "एक ही कीमत, कई हिस्सों में भुगतान", "items": [["घर की पूरी कीमत", "आपकी अपनी रकम और लोन का जोड़।"], ["अनुबंध की अग्रिम राशि", "कीमत का वह हिस्सा जो पहले चुकाया जाता है।"]], "note": "यह अतिरिक्त खर्च नहीं है। अपने वकील से रकम, समय और भुगतान के लिए धन की व्यवस्था की पुष्टि करें।"},
      ko: {"title": "하나의 집값을 나누어 냅니다", "items": [["전체 집값", "내가 마련하는 돈과 대출을 더한 금액입니다."], ["매매계약금", "집값의 일부를 먼저 내는 돈입니다."]], "note": "집값에 추가로 내는 비용은 아닙니다. 금액과 납부 시점, 자금 마련 방법을 변호사에게 확인하세요."},
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
      hi: {"title": "पहले से मंज़ूरी मिलना पहला कदम है", "items": [["आपकी आर्थिक स्थिति", "मंज़ूरी शर्तों और समय-सीमा के साथ मिलती है।"], ["आपका चुना हुआ घर", "बैंक घर और अंतिम लोन की जाँच करता है।"], ["लोन की पुष्टि", "बिना शर्त खरीद के लिए बाध्य होने या नीलामी में बोली लगाने से पहले।"]], "note": "ऋणदाता से पूछें कि अभी किन बातों की पुष्टि बाकी है।"},
      ko: {"title": "사전 승인은 시작 단계입니다", "items": [["내 재정 상태", "조건이 붙은 승인으로 유효기간이 있습니다."], ["선택한 집", "은행이 해당 주택과 최종 대출 조건을 심사합니다."], ["대출 확정", "무조건 매입 의무가 생기거나 경매에서 입찰하기 전에 확인하세요."]], "note": "아직 충족해야 할 요건이 무엇인지 대출기관에 물어보세요."},
      'pt-BR': {title:'Pré-aprovação é o começo',items:[['Suas finanças','Aprovação condicional, com prazo de validade.'],['O imóvel escolhido','O banco analisa o imóvel e o financiamento final.'],['Crédito confirmado','Antes do compromisso incondicional ou de dar lances.']],note:'Pergunte ao banco o que ainda falta.'},
      es: {title:'La preaprobación es el comienzo',items:[['Tus finanzas','Aprobación condicional, con fecha de vencimiento.'],['La vivienda elegida','El banco revisa la propiedad y el préstamo definitivo.'],['Financiación confirmada','Antes del compromiso incondicional o de pujar en subasta.']],note:'Pregunta al banco qué sigue pendiente.'},
      'zh-Hans': {title:'预批只是开始',items:[['你的财务状况','有条件的批准，也有有效期。'],['选定的房产','银行还要审核房产和最终贷款。'],['确认贷款','无条件承诺购买或拍卖出价之前。']],note:'问清贷款机构还有哪些事项待完成。'},
    },
  },
  {
    question: 'Where do I start, and what order do I do things in?',
    kind: 'sequence', sprite: 'answer-journey-specific',
    copy: {
      en: {title:'From plans to keys',items:[['Set your limits','Needs, budget, lender or adviser, lawyer.'],['Shortlist homes','Choose properties and plan their checks.'],['Review before signing','Your lawyer reviews the offer and conditions.'],['Before the offer becomes unconditional','Complete your checks and confirm finance and insurance before committing.']],note:'At auction, complete checks before bidding. Revisit earlier steps when needed.'},
      hi: {"title": "योजना बनाने से चाबी पाने तक", "items": [["अपनी सीमाएँ तय करें", "ज़रूरतें, बजट, ऋणदाता या सलाहकार और अपना वकील तय करें।"], ["कुछ घर चुनें", "पसंद के घरों की सूची बनाएँ और जाँच की योजना तैयार करें।"], ["हस्ताक्षर से पहले समीक्षा", "आपका वकील प्रस्ताव और उसकी शर्तें जाँचता है।"], ["प्रस्ताव बिना शर्त होने से पहले", "बाध्य होने से पहले जाँच पूरी करें और लोन व बीमे की पुष्टि करें।"]], "note": "नीलामी में बोली लगाने से पहले जाँच पूरी करें। ज़रूरत हो तो पिछले कदम पर लौटें।"},
      ko: {"title": "계획부터 열쇠를 받기까지", "items": [["기준 정하기", "필요한 조건과 예산을 정하고 대출기관이나 상담사, 변호사를 찾으세요."], ["후보 추리기", "마음에 드는 매물을 추려 필요한 점검을 계획하세요."], ["서명 전 검토", "변호사가 매수 제안과 조건을 검토합니다."], ["제안이 무조건부가 되기 전", "매입 의무가 확정되기 전에 점검을 마치고 대출과 보험을 확인하세요."]], "note": "경매라면 입찰 전에 점검을 마치세요. 필요하면 앞 단계로 돌아가 계획을 조정하세요."},
      'pt-BR': {title:'Dos planos às chaves',items:[['Defina seus limites','Necessidades, orçamento, banco ou assessor e advogado.'],['Selecione imóveis','Escolha opções e planeje as verificações.'],['Revise antes de assinar','Seu advogado revisa a proposta e as condições.'],['Antes de a compra se tornar incondicional','Conclua as verificações e confirme crédito e seguro antes de assumir o compromisso.']],note:'Em leilões, conclua as verificações antes dos lances. Volte a etapas anteriores quando precisar.'},
      es: {title:'De los planes a las llaves',items:[['Define tus límites','Necesidades, presupuesto, banco o asesor y abogado.'],['Selecciona viviendas','Elige opciones y planifica las comprobaciones.'],['Revisa antes de firmar','Tu abogado revisa la oferta y las condiciones.'],['Antes del compromiso incondicional','Completa las comprobaciones y confirma financiación y seguro antes de comprometerte.']],note:'En subasta, completa las comprobaciones antes de pujar. Vuelve a pasos anteriores cuando lo necesites.'},
      'zh-Hans': {title:'从规划到拿钥匙',items:[['定好需求和预算','需求、预算、贷款机构或顾问，以及律师。'],['筛选房源','选出房产，安排检查。'],['签字前审阅','请律师审查报价和附带条件。'],['无条件购买之前','作出承诺前，完成检查并确认贷款和保险。']],note:'参加拍卖，要在出价前完成检查。需要时回头调整前面的步骤。'},
    },
  },
  {
    question: 'Do I need a LIM as well as a building inspection?',
    kind: 'compare', sprite: 'answer-records-specific',
    copy: {
      en: {title:'What each check tells you',items:[['Building inspection','Condition, scope and areas not checked.'],['LIM, title + property file','Council information, ownership, plans and consents.']],note:'None guarantees a defect-free home. Ask your lawyer and inspector what is needed.'},
      hi: {"title": "किस जाँच से क्या पता चलता है?", "items": [["भवन का निरीक्षण", "घर की हालत, जाँच का दायरा और जिन हिस्सों की जाँच नहीं हो सकी।"], ["LIM, मालिकाना दस्तावेज़ और संपत्ति की फ़ाइल", "काउंसिल की जानकारी, मालिकाना हक, नक्शे और मंज़ूरियाँ।"]], "note": "किसी भी जाँच से घर के पूरी तरह दोषमुक्त होने की गारंटी नहीं मिलती। वकील और निरीक्षक से पूछें कि आपको क्या चाहिए।"},
      ko: {"title": "각각 무엇을 확인할 수 있나요?", "items": [["건물 점검", "건물의 상태, 점검 범위, 살펴보지 못한 부분을 확인합니다."], ["LIM, 소유권 기록, 부동산 기록 파일", "지방의회 정보, 소유권, 도면과 허가 내역을 확인합니다."]], "note": "어떤 점검도 집에 결함이 없다고 보장하지 않습니다. 무엇이 필요한지 변호사와 점검 전문가에게 물어보세요."},
      'pt-BR': {title:'O que cada verificação esclarece',items:[['Inspeção do imóvel','Estado, escopo e áreas não verificadas.'],['LIM, título e arquivo do imóvel','Informações municipais, propriedade, plantas e autorizações.']],note:'Nenhum garante uma casa sem defeitos. Pergunte ao advogado e ao inspetor o que é necessário.'},
      es: {title:'Qué te dice cada comprobación',items:[['Inspección del edificio','Estado, alcance y zonas no revisadas.'],['LIM, título y expediente','Información municipal, propiedad, planos y permisos.']],note:'Ninguno garantiza una casa sin defectos. Pregunta a tu abogado e inspector qué necesitas.'},
      'zh-Hans': {title:'每项检查能告诉你什么',items:[['验房','房屋状况、检查范围及未检查区域。'],['LIM、产权记录和房产档案','地方政府信息、所有权、图纸及审批记录。']],note:'任何一项都不能保证房屋没有缺陷。请律师和验房师判断需要什么。'},
    },
  },
  {
    question: 'Can I rely on the seller’s building report?',
    kind: 'compare', sprite: 'answer-reliance-specific',
    copy: {
      en: {title:'Using the seller’s building report',items:[['Seller’s report','Check who ordered it, its date and exclusions.'],['Your own inspection','Ask your own questions about the property.']],note:'Ask your lawyer whether you can rely on the report. Any inspection may exclude inaccessible areas or specialist systems.'},
      hi: {"title": "विक्रेता की भवन निरीक्षण रिपोर्ट", "items": [["विक्रेता की रिपोर्ट", "देखें कि रिपोर्ट किसने बनवाई, किस तारीख की है और जाँच से क्या बाहर था।"], ["अपनी ओर से निरीक्षण", "घर के बारे में अपने सवाल पूछें।"]], "note": "वकील से पूछें कि क्या आप कानूनी तौर पर रिपोर्ट पर भरोसा कर सकते हैं। किसी भी जाँच में पहुँच से बाहर जगहें या विशेषज्ञ की ज़रूरत वाली प्रणालियाँ छूट सकती हैं।"},
      ko: {"title": "매도인이 받은 건물 점검 보고서", "items": [["매도인의 보고서", "누가 의뢰했는지, 작성일과 제외 항목을 확인하세요."], ["직접 의뢰한 점검", "해당 주택에 대해 궁금한 점을 직접 물어볼 수 있습니다."]], "note": "매도인의 보고서에 법적으로 의존할 수 있는지 변호사와 상의하세요. 어느 점검이든 접근이 어려운 곳이나 전문 설비는 빠질 수 있습니다."},
      'pt-BR': {title:'Usar o relatório do vendedor',items:[['Relatório do vendedor','Confira quem contratou, a data e as exclusões.'],['Sua própria inspeção','Faça suas próprias perguntas sobre o imóvel.']],note:'Pergunte ao advogado se pode se apoiar juridicamente no relatório. Qualquer inspeção pode excluir áreas inacessíveis ou sistemas especializados.'},
      es: {title:'Usar el informe del vendedor',items:[['Informe del vendedor','Revisa quién lo encargó, la fecha y las exclusiones.'],['Tu propia inspección','Haz tus propias preguntas sobre la vivienda.']],note:'Consulta al abogado si puedes apoyarte legalmente en el informe. Cualquier inspección puede excluir zonas inaccesibles o sistemas especializados.'},
      'zh-Hans': {title:'使用卖方的验房报告',items:[['卖方的报告','查清委托人、日期和排除项目。'],['自己委托验房','针对这套房产提出自己的问题。']],note:'请律师确认法律上能否依赖该报告。任何验房都可能不包括无法进入的区域或专业系统。'},
    },
  },
  {
    question: 'What stays with the house: curtains, appliances and other chattels?',
    kind: 'sequence', sprite: 'answer-chattels-specific',
    copy: {
      en: {title:'Seeing it doesn’t mean it stays.',items:[['Ask what stays','Curtains, blinds, appliances and other items.'],['Write the list','Lawyer checks before signing: models and agreed condition.'],['Check before settlement','Match the agreement; report changes to your lawyer.']]},
      hi: {"title": "जो दिखा, क्या वह घर के साथ मिलेगा?", "items": [["पूछें कि क्या रहेगा", "पर्दे, ब्लाइंड, घरेलू उपकरण और बाकी सामान।"], ["लिखित सूची बनाएँ", "हस्ताक्षर से पहले वकील से मॉडल और तय की गई हालत जँचवाएँ।"], ["खरीद पूरी होने से पहले जाँचें", "अनुबंध से मिलान करें और किसी भी अंतर की सूचना वकील को दें।"]]},
      ko: {"title": "집에서 본 물건도 포함 여부를 확인하세요", "items": [["무엇이 남는지 묻기", "커튼, 블라인드, 가전제품 등 어떤 물건이 포함되는지 확인하세요."], ["목록을 서면으로 남기기", "서명 전에 변호사에게 모델과 합의한 상태를 확인받으세요."], ["잔금 결제 전 점검", "계약서와 대조하고 달라진 부분은 변호사에게 알리세요."]]},
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
      hi: {"title": "खरीद पूरी होने में देरी? पहले वकील को फ़ोन करें", "items": [["वकील से बात करें", "वजह, अपने अधिकार और तय इंतज़ाम समझें।"], ["योजना बदलने की गुंजाइश रखें", "सामान ढुलाई, भंडारण, अस्थायी ठिकाना और बीमा।"], ["पुष्टि का इंतज़ार करें", "खरीद पूरी होने पर तय व्यवस्था के अनुसार चाबी लें।"]], "note": "अपने आप यह न मानें कि आपको घर में जाने, अनुबंध रद्द करने या मुआवज़ा पाने का अधिकार है।"},
      ko: {"title": "잔금 결제가 늦어지면 먼저 변호사에게 연락하세요", "items": [["변호사에게 전화하기", "원인과 내 권리, 어떤 조치가 마련됐는지 확인하세요."], ["일정 조정 여지 남기기", "이사 업체, 짐 보관, 임시 숙소와 보험을 확인하세요."], ["완료 확인 기다리기", "잔금 결제가 끝난 뒤 약속한 방식으로 열쇠를 받으세요."]], "note": "입주하거나 계약을 취소하거나 보상을 받을 권리가 자동으로 생긴다고 생각하지 마세요."},
      'pt-BR': {title:'Atrasou? Comece pelo advogado.',items:[['Ligue para seu advogado','Confirme a causa, seus direitos e as providências combinadas.'],['Mantenha planos flexíveis','Mudança, armazenamento, hospedagem e seguro.'],['Espere a confirmação','Retire as chaves após a conclusão, conforme combinado.']],note:'Não presuma que pode entrar no imóvel, cancelar ou receber compensação.'},
      es: {title:'¿Retraso? Empieza por tu abogado.',items:[['Llama a tu abogado','Confirma la causa, tus derechos y los acuerdos.'],['Mantén planes flexibles','Mudanza, almacenamiento, alojamiento y seguro.'],['Espera la confirmación','Recoge las llaves tras completarse el cierre, según lo acordado.']],note:'No supongas que puedes entrar, cancelar o recibir una compensación.'},
      'zh-Hans': {title:'交割延迟？先找律师。',items:[['联系律师','确认原因、权利和相关安排。'],['保留调整余地','搬家、存放物品、临时住宿和保险。'],['等待确认','交割完成后，再按约定拿钥匙。']],note:'不要假设自己可以入住、取消合同或获得赔偿。'},
    },
  },
];

const lifeVisual = {
  kind: 'compare', sprite: 'answer-life-specific',
  copy: {
    en: {title:'Fit the home around your life',items:[['Daily life','Work and daily travel need to fit.'],['Who will live here','Think about family and the space you need.'],['Your next move','Could work or family plans change?']],note:'Write three must-haves.'},
    hi: {"title": "ऐसा घर चुनें जो आपकी ज़िंदगी में फिट हो", "items": [["रोज़मर्रा की ज़िंदगी", "घर से काम और रोज़ की आवाजाही सुविधाजनक होनी चाहिए।"], ["घर में कौन रहेगा?", "परिवार और ज़रूरी जगह के बारे में सोचें।"], ["आगे की योजना", "क्या आपके काम या परिवार से जुड़ी योजनाएँ बदल सकती हैं?"]], "note": "तीन सबसे ज़रूरी बातें लिखें।"},
    ko: {"title": "내 생활에 맞는 집 찾기", "items": [["일상생활", "일하기에 적합하고 매일 오가는 길이 편한지 살펴보세요."], ["함께 살 사람", "가족 구성과 필요한 공간을 생각하세요."], ["앞으로의 변화", "직장이나 가족 계획이 달라질 수 있나요?"]], "note": "꼭 필요한 조건 세 가지를 적어 보세요."},
    'pt-BR': {title:'O imóvel precisa caber na sua vida',items:[['Seu dia a dia','O trabalho e o trajeto precisam funcionar.'],['Quem vai morar com você','Pense na família e no espaço necessário.'],['Sua próxima mudança','Seus planos de trabalho ou família podem mudar?']],note:'Anote três necessidades essenciais.'},
    es: {title:'La vivienda debe encajar con tu vida',items:[['Tu día a día','El trabajo y los trayectos deben funcionar.'],['Quién vivirá aquí','Piensa en la familia y el espacio necesario.'],['Tu próxima mudanza','¿Pueden cambiar tus planes laborales o familiares?']],note:'Anota tres necesidades esenciales.'},
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
