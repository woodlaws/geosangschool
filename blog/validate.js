const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const slugs = ["reels-start-checklist", "reels-first-three-seconds", "reels-30-second-script", "threads-profile-guide", "threads-opening-lines", "threads-post-structure"];
const posts = slugs.map((slug) => require(`./posts/${slug}`));
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const config = JSON.parse(read("vercel.json"));
const routes = new Map(config.rewrites.map(({ source, destination }) => [source, destination]));
const imageHashes = new Set();
const { buildOutline } = require("./build");

assert.equal(posts.filter((post) => post.category === "릴스").length, 3);
assert.equal(posts.filter((post) => post.category === "스레드").length, 3);
assert.equal(routes.get("/blog"), "/blog.html");
const listing = read("blog.html");
assert.equal((listing.match(/class="blog-card" data-category="릴스"/g) || []).length, 3);
assert.equal((listing.match(/class="blog-card" data-category="스레드"/g) || []).length, 3);
assert.match(listing, /<link rel="canonical" href="https:\/\/www\.geosangschool\.co\.kr\/blog">/);
assert.match(listing, /class="nav-wrap"/);
assert.doesNotMatch(listing, /<a[^>]+class="(?:btn-nav-main|mob-cta)"/);
assert.match(listing, /class="btn-nav-sub"[^>]*>수강생 로그인/);
assert.doesNotMatch(listing, /class="blog-header"|class="blog-nav"/);

for (const post of posts) {
  assert.equal(post.slug, slugs.find((slug) => slug === post.slug));
  assert.equal(post.sections.length, 4);
  assert.equal(post.imageAlts.length, 4);
  assert.ok(post.title && post.summary && post.published && post.answer && post.faq.length >= 3);
  assert.equal(routes.get(`/blog/${post.slug}`), `/blog-${post.slug}.html`);
  const html = read(`blog-${post.slug}.html`);
  assert.equal((html.match(/<h1>/g) || []).length, 1, post.slug);
  assert.equal((html.match(/<figure\b/g) || []).length, 5, post.slug);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://www\\.geosangschool\\.co\\.kr/blog/${post.slug}">`));
  assert.match(html, /google-site-verification/);
  assert.match(html, /naver-site-verification/);
  assert.match(html, /\/analytics\.js/);
  assert.match(html, /\/blog-toc\.js/);
  assert.match(html, /class="blog-detail-layout"/);
  assert.match(html, /class="nav-wrap"/);
  assert.doesNotMatch(html, /class="blog-header"|class="blog-nav"/);
  assert.match(html, /class="blog-toc" aria-label="이 글의 목차"/);
  const content = html.match(/<div class="blog-article__body" data-blog-content>([\s\S]*?)<\/div><\/article>/)?.[1];
  assert.ok(content, `Missing scoped article body: ${post.slug}`);
  const headingIds = [...content.matchAll(/<h[23][^>]*\sid="([^"]+)"/g)].map((match) => match[1]);
  const tocIds = [...html.matchAll(/class="blog-toc__link[^>]+href="#([^"]+)"/g)].map((match) => match[1]);
  assert.ok(headingIds.length >= 9, `Too few outline headings: ${post.slug}`);
  assert.equal(new Set(headingIds).size, headingIds.length, `Duplicate heading id: ${post.slug}`);
  assert.deepEqual(tocIds, headingIds, `TOC does not match scoped body: ${post.slug}`);
  assert.ok(!tocIds.includes("blog-related-heading"), `Related heading leaked into TOC: ${post.slug}`);
  assert.ok(!tocIds.includes("blog-footer-company"), `Footer heading leaked into TOC: ${post.slug}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  for (const name of ["cover", "body-1", "body-2", "body-3", "body-4"]) {
    const file = path.join(root, "images", "blog", post.slug, `${name}.png`);
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.readUInt32BE(16), 1672, file);
    assert.equal(bytes.readUInt32BE(20), 941, file);
    imageHashes.add(crypto.createHash("sha256").update(bytes).digest("hex"));
  }
}
const duplicateOutline = buildOutline("<h2>같은 제목</h2><h3>같은 제목</h3><h2 id=\"existing\">기존 제목</h2>");
assert.deepEqual(duplicateOutline.headings.map(({ id }) => id), ["같은-제목", "같은-제목-2", "existing"]);
assert.equal(imageHashes.size, 30);
for (const file of fs.readdirSync(root).filter((name) => name.endsWith(".dc.html"))) {
  const html = read(file);
  assert.equal((html.match(/href="\/blog"/g) || []).length, 2, file);
  assert.doesNotMatch(html, /<a[^>]+class="(?:btn-nav-main|mob-cta)"/, file);
}
const sitemap = read("sitemap.xml");
for (const slug of ["", ...slugs.map((value) => `/${value}`)]) assert.ok(sitemap.includes(`<loc>https://www.geosangschool.co.kr/blog${slug}</loc>`));
console.log("PASS: 6 articles (릴스 3, 스레드 3), 30 distinct images, 7 routes, 11 desktop/mobile menus, SEO and sitemap.");
