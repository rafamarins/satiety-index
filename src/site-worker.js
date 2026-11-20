const guidePath = "/outros/home-veritas/";
const chatPath = guidePath + "ask";

function returnToGuide(url) {
  const from = url.searchParams.get("from");
  if (!from || !URL.canParse(from, url)) return guidePath;
  const target = new URL(from, url);
  if (target.origin !== url.origin || target.pathname !== guidePath) return guidePath;
  return guidePath + target.search + target.hash;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === chatPath || url.pathname === chatPath + "/index.html") {
      url.pathname = chatPath + "/";
      return Response.redirect(url.href, 308);
    }
    if (!url.pathname.startsWith(chatPath + "/")) return env.ASSETS.fetch(request);

    const isChatPage = url.pathname === chatPath + "/";
    const embedded = isChatPage && url.searchParams.get("embed") === "1";
    const guide = isChatPage ? returnToGuide(url) : null;
    // Keep the public origin for the agent's same-origin checks.
    url.pathname = isChatPage ? "/index.html" : url.pathname.slice(chatPath.length);
    if (isChatPage) url.search = "";
    const response = await env.VERITAS.fetch(new Request(url, request));
    if (!isChatPage || request.method !== "GET" || response.status !== 200) return response;

    // The return link must work before the chat modules load.
    const rewriter = new HTMLRewriter().on("a.guide-link", {
      element(link) {
        link.setAttribute("href", guide);
        link.removeAttribute("target");
      },
    });
    if (embedded) {
      rewriter.on("body", {
        element(body) { body.setAttribute("data-embedded", ""); },
      });
    }
    const page = rewriter.transform(response);
    if (embedded) {
      const policy = page.headers.get("Content-Security-Policy");
      page.headers.set("Content-Security-Policy", policy.replace("frame-ancestors 'none'", "frame-ancestors 'self'"));
    }
    page.headers.set("Cache-Control", "no-store");
    page.headers.delete("ETag");
    return page;
  },
};
