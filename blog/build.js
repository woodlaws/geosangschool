const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const origin = "https://www.geosangschool.co.kr";
const posts = [
  require("./posts/reels-start-checklist"),
  require("./posts/reels-first-three-seconds"),
  require("./posts/reels-30-second-script"),
  require("./posts/threads-profile-guide"),
  require("./posts/threads-opening-lines"),
  require("./posts/threads-post-structure"),
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function jsonScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function headingText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function headingSlug(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

function buildOutline(value) {
  const used = new Map();
  const headings = [];
  const html = value.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (match, level, attributes, contents) => {
    const label = headingText(contents);
    const existing = attributes.match(/\sid=(?:"([^"]+)"|'([^']+)')/);
    let id = existing?.[1] || existing?.[2] || headingSlug(label);
    const count = (used.get(id) || 0) + 1;
    used.set(id, count);
    if (count > 1) id = `${id}-${count}`;
    headings.push({ level: Number(level), id, label });
    const nextAttributes = existing
      ? attributes.replace(/\sid=(?:"[^"]+"|'[^']+')/, ` id="${escapeHtml(id)}"`)
      : `${attributes} id="${escapeHtml(id)}"`;
    return `<h${level}${nextAttributes}>${contents}</h${level}>`;
  });
  return { html, headings };
}

function imagePath(post, name) {
  return `/images/blog/${post.slug}/${name}.png`;
}

function header() {
  const links = [
    ["/about", "소개"], ["/courses", "전체 교육과정"],
    ["/courses/ai-marketing-school", "AI마케팅스쿨"],
    ["/courses/short-courses", "단기 클래스"], ["/resources", "학습자료"],
    ["/blog", "블로그"], ["/reviews", "수강후기"],
    ["/contact", "상담문의"], ["/support", "학습지원"],
  ];
  const desktop = links.map(([href, label]) => `<a class="nav-link" href="${href}"${href === "/blog" ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const mobile = links.map(([href, label]) => `<a href="${href}"${href === "/blog" ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<nav id="gs-nav" class="nav-wrap" aria-label="주 메뉴"><div class="nav-inner">
    <a class="nav-logo" href="/" aria-label="거상스쿨 홈으로 이동"><img src="/uploads/logo-symbol.png" alt="거상스쿨 로고" width="42" height="42"><span>거상스쿨</span></a>
    <div class="nav-links">${desktop}</div>
    <div class="nav-cta-group"><a class="btn-nav-sub" href="/login">수강생 로그인</a></div>
    <button class="hamburger blog-menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="blog-mobile-nav"><span></span><span></span><span></span></button>
  </div><div id="blog-mobile-nav" class="mobile-nav" aria-label="모바일 메뉴" hidden>${mobile}<a href="/login" class="mob-login">수강생 로그인</a></div></nav>`;
}

function footer() {
  return `<footer class="gs-footer"><div class="gs-footer__inner"><div class="gs-footer__top">
    <section class="gs-footer__brand" aria-label="거상스쿨 소개"><a class="gs-footer__brand-link" href="/" aria-label="거상스쿨 홈으로 이동"><img src="/logo.png" alt="거상스쿨 로고" width="52" height="52"><span><strong class="gs-footer__brand-name">거상스쿨</strong><span class="gs-footer__brand-tagline">AI로 돈 버는 실전 교육 플랫폼</span></span></a><p class="gs-footer__description">AI 시대에 1인기업, 소상공인, 강사, 마케터가 AI로 콘텐츠, 마케팅, 홈페이지, 자동화 시스템을 직접 만들 수 있도록 돕는 실전형 AI 마케팅 교육 플랫폼</p></section>
    <section class="gs-footer__company" aria-labelledby="blog-footer-company"><h2 class="gs-footer__title" id="blog-footer-company">회사 정보</h2><p class="gs-footer__company-name">거상스쿨(주)</p><dl class="gs-footer__company-list"><dt>대표자명</dt><dd class="gs-footer__nowrap">임헌수</dd><dt>개인정보관리자</dt><dd class="gs-footer__nowrap">권현임</dd><dt>사업자등록번호</dt><dd class="gs-footer__nowrap">711-86-01966</dd><dt>이메일</dt><dd class="gs-footer__email"><a href="mailto:geosangschool@naver.com">geosangschool@naver.com</a></dd><dt>전화</dt><dd><a class="gs-footer__nowrap" href="tel:01057958075">010-5795-8075</a></dd><dt>주소</dt><dd>서울 강남구 테헤란로 313, 915호</dd></dl></section>
    <nav class="gs-footer__student" aria-label="수강생 메뉴"><h2 class="gs-footer__title">수강생</h2><div class="gs-footer__student-links"><a href="/login">수강생 로그인</a><a href="https://geosangschool.com/member_login.php" target="_blank" rel="noopener noreferrer">기존 강의실</a><a href="/resources">학습자료</a></div></nav>
  </div><div class="gs-footer__bottom"><p class="gs-footer__copyright">© 2026 거상스쿨(주). All rights reserved.</p><div class="gs-footer__family"><span class="gs-footer__status" aria-hidden="true"></span><p class="gs-footer__family-text">거상마케팅센터 패밀리 브랜드</p></div></div></div></footer>`;
}

function page({ title, description, canonical, body, image, schema }) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="google-site-verification" content="gdmg6fOLuu69ukM7o4I7kx-XXNC_OndwfW8P2d_B5tE"><meta name="naver-site-verification" content="f8a19268d108db6ff5481faf074b5ac3b5ee2850">
    <title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${canonical}">
    <meta property="og:type" content="${Array.isArray(schema) ? "article" : "website"}"><meta property="og:locale" content="ko_KR"><meta property="og:site_name" content="거상스쿨"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}${image}">
    <meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/blog.css?v=20260922-2"><link rel="stylesheet" href="/footer.css"><link rel="stylesheet" href="/blog-nav.css?v=20260922-2"><script src="/analytics.js" defer></script><script src="/blog-filter.js" defer></script><script src="/blog-toc.js" defer></script>
    ${schema ? `<script type="application/ld+json">${jsonScript(schema)}</script>` : ""}
  </head><body class="blog-page">${header()}${body}${footer()}</body></html>\n`;
}

function card(post) {
  const url = `/blog/${post.slug}`;
  return `<article class="blog-card" data-category="${escapeHtml(post.category)}"><a class="blog-card__image" href="${url}"><img src="${imagePath(post, "cover")}" alt="${escapeHtml(post.coverAlt)}" width="1672" height="941" loading="lazy"></a><div class="blog-card__body"><div class="blog-card__meta"><span>${escapeHtml(post.category)}</span><time datetime="${post.published}">${post.published}</time></div><h3><a href="${url}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.summary)}</p><a class="blog-card__more" href="${url}" aria-label="${escapeHtml(post.title)} 읽기">글 읽기 <span aria-hidden="true">→</span></a></div></article>`;
}

function listing() {
  const reels = posts.filter((post) => post.category === "릴스");
  const threads = posts.filter((post) => post.category === "스레드");
  const body = `<main><section class="blog-hero"><div class="blog-container"><p class="blog-eyebrow">GEOSANG SCHOOL BLOG</p><h1>실전에 바로 쓰는<br>거상스쿨 블로그</h1><p>릴스와 스레드를 처음 시작하는 소상공인과 1인기업을 위한 실행 가이드입니다. 실제로 해 볼 수 있는 순서와 예시를 차근차근 정리했습니다.</p></div></section>
    <div class="blog-container blog-main"><nav class="blog-filters" aria-label="글 카테고리"><button type="button" data-filter="전체" aria-pressed="true">전체 <span>6</span></button><button type="button" data-filter="릴스" aria-pressed="false">릴스 <span>3</span></button><button type="button" data-filter="스레드" aria-pressed="false">스레드 <span>3</span></button></nav>
    <section class="blog-group" data-group="릴스" aria-labelledby="blog-reels-heading"><div class="blog-section-heading"><span class="blog-section-heading__icon" aria-hidden="true">▶</span><div><p>INSTAGRAM REELS</p><h2 id="blog-reels-heading">릴스 실전 가이드 <span>3편</span></h2></div></div><div class="blog-grid">${reels.map(card).join("")}</div></section>
    <section class="blog-group" data-group="스레드" aria-labelledby="blog-threads-heading"><div class="blog-section-heading"><span class="blog-section-heading__icon blog-section-heading__icon--threads" aria-hidden="true">✍</span><div><p>THREADS</p><h2 id="blog-threads-heading">스레드 실전 가이드 <span>3편</span></h2></div></div><div class="blog-grid">${threads.map(card).join("")}</div></section>
    <p class="blog-empty" hidden>이 카테고리에는 공개된 글이 없습니다.</p></div>
    <section class="blog-bottom-cta"><div class="blog-container"><h2>읽은 내용을 직접 실행해 보세요</h2><p>거상스쿨 교육과정에서 AI 도구와 콘텐츠 제작을 실습할 수 있습니다.</p><a href="/courses">전체 교육과정 보기</a></div></section></main>`;
  const schema = { "@context": "https://schema.org", "@type": "Blog", name: "거상스쿨 블로그", url: `${origin}/blog`, inLanguage: "ko-KR", blogPost: posts.map((post) => ({ "@type": "BlogPosting", headline: post.title, url: `${origin}/blog/${post.slug}` })) };
  return page({ title: "블로그 | 거상스쿨", description: "거상스쿨의 인스타그램 릴스·스레드 실전 가이드 6편. 소상공인과 1인기업이 콘텐츠를 기획하고 발행하는 방법을 확인하세요.", canonical: `${origin}/blog`, image: imagePath(posts[0], "cover"), body, schema });
}

function detail(post) {
  const url = `${origin}/blog/${post.slug}`;
  const related = posts.filter((other) => other.category === post.category && other.slug !== post.slug);
  const content = post.sections.map((section, index) => `<section class="blog-article__section"><h2>${escapeHtml(section.title)}</h2>${section.html}<figure><img src="${imagePath(post, `body-${index + 1}`)}" alt="${escapeHtml(post.imageAlts[index])}" width="1672" height="941" loading="lazy"><figcaption>AI로 제작한 설명용 이미지</figcaption></figure></section>`).join("");
  const faqs = post.faq.map(([question, answer]) => `<div class="blog-faq__item"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></div>`).join("");
  const sources = post.sources.map(([title, href]) => `<li><a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a></li>`).join("");
  const rawArticleBody = `<aside class="blog-answer"><strong>핵심 답변</strong><p>${escapeHtml(post.answer)}</p></aside><p class="blog-article__intro">${escapeHtml(post.intro)}</p>${content}<section class="blog-takeaway"><h2>핵심 정리</h2><p>${escapeHtml(post.takeaway)}</p></section><section class="blog-faq" aria-labelledby="blog-faq-heading"><h2 id="blog-faq-heading">자주 묻는 질문</h2>${faqs}</section><section class="blog-sources"><h2>참고 자료</h2><ul>${sources}</ul></section><div class="blog-article__cta"><p>배운 내용을 직접 적용해 보고 싶다면</p><a href="${escapeHtml(post.cta.href)}">${escapeHtml(post.cta.label)}</a></div>`;
  const outlined = buildOutline(rawArticleBody);
  const toc = outlined.headings.length ? `<aside class="blog-toc" aria-label="이 글의 목차"><div class="blog-toc__panel"><button class="blog-toc__toggle" type="button" aria-expanded="false" aria-controls="blog-toc-list"><span>이 글의 목차</span><span class="blog-toc__toggle-icon" aria-hidden="true">⌄</span></button><p class="blog-toc__title">이 글의 목차</p><nav class="blog-toc__nav" id="blog-toc-list">${outlined.headings.map((heading) => `<a class="blog-toc__link blog-toc__link--h${heading.level}" href="#${escapeHtml(heading.id)}">${escapeHtml(heading.label)}</a>`).join("")}</nav></div></aside>` : "";
  const body = `<main><div class="blog-container blog-detail-container"><nav class="blog-breadcrumb" aria-label="현재 위치"><a href="/">홈</a><span aria-hidden="true">/</span><a href="/blog">블로그</a><span aria-hidden="true">/</span><span>${escapeHtml(post.category)}</span></nav><div class="blog-detail-layout${toc ? "" : " blog-detail-layout--without-toc"}">${toc}<article class="blog-article"><header class="blog-article__header"><span class="blog-article__category">${escapeHtml(post.category)}</span><h1>${escapeHtml(post.title)}</h1><p class="blog-article__summary">${escapeHtml(post.summary)}</p><div class="blog-article__meta"><span>${escapeHtml(post.author)}</span><span aria-hidden="true">·</span><time datetime="${post.published}">${post.published}</time></div></header><figure class="blog-article__cover"><img src="${imagePath(post, "cover")}" alt="${escapeHtml(post.coverAlt)}" width="1672" height="941" fetchpriority="high"><figcaption>AI로 제작한 설명용 이미지</figcaption></figure><div class="blog-article__body" data-blog-content>${outlined.html}</div></article></div><section class="blog-related" aria-labelledby="blog-related-heading"><div class="blog-related__top"><h2 id="blog-related-heading">같은 주제의 글</h2><a href="/blog">전체 글 보기 →</a></div><div class="blog-grid">${related.map(card).join("")}</div></section></div></main>`;
  const schema = [
    { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.summary, datePublished: post.published, dateModified: post.modified, author: { "@type": "Organization", name: "거상스쿨" }, publisher: { "@type": "Organization", name: "거상스쿨", url: origin }, image: `${origin}${imagePath(post, "cover")}`, mainEntityOfPage: url, inLanguage: "ko-KR" },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: `${origin}/` }, { "@type": "ListItem", position: 2, name: "블로그", item: `${origin}/blog` }, { "@type": "ListItem", position: 3, name: post.title, item: url }] },
  ];
  return page({ title: `${post.title} | 거상스쿨 블로그`, description: post.summary, canonical: url, image: imagePath(post, "cover"), body, schema });
}

function writeIfChanged(file, content) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (current !== content) fs.writeFileSync(file, content, "utf8");
}

for (const post of posts) {
  if (!/^[a-z0-9-]+$/.test(post.slug) || post.sections.length !== 4 || post.imageAlts.length !== 4) throw new Error(`Invalid post: ${post.slug}`);
  for (const name of ["cover", "body-1", "body-2", "body-3", "body-4"]) {
    if (!fs.existsSync(path.join(root, imagePath(post, name).slice(1)))) throw new Error(`Missing image: ${post.slug}/${name}`);
  }
  writeIfChanged(path.join(root, `blog-${post.slug}.html`), detail(post));
}
writeIfChanged(path.join(root, "blog.html"), listing());

const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith(".dc.html"));
for (const name of htmlFiles) {
  const file = path.join(root, name);
  let html = fs.readFileSync(file, "utf8");
  if (name === "AI홈페이지스쿨.dc.html") {
    if (!html.includes('<a href="/blog">블로그</a>')) {
      html = html.replace('<a href="/courses/ai-homepage-school" aria-current="page">AI홈페이지스쿨</a>', '<a href="/courses/ai-homepage-school" aria-current="page">AI홈페이지스쿨</a><a href="/blog">블로그</a>');
      html = html.replace('<a href="/courses/ai-homepage-school">AI홈페이지스쿨</a>', '<a href="/courses/ai-homepage-school">AI홈페이지스쿨</a><a href="/blog">블로그</a>');
    }
    html = html.replace('<a class="btn btn-primary" href="/contact">수강 신청</a>', '<a class="btn btn-login" href="/login">수강생 로그인</a>');
    html = html.replace('<a class="mobile-cta" href="/contact">수강 신청</a>', '<a class="mobile-login" href="/login">수강생 로그인</a>');
  } else {
    if (!html.includes('<a href="/blog" class="nav-link">블로그</a>')) {
      html = html.replace(/(<a href="\/resources" class="nav-link[^"]*"[^>]*>학습자료<\/a>)(\r?\n)/, (_, anchor, newline) => `${anchor}${newline}      <a href="/blog" class="nav-link">블로그</a>\n`);
    }
    if (!html.includes('<a href="/blog" onClick="{{ toggleMenu }}">블로그</a>')) {
      html = html.replace(/(<a href="\/resources" onClick="{{ toggleMenu }}"[^>]*>학습자료<\/a>)(\r?\n)/, (_, anchor, newline) => `${anchor}${newline}  <a href="/blog" onClick="{{ toggleMenu }}">블로그</a>\n`);
    }
  }
  const navStyle = '<link rel="stylesheet" href="/blog-nav.css?v=20260922-2">';
  if (/<link rel="stylesheet" href="\/blog-nav\.css(?:\?[^\"]*)?">/.test(html)) {
    html = html.replace(/<link rel="stylesheet" href="\/blog-nav\.css(?:\?[^\"]*)?">/, navStyle);
  } else {
    html = html.replace(/(<link rel="stylesheet" href="\/footer\.css">)(\r?\n)/, (_, link, newline) => `${link}${newline}${navStyle}\n`);
  }
  html = html.replace(/\s*<a[^>]*class="btn-nav-main"[^>]*>[^<]*<\/a>/g, "");
  html = html.replace(/\s*<a[^>]*class="mob-cta"[^>]*>[^<]*<\/a>/g, "");
  const navigationReady = name === "AI홈페이지스쿨.dc.html"
    ? (html.match(/<a href="\/blog">블로그<\/a>/g) || []).length === 2
    : html.includes('<a href="/blog" class="nav-link">블로그</a>') && html.includes('<a href="/blog" onClick="{{ toggleMenu }}">블로그</a>');
  if (!navigationReady) throw new Error(`Navigation not updated: ${name}`);
  writeIfChanged(file, html);
}

const configFile = path.join(root, "vercel.json");
const configText = fs.readFileSync(configFile, "utf8");
const config = JSON.parse(configText);
config.rewrites = config.rewrites.filter((rule) => rule.source !== "/blog" && !rule.source.startsWith("/blog/"));
config.rewrites.push({ source: "/blog", destination: "/blog.html" });
for (const post of posts) config.rewrites.push({ source: `/blog/${post.slug}`, destination: `/blog-${post.slug}.html` });
const rewriteStart = configText.indexOf('  "rewrites": [');
if (rewriteStart < 0) throw new Error("Missing Vercel rewrites");
const compactRewrites = config.rewrites.map(({ source, destination }) => `    { "source": "${source}", "destination": "${destination}" }`).join(",\n");
writeIfChanged(configFile, `${configText.slice(0, rewriteStart)}  "rewrites": [\n${compactRewrites}\n  ]\n}\n`);

const sitemapFile = path.join(root, "sitemap.xml");
let sitemap = fs.readFileSync(sitemapFile, "utf8");
sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/www\.geosangschool\.co\.kr\/blog(?:\/[^<]*)?<\/loc>[\s\S]*?<\/url>/g, "");
const latest = posts.map((post) => post.modified).sort().at(-1);
const blogUrls = [{ slug: "", modified: latest }, ...posts.map((post) => ({ slug: `/${post.slug}`, modified: post.modified }))];
const additions = blogUrls.map((entry) => `  <url>\n    <loc>${origin}/blog${entry.slug}</loc>\n    <lastmod>${entry.modified}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${entry.slug ? "0.7" : "0.8"}</priority>\n  </url>`).join("\n");
sitemap = sitemap.replace(/\s*<\/urlset>/, `\n${additions}\n</urlset>`);
writeIfChanged(sitemapFile, sitemap);

console.log(`Built blog index, ${posts.length} posts, navigation, routes and sitemap.`);
module.exports = { buildOutline };
