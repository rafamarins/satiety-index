# Buyer-question research and coverage — 26 October 2026

## What this establishes

A qualitative sample of NZ buyer discussions, a buyer-written guide and a conveyancing blog. These reveal recurring concerns, not a statistically ranked list of the biggest questions. Reddit comments are evidence of confusion and lived experience, not legal or financial authority. Prices, blanket market claims and advice in comments were not copied into the product.

## Sources reviewed

- [NZProperty: what buyers wish they had known](https://www.reddit.com/r/NZProperty/comments/1ux3y2a/what_do_you_wish_you_had_known_before_buying_your/) — July 2026 discussion. Themes: parking at different times, flood/land hazards, report limitations, maintenance surprises, shared access and body corporate repair funding.
- [PersonalFinanceNZ: what first-home buyers need to know](https://www.reddit.com/r/PersonalFinanceNZ/comments/1qjkjqf/what_do_first_home_buyers_need_to_know/) — discussion reviewed through rendered public page. Themes: practical viewing checks, two meanings of deposit, who the agent represents, reports, insurance and legal costs. Contradictory deposit-timing comments reinforce the need to link to the actual contract rules, not repeat a forum rule.
- [NZ: what buyers wish they knew](https://www.reddit.com/r/newzealand/comments/1tup40y/whats_one_thing_you_wish_youd_known_before_buying/) — search-indexed discussion. Themes: maintenance, early broker conversations and asking professionals questions. Only indexed text was reviewed.
- [CQ First Home Buyers Guide](https://www.cqhomeguide.org.nz/) — buyer-written companion. Emphasises explicit process order, terms, professional roles, repeatable viewing notes and comparing actual sold prices. This informed the product usability questions, not factual advice.
- [Blackwood Montagna: things first-home buyers often miss](https://bmlegal.co.nz/things-first-home-buyers-in-new-zealand-often-miss/) — dated 3 March 2026. Themes: contract conditions, KiwiSaver arrangements, non-final pre-approval and settlement adjustments. Its commercial perspective is noted; primary guidance governs product wording.
- [MoneyHub first-home guide](https://www.moneyhub.co.nz/buying-a-house.html) — indexed guide: costs, property search, written questions and legal due diligence. Only indexed text reviewed.

A checklist discussion and a personal-blog category page failed direct retrieval and were not used as evidence of full-page content.

## Coverage audit

| Buyer question/theme | Existing destination | Finding/action |
|---|---|---|
| Do I need 20%; can I use KiwiSaver? | Deposit → Questions & answers | Covered, including eligibility, timing and current-help cautions. |
| Are there two different deposits? | Deposit → Questions & answers | Covered. Added plural search matching for “two deposits.” |
| What order; bank or lawyer first? | Rent or buy → Questions & answers | Previously scattered. Added a concise process-order FAQ. |
| When do I pay for reports? | Inspection → Questions & answers | Previously implicit. Added explicit auction/unconditional versus conditional-offer timing. |
| Is pre-approval the final loan approval? | Bank & broker → Questions & answers | Covered. |
| Who does the agent work for; what does a broker cost? | Viewing / Bank & broker | Covered, with first-layer role statements and deeper fee questions. |
| Costs beyond mortgage and deposit? | Whole cost / Settlement | Covered, including rates adjustments, maintenance and unsuccessful-offer costs. |
| Can I rely on a seller’s report? | Inspection → Questions & answers | Covered with scope, reliance and specialist-check limitations. |
| LIM vs inspection, consents and CCC? | Records & consents | Covered; relevant FAQs now directly accessible without opening a reminder set. |
| Flooding, insurance before commitment? | Hazards & insurance | Covered; no assumption seller’s cover transfers. |
| Sun, warmth, parking and neighbourhood at different times? | Neighbourhood / Viewing / Inspection | Covered across these locations; human testing should check whether this grouping matches expectations. |
| Title, shared access and body corporate bills? | Home & ownership types | Covered, including maintenance-plan versus actual-funding distinction. |
| What should be included in the agreement? | Offers & contracts | Covered, including chattels and written terms. |
| Can I walk away; auction commitments? | Offers & contracts | Covered; contract-specific advice, no blanket right to cancel. |
| Keys, settlement delay, missing/broken items? | Settlement | Covered; timing and lawyer escalation. |
| Repairs, asbestos, consents and later mortgage trouble? | Ownership / Renovation / Mortgage | Covered; no fixed repair-cost promises or DIY diagnosis. |

## Interface decision

The old checkbox list mixed reading with doing. The short explanation and gotcha remain the learning content. Lists are now labelled **Things to do later**, displayed as ordinary bullets with an explicit optional-reminder explanation. **Save reminders** collects them; only **Saved** has completion checkboxes, with instructions to tick work actually done. Existing saved/checked state and printing remain compatible. No completion score or implied approval of a property.

Each topic also has a direct **Questions & answers** control above its main explanation blocks, avoiding the old route through a generic notes/checks panel.

## Primary verification for additions

- [Settled: understanding the home-buying journey](https://www.settled.govt.nz/buying-a-home/thinking-of-buying/understanding-the-home-buying-journey/) — professional support, finances, property research and settlement sequence.
- [Settled: sale and purchase agreement](https://www.settled.govt.nz/buying-a-home/making-an-offer/understanding-the-sale-and-purchase-agreement-when-buying/) — negotiated conditions and contract-dependent deposit timing.
- Existing auction guidance and inspection references remain linked in the guide. The new FAQs preserve the need to complete due diligence before an unconditional commitment.

The audit confirms topic coverage and source-backed explanations, not exhaustive suitability for every property. Independent browser scenarios and results follow in the QA record below.

## Independent blind scenario pass

A separate agent used only visible UI in a fresh background tab, with no source-code hints. It tested ten research-derived goals, using Search and answer disclosures. Eight were answered on the first pass; two were partial. This is a simulated novice task test, not a human success statistic.

| Query used | Answer reached | First-pass outcome |
|---|---|---|
| deposit | Bank versus sales deposit | Answered |
| order | Where to start and sequence | Answered |
| reports | When to pay for reports | Answered |
| pre-approval | What pre-approval approves | Answered |
| reports | Seller's building report | Answered |
| body corporate | Maintenance plan versus funding | Answered |
| insurance | Insurance before unconditional | Answered |
| parking | Location and different times | Answered |
| curtains, appliances, then included | Written inclusions | Partial: familiar words failed and examples were thin |
| keys, then delay | Settlement day; missing/broken items | Partial: ordinary delays lacked a direct answer |

The last two tasks ran at 390 × 844. A new plain-language inclusions FAQ and settlement-delay FAQ were then added in all four languages. Plural appliance matching was added. Source verification: [Settled contract/chattels guidance](https://www.settled.govt.nz/buying-a-home/making-an-offer/understanding-the-sale-and-purchase-agreement-when-buying/) and [Settled settlement-day guidance](https://www.settled.govt.nz/buying-a-home/settling-and-moving-in/settling-on-settlement-day-when-buying/). Direct planning-page retrieval timed out; indexed official settlement-day guidance was available.

### Final bounded retest

The same independent tester opened another fresh tab at 390 × 844. **curtains**, **appliances** and **settlement delay** all found substantive answers. Inclusions was first for appliances; the new delay answer was first for settlement delay. The tester confirmed readable text and no remaining gap in those bounded tasks. No saved data was changed; only its own tab was closed.

Search now renders matched answers before broader topic cards. The three independent retest queries had no topic cards; a separate check of the packaged build searched “deposit” and confirmed Answers (11) appeared before the two topic groups containing four topic results.

### Reminder usability check

The tester followed “How do I get the keys?” → “Getting the keys” → “Wait for settlement confirmation.” It observed plain bullets, “Things to do later,” the optional-reminder explanation and “Save reminders.” Saving opened checkboxes only in Saved, with the instruction to tick actions done, not merely read. It judged this distinction clear in the sampled flow. Saved 0 was restored and no notes were created.
