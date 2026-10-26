import {additionalTopics} from './agents-sales-content.js';
// Short visual layer; chapterIds connect to the existing detailed guide and FAQs.
export const reviewedOn = '26 October 2026';

export const stages = [
  { id: 'decide', label: 'Decide' },
  { id: 'prepare', label: 'Prepare' },
  { id: 'find', label: 'Find' },
  { id: 'buy', label: 'Buy' },
  { id: 'own', label: 'Own' },
];

const links = {
  finances: { label: 'Settled · finances and costs', url: 'https://www.settled.govt.nz/buying-a-home/thinking-of-buying/thinking-about-your-finances-when-buying/' },
  support: { label: 'NZ Government · first-home help', url: 'https://www.govt.nz/browse/housing-and-property/buying-or-selling-a-home/buying-your-first-home/' },
  kiwisaver: { label: 'Inland Revenue · KiwiSaver withdrawal', url: 'https://www.ird.govt.nz/kiwisaver/kiwisaver-individuals/getting-my-kiwisaver-funds-early/getting-my-kiwisaver-for-my-first-home' },
  eligibility: { label: 'LINZ · who can buy', url: 'https://www.linz.govt.nz/guidance/overseas-investment/buying-residential-property-live' },
  broker: { label: 'FMA · mortgage advice', url: 'https://www.fma.govt.nz/consumer/getting-advice/mortgage-advice/' },
  mortgage: { label: 'Sorted · mortgage types', url: 'https://sorted.org.nz/guides/home-buying/mortgage-types/' },
  approval: { label: 'Settled · confirming finance', url: 'https://www.settled.govt.nz/buying-a-home/making-an-offer/confirming-your-finances/' },
  neighbourhood: { label: 'Settled · neighbourhood checks', url: 'https://www.settled.govt.nz/buying-a-home/researching-the-property/learning-about-the-neighbourhood/' },
  viewing: { label: 'Settled · viewing a home', url: 'https://www.settled.govt.nz/buying-a-home/finding-a-property/viewing-an-open-home/' },
  ownership: { label: 'Settled · types of ownership', url: 'https://www.settled.govt.nz/buying-a-home/finding-a-property/understanding-types-of-ownership/' },
  options: { label: 'Settled · property options', url: 'https://www.settled.govt.nz/buying-a-home/finding-a-property/considering-your-property-options/' },
  homework: { label: 'Settled · property homework', url: 'https://www.settled.govt.nz/buying-a-home/researching-the-property/doing-your-homework/' },
  council: { label: 'MBIE · council records', url: 'https://www.building.govt.nz/getting-started/your-rights-and-obligations/homeowner-rights-and-obligations/buying-a-house/what-can-the-council-tell-you-about-the-house' },
  titles: { label: 'LINZ · land records', url: 'https://lrs.linz.govt.nz/' },
  unit: { label: 'Unit Titles Services · buying a unit', url: 'https://www.unittitles.govt.nz/buying-or-selling-a-unit-title/buying-or-selling-a-unit-title/buying-a-unit-title/' },
  hazards: { label: 'Settled · natural hazards', url: 'https://www.settled.govt.nz/buying-a-home/researching-the-property/understanding-the-impact-of-natural-hazards/' },
  claims: { label: 'NHC · previous claims', url: 'https://www.naturalhazards.govt.nz/insurance-and-claims/claims/buying-or-selling-a-home-with-previous-claims/' },
  contract: { label: 'Settled · the purchase agreement', url: 'https://www.settled.govt.nz/buying-a-home/making-an-offer/understanding-the-sale-and-purchase-agreement-when-buying/' },
  auction: { label: 'Settled · buying at auction', url: 'https://www.settled.govt.nz/buying-a-home/making-an-offer/buying-by-auction/' },
  offer: { label: 'Consumer Protection · preparing an offer', url: 'https://www.consumerprotection.govt.nz/help-product-service/buying-or-renting-a-house/prepare-make-an-offer' },
  settlement: { label: 'Settled · settlement day', url: 'https://www.settled.govt.nz/buying-a-home/settling-and-moving-in/planning-for-settlement-day-when-buying/' },
  fraud: { label: 'Law Society · payment fraud', url: 'https://www.lawsociety.org.nz/news/newsroom/email-fraud-targets-lawyers/' },
  renovation: { label: 'MBIE · renovating a home', url: 'https://www.building.govt.nz/getting-started/stages-of-the-building-process/renovations-differ-to-new-builds' },
  consents: { label: 'MBIE · check consent requirements', url: 'https://www.building.govt.nz/projects-and-consents/planning-a-successful-build/scope-and-design/check-if-you-need-consents' },
  asbestos: { label: 'Health NZ · asbestos', url: 'https://www.healthnz.govt.nz/health-topics/keeping-healthy/healthy-homes-environments/hazardous-substances/asbestos/dealing-with-asbestos' },
  buildingAct: { label: 'Building Act · current legislation', url: 'https://www.legislation.govt.nz/act/public/2004/72/en/latest/' },
};

const card = (id, label, title, body, checks, gotcha) => ({ id, label, title, body, checks, gotcha });

export const topics = [
  {
    id: 'decide', stage: 'decide', label: 'Rent or buy?', headline: 'Your first home.\nYour own pace.',
    intro: 'Start with the life you want. Buying is a choice, not a race.', image: 'decide', chapterIds: ['decide'],
    cards: [
      card('life', 'Your life', 'What needs to fit?', 'Think beyond getting the keys. Your plans for work, family and moving matter just as much as the house.', ['Write three must-haves', 'Think about likely moves', 'Agree who is buying'], 'Someone else’s timeline is not your deadline.'),
      card('compare', 'Rent or buy', 'Compare the whole picture.', 'Rent buys flexibility. Ownership brings control, responsibility and costs. Compare both against your plans, not just this month’s payment.', ['Compare all monthly costs', 'Allow for buying and selling', 'Keep room for surprises'], 'A mortgage payment is not the whole cost of owning.'),
      card('together', 'Buying together', 'Agree before you commit.', 'Different contributions, family help and residency can change the arrangement. Ask your lawyer what applies before you promise anything.', ['Check who can legally buy', 'Record each contribution', 'Agree what happens if plans change'], 'A loan approval does not confirm your legal eligibility to buy.'),
    ], sourceLinks: [links.finances, links.eligibility], bridge: 'Next, see the costs hiding behind the asking price.',
  },
  {
    id: 'budget', stage: 'decide', label: 'The whole cost', headline: 'The price isn’t\nthe whole price.',
    intro: 'Make room for buying costs, everyday bills and the things that break.', image: 'costs', chapterIds: ['budget'],
    cards: [
      card('buying', 'Buying costs', 'Keep a separate buying pot.', 'Legal work, reports, inspections, valuations and moving can cost money before or around settlement. Get quotes for your situation.', ['Ask for legal and report quotes', 'Allow for unsuccessful offers', 'Keep moving money aside'], 'You may pay for checks on a home you do not end up buying.'),
      card('ongoing', 'Everyday bills', 'Add the less obvious bills.', 'Start with repayments, then add rates, insurance and upkeep. Check shared levies, ground rent, water and transport where relevant.', ['Get the actual council rates', 'Ask for an insurance quote', 'Check shared property charges'], 'Council rates and mortgage interest rates are different bills.'),
      card('buffer', 'Your buffer', 'Leave room to breathe.', 'Set your own comfortable limit. Try higher repayments and lower income, and allow for repairs identified by the inspection.', ['Try a tougher month', 'Price major repairs', 'Protect emergency savings'], 'The bank’s maximum is not a spending target.'),
    ], sourceLinks: [links.finances, links.homework], bridge: 'Now separate your deposit from the money you need to keep.',
  },
  {
    id: 'deposit', stage: 'prepare', label: 'Deposit & KiwiSaver', headline: 'Your part.\nThe bank’s part.',
    intro: 'Your deposit and the loan fund the price. Your buying buffer stays separate.', image: 'costs', chapterIds: ['deposit'],
    cards: [
      card('savings', 'Your savings', 'Count confirmed money.', 'List savings and agreed help. A family gift, loan and guarantee create different obligations: tell your lender and lawyer which applies.', ['List available savings', 'Document family help', 'Keep costs outside the deposit'], 'The sales deposit is an early part-payment, not an extra purchase price.'),
      card('kiwisaver', 'KiwiSaver', 'Ask your provider early.', 'Generally, three years of membership is needed. Your provider confirms eligibility, the usable amount and the withdrawal process.', ['Request an eligibility check', 'Confirm what must remain', 'Agree timing with your lawyer'], 'Your KiwiSaver balance is not automatically the amount you can withdraw.'),
      card('support', 'Other help', 'Check today’s options.', 'Eligible buyers may use a First Home Loan with a smaller deposit. Check current criteria with Kāinga Ora and a participating lender.', ['Check current support routes', 'Ask about lender criteria', 'Confirm help before relying on it'], 'The First Home Grant ended in May 2024; old buying guides may still mention it.'),
    ], sourceLinks: [links.support, links.kiwisaver, links.contract], bridge: 'Take your figures and questions to a lender or adviser.',
  },
  {
    id: 'team', stage: 'prepare', label: 'Bank & broker chats', headline: 'Your first broker chat.\nBring questions.',
    intro: 'Your mortgage adviser helps with borrowing; your lawyer checks legal risks. Choose your own advisers and ask what each covers.', image: 'broker', chapterIds: ['team'],
    cards: [
      card('compare', 'Compare lenders', 'Who do you compare?', 'Ask which lenders the adviser works with and why they recommend an option. You can also compare a direct bank offer.', ['Ask which lenders are included', 'Ask which are missing', 'Request a written comparison'], 'A broker does not necessarily search the whole market.'),
      card('paid', 'How they’re paid', 'Know what you could owe.', 'Ask about commissions, direct fees and charges if you leave early. Get the circumstances and amounts in writing.', ['Ask about commissions', 'Check fees and clawbacks', 'Ask what ongoing help includes'], 'Cashback repayment and an adviser’s clawback fee are different things.'),
      card('prepare', 'What to bring', 'Make the next chat easier.', 'Gather income, spending, debts and deposit evidence. Choose your own property lawyer early, and ask the lender about pre-approval conditions.', ['Gather the requested evidence', 'Choose your own lawyer', 'Confirm approval conditions and expiry'], 'Pre-approval still needs the property and final loan to be approved.'),
    ], sourceLinks: [links.broker, links.approval], bridge: 'Before shopping, understand how the loan will work.',
  },
  {
    id: 'mortgage', stage: 'prepare', label: 'Understand the loan', headline: 'Borrow the money.\nUnderstand the deal.',
    intro: 'The repayment is one number. The structure, fees and flexibility matter too.', image: 'costs', chapterIds: ['mortgage'],
    cards: [
      card('repayments', 'Repayments', 'Try a different scenario.', 'A principal-and-interest payment covers interest and reduces debt. Change the example loan, rate and term to see the relationship.', ['Try a higher rate', 'Compare different loan terms', 'Add your other ownership costs'], 'The calculator is an illustration, not current rates or a lending decision.'),
      card('structure', 'Fixed or floating', 'Ask what changes, and when.', 'Fixed, floating, split and offset options behave differently. Ask your adviser to explain how each would work for your spending and income.', ['Compare written loan options', 'Check extra-payment rules', 'Diary the fixed-rate expiry'], 'A two-year fixed rate does not mean a two-year loan.'),
      card('exit', 'Fees & switching', 'Read the exit terms.', 'A low headline rate or cashback can come with conditions. Ask what happens if you repay early, sell or switch lenders.', ['Ask about break costs', 'Read cashback conditions', 'Compare the overall deal'], 'Switching early can trigger more than one charge.'),
    ], sourceLinks: [links.mortgage, links.broker, links.approval], bridge: 'With a comfortable budget, try the life around the house.',
  },
  {
    id: 'neighbourhood', stage: 'find', label: 'The neighbourhood', headline: 'Love the house.\nTry the neighbourhood.',
    intro: 'You are buying the everyday trip, the neighbours and the surroundings too.', image: 'neighbourhood', chapterIds: ['search'],
    cards: [
      card('travel', 'Getting around', 'Try your everyday trip.', 'Walk, drive or take public transport at the time you would actually use it. Check the whole trip, not just a map.', ['Travel at your usual time', 'Check door to door', 'Try a backup route'], 'A quiet Sunday visit can hide a difficult weekday commute.'),
      card('times', 'Day & night', 'Come back at another time.', 'Notice sun, traffic, noise and activity around the home. Think about the season as well as the time of day.', ['Visit morning and evening', 'Notice nearby noise', 'Check likely winter sunlight'], 'A bright open home does not show you every season.'),
      card('local', 'Local checks', 'Look beyond the boundary.', 'Ask about nearby development, local services and land hazards. Use council information and your own checks alongside the agent’s description.', ['Check planning information', 'Look up hazard information', 'Confirm the services you need'], 'A view or empty neighbouring section may change.'),
    ], sourceLinks: [links.neighbourhood, links.hazards], bridge: 'Next, match the home and ownership type to your needs.',
  },
  {
    id: 'homes', stage: 'find', label: 'Home & ownership types', headline: 'Same front door.\nDifferent strings.',
    intro: 'A house, townhouse or apartment tells you its shape—not all your rights and responsibilities.', image: 'neighbourhood', chapterIds: ['search'],
    cards: [
      card('needs', 'Your shortlist', 'Choose your real must-haves.', 'Separate essentials from preferences. Existing homes, new builds, off-plan purchases and fixer-uppers each bring different checks and trade-offs.', ['Pick three non-negotiables', 'Check space and access', 'Compare condition and upkeep'], 'A new home still needs careful contract and completion checks.'),
      card('title', 'The title', 'Find out what you own.', 'Freehold, cross lease, leasehold and unit title mean different arrangements. Ask your lawyer about boundaries, restrictions, shared areas and permissions.', ['Ask your lawyer to read the title', 'Check shared access and boundaries', 'Ask about restrictions on changes'], 'A cheaper leasehold price can come with ongoing ground rent.'),
      card('shared', 'Shared buildings', 'Read the shared commitments.', 'For a unit title, examine disclosure, body corporate records and maintenance funding. For other shared arrangements, ask who pays and decides.', ['Request the relevant records', 'Check planned work and levies', 'Ask about disputes and insurance'], 'A maintenance plan is not proof that enough money has been saved.'),
    ], sourceLinks: [links.options, links.ownership, links.unit], bridge: 'Take your must-haves with you to the viewing.',
  },
  {
    id: 'viewing', stage: 'find', label: 'At a home visit', headline: 'See the home.\nAsk the awkward things.',
    intro: 'An open home is a first look. Turn what you notice into questions to investigate.', image: 'inspection', chapterIds: ['search', 'inspect'],
    cards: [
      card('notice', 'Look closely', 'Look past the styling.', 'Notice stains, smells, ventilation and condition. Ask before testing fittings or taking photos, and record questions while they are fresh.', ['Look at ceilings and windows', 'Ask about heating and ventilation', 'Note anything needing explanation'], 'Fresh paint can hide a question; it cannot answer it.'),
      card('questions', 'Ask the agent', 'Ask what has happened here.', 'Ask about repairs, alterations, known defects, claims and what stays with the property. Request documents for important answers.', ['Ask about repairs and leaks', 'Ask what is included', 'Request evidence in writing'], 'The selling agent works for the seller; get your own advice.'),
      card('compare', 'Compare fairly', 'Use the same checks each time.', 'Compare each home against your must-haves and keep notes together. Arrange a further viewing when you need more time or a specialist.', ['Use your must-have list', 'Record questions for follow-up', 'Arrange another visit if needed'], 'A viewing cannot replace an independent building inspection.'),
    ], sourceLinks: [links.viewing, links.homework, links.contract], bridge: 'If it makes the shortlist, arrange the deeper checks.',
  },
  {
    id: 'inspection', stage: 'find', label: 'The inspection', headline: 'Look past\nthe fresh paint.',
    intro: 'Use a qualified inspector to understand condition, limits and the checks still needed.', image: 'inspection', chapterIds: ['inspect'],
    cards: [
      card('scope', 'What’s covered', 'What couldn’t be checked?', 'Agree the inspection scope and read its limitations. Ask which areas were inaccessible and which concerns need a specialist.', ['Ask for a sample report', 'Confirm access and scope', 'Ask about specialist follow-up'], 'An inspection report has limits; it is not a guarantee.'),
      card('water', 'Moisture & warmth', 'Follow the cause, not the stain.', 'Ask about roof, drainage, moisture, insulation and ventilation. An unexplained sign needs investigation rather than a cosmetic estimate.', ['Ask about water entry', 'Check warmth and ventilation', 'Follow up unexplained findings'], 'A dry viewing day does not prove a dry house.'),
      card('repairs', 'What happens next', 'Turn findings into decisions.', 'Discuss concerns with the inspector and your lawyer. Get significant work assessed and priced before committing beyond your agreed protections.', ['Separate urgent from cosmetic', 'Get specialist estimates', 'Discuss findings with your lawyer'], 'Do not assume you can rely on a report commissioned for someone else.'),
    ], sourceLinks: [links.homework, links.hazards, links.viewing], bridge: 'The building and its paperwork need to tell the same story.',
  },
  {
    id: 'records', stage: 'find', label: 'Records & consents', headline: 'Check the house.\nCheck its paper trail.',
    intro: 'Your lawyer, council records and inspection answer different questions. Bring them together.', image: 'contract', chapterIds: ['inspect', 'search', 'living'],
    cards: [
      card('council', 'Council records', 'What does the council know?', 'A LIM is a report of council-held property information. Ask for it and the property file; review hazards, plans and approvals with your lawyer.', ['Request the relevant records', 'Review recorded issues', 'Compare plans with the home'], 'A LIM is not a physical inspection of the building.'),
      card('alterations', 'Past alterations', 'Do the changes add up?', 'Ask for consent and completion records for alterations. Get advice on missing paperwork and whether other permissions were needed.', ['Ask what was changed', 'Find approvals and sign-off', 'Investigate missing records'], 'Building consent, a code compliance certificate (CCC) and a certificate of acceptance are different documents.'),
      card('rights', 'Rights & access', 'Can you use it as planned?', 'Ask your lawyer to explain easements, covenants and shared responsibilities. Confirm services and access, especially for unusual or rural properties.', ['Check access and services', 'Ask about title restrictions', 'Confirm permissions for your plans'], 'A building approval does not override a restriction on the title.'),
    ], sourceLinks: [links.council, links.titles, links.consents, links.buildingAct], bridge: 'Now confirm the property can get the cover you need.',
  },
  {
    id: 'insurance', stage: 'find', label: 'Hazards & insurance', headline: 'Check the risk.\nConfirm the cover.',
    intro: 'Ask about the specific address before you commit, not after you have bought it.', image: 'inspection', chapterIds: ['inspect', 'search'],
    cards: [
      card('hazards', 'The land', 'What could affect this site?', 'Look into flooding, slips, coastal and earthquake hazards. Use council records and specialist advice appropriate to the location.', ['Read hazard information', 'Ask about past damage', 'Seek specialist advice where needed'], 'A hazard map does not answer every property-specific question.'),
      card('cover', 'The policy', 'Can you insure this home?', 'Ask an insurer about cover, exclusions, excesses and rebuild estimates. Confirm any lender requirements before committing unconditionally or bidding.', ['Request an address-specific quote', 'Check exclusions and excesses', 'Confirm lender requirements'], 'The seller’s insurance is not proof that you can get the same cover.'),
      card('claims', 'Previous claims', 'Follow the claim and the repair.', 'Ask about previous NHC/EQC claims and repairs. Have your lawyer review unresolved matters and any transfer of claims.', ['Request claim information', 'Check repair evidence', 'Ask your lawyer about transfer'], 'A settled claim does not prove all repairs were completed.'),
    ], sourceLinks: [links.hazards, links.claims, links.approval], bridge: 'With checks underway, understand how this particular sale works.',
  },
  {
    id: 'offer', stage: 'buy', label: 'Offers & contracts', headline: 'Before you sign.\nBefore you bid.',
    intro: 'The sale method changes your deadlines. Get your lawyer involved before you commit.', image: 'contract', chapterIds: ['offer'],
    cards: [
      card('method', 'Sale methods', 'Know the rules of this sale.', 'Negotiation, tender, deadline and multi-offer processes differ. Ask about the exact timetable and whether the seller can accept an earlier offer.', ['Confirm the sale process', 'Check whether it can sell early', 'Set your own limit'], 'Pressure from another buyer does not remove the need for your checks.'),
      card('auction', 'Auction', 'Do the checks before bidding.', 'An auction purchase is unconditional. Have finance, insurance, property checks and legal advice arranged before you bid.', ['Confirm funds and insurance', 'Finish due diligence', 'Agree bidding authority and limit'], 'Winning the auction commits you to the purchase.'),
      card('contract', 'The agreement', 'Understand what binds you.', 'Have your lawyer review conditions, deadlines, deposit, included items and settlement. Ask what must happen before any condition is satisfied or waived.', ['Get legal review before signing', 'Write down dates and conditions', 'Confirm included items'], 'A conditional contract is still binding; it is not a free cancellation window.'),
    ], sourceLinks: [links.contract, links.auction, links.offer], bridge: 'Once the agreement progresses, plan the handover with your lawyer.',
  },
  {
    id: 'settlement', stage: 'buy', label: 'Getting the keys', headline: 'One last check.\nThen, your front door.',
    intro: 'Coordinate the inspection, documents, money and insurance before moving day.', image: 'contract', chapterIds: ['settlement'],
    cards: [
      card('inspection', 'Final inspection', 'Check it against the agreement.', 'Use the pre-settlement inspection to check agreed condition and included items. Tell your lawyer promptly about missing items or new damage.', ['Check agreed repairs', 'Check included chattels', 'Report problems to your lawyer'], 'Do not leave a problem until you collect the keys.'),
      card('money', 'Money & cover', 'Get everything ready on time.', 'Confirm loan documents, KiwiSaver timing, remaining funds and insurance with your lawyer and lender. Verify payment instructions using a trusted contact method.', ['Confirm documents and funds', 'Confirm when cover starts', 'Verify bank details independently'], 'An email changing bank details can be a scam.'),
      card('keys', 'The handover', 'Wait for settlement confirmation.', 'Your lawyer coordinates settlement. Arrange keys after confirmation, with some flexibility around movers and access.', ['Wait for your lawyer’s confirmation', 'Confirm key collection', 'Record meters and arrange services'], 'Keys are not guaranteed first thing on settlement morning.'),
    ], sourceLinks: [links.settlement, links.fraud, links.contract], bridge: 'The keys are a milestone. Now make a plan to care for the place.',
  },
  {
    id: 'living', stage: 'own', label: 'Life as an owner', headline: 'Your place.\nA little care goes far.',
    intro: 'Keep on top of repairs, regular bills and changes in your own life.', image: 'own', chapterIds: ['living', 'budget', 'mortgage'],
    cards: [
      card('care', 'Keep it working', 'Start with the urgent things.', 'Use your inspection report to plan maintenance. Address safety and water problems before cosmetic improvements, using appropriate tradespeople.', ['List urgent repairs', 'Schedule regular maintenance', 'Keep records and warranties'], 'Small water problems can become expensive when ignored.'),
      card('review', 'Review the bills', 'Put the dates in your calendar.', 'Revisit insurance, loan terms and maintenance savings as the property or your circumstances change. Ask for help early if repayments become difficult.', ['Diary loan and policy renewals', 'Review cover after changes', 'Contact your lender early if struggling'], 'The right loan and cover can change as your life changes.'),
      card('shared', 'Shared responsibilities', 'Keep talking to the other owners.', 'Know how shared maintenance and decisions work. Read notices, understand proposed work and keep your own records.', ['Read shared-property notices', 'Budget for agreed levies', 'Keep decisions in writing'], 'Shared ownership can involve costs beyond your own front door.'),
    ], sourceLinks: [links.finances, links.unit, links.mortgage], bridge: 'Planning changes? Check the rules before picking up tools.',
  },
  {
    id: 'renovate', stage: 'own', label: 'Renovate thoughtfully', headline: 'Make it yours.\nCheck before you change.',
    intro: 'Start with scope, permissions and a realistic budget. Then choose the right people.', image: 'own', chapterIds: ['living'],
    cards: [
      card('permissions', 'Permissions', 'Check more than one rule.', 'Ask the council about building and resource consents. Check title restrictions and any other owners’ approvals before work starts.', ['Confirm consent requirements', 'Check title and shared approvals', 'Allow time for approvals'], 'No building consent does not mean no rules apply.'),
      card('scope', 'Scope & budget', 'Price the hidden work too.', 'Get a clear scope, written quotes and appropriate professional advice. Allow for unknown conditions and tell your insurer about planned work.', ['Compare detailed written quotes', 'Keep a contingency', 'Tell your insurer your plans'], 'A cosmetic project can reveal structural or moisture problems.'),
      card('finish', 'Safety & sign-off', 'Keep the evidence of good work.', 'Check suspected hazardous materials before disturbing them. Use appropriate specialists and retain required approvals, inspections, warranties and completion records.', ['Check before disturbing old materials', 'Use qualified people where required', 'Keep completion records'], 'Do not cut, sand or remove suspected asbestos without appropriate advice.'),
    ], sourceLinks: [links.consents, links.renovation, links.asbestos, links.buildingAct], bridge: 'Keep your saved checks handy, and return whenever your plans change.',
  },
];

// Keep agent roles in the search stage and sale processes before the offer.
for(const added of additionalTopics){const before=added.id==='agents'?'viewing':'offer';topics.splice(topics.findIndex(t=>t.id===before),0,added);}
