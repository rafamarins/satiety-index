// Preserve English identity for stable grouping/search while rendering translated text.
export function localizedReference(guide,links,translation){
  const chapters=guide.chapters.map((chapter,index)=>{
    const local=translation?.chapters[index];
    return {...chapter,...local,details:chapter.details.map((entry,detailIndex)=>({
      ...entry,...local?.details[detailIndex],
      url:entry.url,
      key:`faq/${chapter.id}/${detailIndex}`,
      searchQuestion:entry.question,
      searchAnswer:entry.answer,
    }))};
  });
  return {chapters,faqs:chapters.flatMap(({id,details})=>details.map(entry=>({...entry,chapter:id}))),resources:links.resources.map((resource,index)=>({...resource,...translation?.resources[index],url:resource.url}))};
}
