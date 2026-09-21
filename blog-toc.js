(() => {
  const toc = document.querySelector(".blog-toc");
  const content = document.querySelector("[data-blog-content]");
  if (!toc || !content) return;

  const toggle = toc.querySelector(".blog-toc__toggle");
  const nav = toc.querySelector(".blog-toc__nav");
  const links = [...toc.querySelectorAll(".blog-toc__link")];
  const headings = links
    .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
    .filter(Boolean);

  if (!links.length || !headings.length) {
    toc.remove();
    document.querySelector(".blog-detail-layout")?.classList.add("blog-detail-layout--without-toc");
    return;
  }

  const closeMobileToc = () => {
    toc.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    const open = !toc.classList.contains("is-open");
    toc.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  for (const link of links) link.addEventListener("click", closeMobileToc);

  let currentId = "";
  const setCurrent = (id) => {
    if (!id || id === currentId) return;
    currentId = id;
    for (const link of links) {
      if (decodeURIComponent(link.hash.slice(1)) === id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

  const updateFromScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
      setCurrent(headings.at(-1)?.id);
      return;
    }
    const offset = Math.min(180, window.innerHeight * 0.28);
    let active = headings[0];
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= offset) active = heading;
      else break;
    }
    setCurrent(active?.id);
  };

  const observer = new IntersectionObserver(updateFromScroll, {
    rootMargin: "-96px 0px -65% 0px",
    threshold: [0, 1],
  });
  for (const heading of headings) observer.observe(heading);
  window.addEventListener("scroll", updateFromScroll, { passive: true });
  window.addEventListener("hashchange", updateFromScroll);
  updateFromScroll();

  if (window.location.hash) {
    requestAnimationFrame(() => document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView());
  }
})();
