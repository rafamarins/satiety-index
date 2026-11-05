// Added 26 October 2026. Source URLs are shared by the short and detailed layers.
export const agentSaleLinks = {
  agents: {label:'Settled · agents and private sales',url:'https://www.settled.govt.nz/buying-a-home/finding-a-property/buying-with-an-agent-or-privately/'},
  conjunctional: {label:'REA · conjunctional agreements',url:'https://www.rea.govt.nz/glossary/'},
  privateBuyer: {label:'Settled · buying from a private seller',url:'https://www.settled.govt.nz/blog/buying-from-a-private-seller/'},
  buyerAgent: {label:'REA · buyer’s agents',url:'https://www.rea.govt.nz/real-estate-professionals/industry-guidance-and-information/buyers-agent-information/'},
  register: {label:'REA · check an agent’s licence',url:'https://publicregister.rea.govt.nz/'},
  conduct: {label:'REA · conduct and client care rules',url:'https://www.settled.govt.nz/assets/Uploads/Resources/Guides/Code-of-conduct.pdf'},
  negotiation: {label:'Settled · negotiation and price guides',url:'https://www.settled.govt.nz/buying-a-home/making-an-offer/buying-by-negotiation/'},
  deadline: {label:'Settled · deadline sales',url:'https://www.settled.govt.nz/buying-a-home/making-an-offer/buying-by-deadline/'},
  tender: {label:'Settled · tenders',url:'https://www.settled.govt.nz/buying-a-home/making-an-offer/buying-by-tender/'},
  auction: {label:'Settled · buying at auction',url:'https://www.settled.govt.nz/buying-a-home/making-an-offer/buying-by-auction/'},
  multi: {label:'Settled · multiple offers',url:'https://www.settled.govt.nz/buying-a-home/making-an-offer/understanding-a-multi-offer-process/'},
  options: {label:'Settled · property options',url:'https://www.settled.govt.nz/buying-a-home/finding-a-property/considering-your-property-options/'},
  estate: {label:'Settled · estates and trusts',url:'https://www.settled.govt.nz/selling-a-home/thinking-of-selling/planning-to-sell/'},
};
const card=(id,label,title,body,checks,gotcha)=>({id,label,title,body,checks,gotcha});
export const additionalTopics=[
 {id:'agents',stage:'find',label:'Real estate agents',headline:'Who is working\nfor whom?',intro:'Find out who the agent represents, what they must tell you and when to get your own advice.',image:'broker',chapterIds:['agents'],cards:[
  card('roles','Who they represent','Ask who the agent represents.','The listing agent represents the seller. A buyer’s agent you hire represents you under a separate written agreement. Ask who the agent represents and who pays them.',['Ask who the agent represents','Ask who pays the agent','Check any agreement before signing'],'In a conjunctional sale, two agencies may share the seller’s commission. The agent who introduces you to the home can still be working for the seller.'),
  card('disclosures','Questions and evidence','Ask for disclosures and records.','Ask about defects, repairs, consents, hazards and included items. Agents must deal fairly and disclose relevant problems; still arrange your own checks.',['Request disclosures in writing','Check documents independently','Record important promises in the contract'],'Check the agent’s answers with your own inspector and lawyer.'),
  card('your-agent','Your own agent','Know what you are hiring.','Before hiring a buyer’s agent, check their licence, services, fees, conflicts and authority to negotiate or bid. Have your lawyer review the agreement.',['Check the REA public register','Agree fees and services in writing','Set approval and bidding limits'],'An agent introducing you to another agency’s listing may still be working for the seller.'),
 ],sourceLinks:[agentSaleLinks.agents,agentSaleLinks.conjunctional,agentSaleLinks.buyerAgent,agentSaleLinks.register,agentSaleLinks.conduct],bridge:'When a home interests you, find out how this particular sale works.'},
 {id:'sales',stage:'buy',label:'Ways to buy',headline:'How is the\nhome being sold?',intro:'First check who is selling. Then check the process, dates and conditions.',image:'contract',chapterIds:['sales'],cards:[
  card('process','Sale processes','Which process is this?','Negotiation, deadline, tender and auction change when you offer and what must be checked first. Get the exact rules for this property.',['Confirm the sale method and dates','Ask whether it can sell earlier','Ask your lawyer about conditions'],'At auction, complete your checks and confirm finance and insurance before bidding.'),
  card('competition','Price and competition','A price guide is not a promise.','An asking price, BEO or “offers over” is a guide, not acceptance of your offer. Multiple written offers can create a multi-offer process.',['Use property evidence and your budget','Ask how competing offers are handled','Confirm your offer’s expiry'],'You may not get another chance to improve an offer. Keep the protections you need.'),
  {...card('private','Private sale','Buying directly from the owner','If you find a home through a Facebook group, a sign or word of mouth, you can arrange a viewing and talk price with the owner. Check recent comparable sales and involve your own lawyer before you make an offer.',[
    'Ask the owner what price they have in mind, what’s included, what problems they know about and whether they can share the LIM, title or any reports.',
    'Ask your lawyer to confirm who can sell and review the title and council records. Get an independent inspection and check finance and insurance for this address.',
    'Have your lawyer prepare or review the written offer, conditions and deadlines. Ask them how and when to pay the deposit into a trust account.',
  ],'REA’s agent complaints process does not cover a private, unlicensed seller.'),message:'Hi, I’m interested in the home you’re selling. Could I arrange a viewing? What price are you looking for, and what’s included? If you have a LIM, title or building report, could you send those through? Are there any known issues, past flooding or repairs I should know about? Thanks!'},
  card('special','Mortgagee and estate sales','Check who has authority to sell.','A lender selling under a mortgage or a person selling for an estate or trust can mean different checks and contract terms. Bring your lawyer in early.',['Confirm who has authority to sell','Check possession, inclusions and warranties','Have deposit arrangements checked'],'A mortgagee sale is not automatically a bargain.'),
 ],sourceLinks:[agentSaleLinks.negotiation,agentSaleLinks.deadline,agentSaleLinks.tender,agentSaleLinks.auction,agentSaleLinks.multi,agentSaleLinks.privateBuyer,agentSaleLinks.agents,agentSaleLinks.options,agentSaleLinks.estate],bridge:'Now ask your lawyer to turn your offer and protections into the right agreement.'},
];
