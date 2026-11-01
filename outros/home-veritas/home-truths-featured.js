// English identities are preserved as searchQuestion in translated references.
const questions = {
  decide:['Where do I start, and what order do I do things in?','Is renting really “dead money”?','Does a residence visa automatically mean I can buy?'],
  budget:['What do I pay before I even get the keys?','Which costs keep coming after I move in?','How do I know if the repayments will be comfortable?'],
  deposit:['Do I need a 20% deposit?','How does a KiwiSaver first-home withdrawal work?','Are the bank deposit and sales deposit two separate costs?'],
  team:['Should I go straight to a bank or use a mortgage broker?','What does a bank want to see?','What does pre-approval actually approve?'],
  mortgage:['What are principal and interest?','Does fixing for two years mean I repay the loan in two years?','Fixed, floating or split: which is best?'],
  neighbourhood:['What should I check about the location?','What should I notice during an open home?','What about septic tanks, tank water, drainage or retaining walls?'],
  homes:['Freehold, leasehold, cross lease, unit title: what changes?','What can make an apartment unexpectedly expensive?','Is a new build or an off-plan home simpler?'],
  agents:['Who does the real estate agent work for?','Is an agent who shows me homes my buyer’s agent?','What must an agent disclose, and what should I still check?'],
  viewing:['What should I notice during an open home?','How do I check whether the home will be warm and dry?','When should I pay for reports and inspections?'],
  inspection:['Can I rely on the seller’s building report?','Do I need a LIM as well as a building inspection?','When should I pay for reports and inspections?'],
  records:['Do I need a LIM as well as a building inspection?','The home has been renovated. What paperwork matters?','What are easements, covenants and shared driveways?'],
  insurance:['Why check insurance before my offer is unconditional?','How do I check flood, landslip or earthquake risks?','What about septic tanks, tank water, drainage or retaining walls?'],
  sales:['How do negotiation, deadline, tender and auction differ?','Does an asking price, BEO, BBO or “offers over” guarantee acceptance?','Can a deadline or tender property sell before the closing date?'],
  offer:['What should be written into the agreement?','Can I walk away from a conditional offer?','What is the big auction gotcha?'],
  settlement:['What happens on settlement day?','What do I check at the pre-settlement inspection?','What if something is broken or missing before settlement?'],
  living:['Which costs keep coming after I move in?','What should I do about maintenance and insurance?','What if repayments become difficult?'],
  renovate:['Can I renovate as soon as I own the place?','Are building consent and resource consent the same?','How do I budget for a renovation?'],
};
export function featuredQuestions(topic,faqs){
  const related=faqs.filter(f=>topic.chapterIds.includes(f.chapter));
  return (questions[topic.id]||[]).map(question=>related.find(f=>(f.searchQuestion||f.question)===question)).filter(Boolean);
}
