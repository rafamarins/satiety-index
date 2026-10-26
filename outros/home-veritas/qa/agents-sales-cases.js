const questions=[
 'Who does the real estate agent work for?',
 'Is an agent who shows me homes my buyer’s agent?',
 'How do I buy directly from a private owner?',
 'What extra risks come with a mortgagee sale?',
 'What should I check before submitting a tender?',
 'Can a deadline or tender property sell before the closing date?',
 'What is a multi-offer process, and can I improve my offer later?',
];
const queries={
 en:['selling agent','buyer agent','private owner','mortgagee sale','tender deposit','deadline sale','multiple offers'],
 'pt-BR':['corretor imobiliário','corretor comprador','venda particular','venda pelo banco','tender sinal','deadline venda','múltiplas propostas'],
 es:['agente inmobiliario','agente comprador','venta particular','venta banco','tender señal','deadline venta','ofertas múltiples'],
 'zh-Hans':['房产中介','买方中介','私人业主','银行卖房','投标预付款','deadline','多报价'],
};
export const agentsSalesSearchCases=Object.fromEntries(Object.entries(queries).map(([code,qs])=>[code,qs.map((q,i)=>[q,questions[i]])]));
