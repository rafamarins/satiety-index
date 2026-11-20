const chatPath = "/outros/home-veritas/ask";

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === chatPath || url.pathname === chatPath + "/index.html") {
      url.pathname = chatPath + "/";
      return Response.redirect(url.href, 308);
    }
    if (!url.pathname.startsWith(chatPath + "/")) return env.ASSETS.fetch(request);

    // Keep the public origin for the agent's same-origin checks and stream the response untouched.
    url.pathname = url.pathname.slice(chatPath.length);
    if (url.pathname === "/") url.pathname = "/index.html";
    return env.VERITAS.fetch(new Request(url, request));
  },
};
