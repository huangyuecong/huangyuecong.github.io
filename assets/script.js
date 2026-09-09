/* 项目内容统一来自 projects-data.js，访客只读。 */
const defaultProjects = window.projectStories || [];
const themeKey = "yuecong-theme";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
const safeLink = (value) => /^(https?:\/\/|mailto:)/i.test(String(value || "")) ? String(value) : "#";
const getProjects = () => [...defaultProjects, ...(window.fieldNotes || [])];

function renderProjectCard(project) {
  if(project.category === "经验分享") return `<article class="project-card editorial-card"><div class="project-info"><p class="eyebrow">工程手记</p><h3><a href="notes.html?article=${encodeURIComponent(project.id)}">${escapeHtml(project.title)}</a></h3><p>${escapeHtml(project.description)}</p><a class="small-button" href="notes.html?article=${encodeURIComponent(project.id)}">阅读分享 →</a></div></article>`;
  const image = `<div class="project-cover"><span>${escapeHtml(project.kicker)}</span><strong>${escapeHtml(project.title.split("：")[0])}</strong><small>项目笔记 / yuecong</small></div>`;
  const tags = (project.tech || []).slice(0, 4).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  const link = project.category === "经验分享" ? `notes.html?article=${encodeURIComponent(project.id)}` : `project.html?id=${encodeURIComponent(project.id)}`;
  return `<article class="project-card">
    <div class="project-thumb thumb-${escapeHtml(project.tone || "sage")}">${image}</div>
    <div class="project-info"><div class="project-topline"><span class="project-category">${escapeHtml(project.category || "项目")}</span><span class="card-kicker">WORK</span></div>
      <h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p><div class="tag-list">${tags}</div>
      <div class="project-actions"><a class="small-button primary" href="${link}">阅读全文 <span>→</span></a><button type="button" class="bookmark-button" data-bookmark="${escapeHtml(project.id)}" aria-pressed="false">收藏</button></div>
    </div></article>`;
}

function renderProjectList(target, projects) {
  if (!target) return;
  target.innerHTML = projects.map(renderProjectCard).join("");
  document.dispatchEvent(new Event("site:cards-rendered"));
  const empty = document.getElementById("emptyProjects");
  if (empty) empty.hidden = projects.length !== 0;
}

function setupProjectsPage() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;
  const search = document.getElementById("projectSearch");
  const filters = document.getElementById("projectFilters");
  const categories = ["全部", ...new Set(getProjects().map((project) => project.category || "项目"))];
  let activeFilter = "全部";
  filters.innerHTML = categories.map((category) => `<button class="filter-button${category === "全部" ? " active" : ""}" type="button" data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");

  const refresh = () => {
    const keyword = (search.value || "").trim().toLowerCase();
    const result = getProjects().filter((project) => {
      const haystack = [project.title, project.description, project.category, ...(project.tech || [])].join(" ").toLowerCase();
      return (activeFilter === "全部" || project.category === activeFilter) && (!keyword || haystack.includes(keyword));
    });
    renderProjectList(grid, result);
  };
  search.addEventListener("input", refresh);
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    filters.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
    refresh();
  });
  refresh();
}

function setupFeaturedProjects() {
  const target = document.getElementById("featuredProjects");
  if (target) renderProjectList(target, getProjects().filter((project) => project.featured).slice(0, 3));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setupTheme() {
  const root = document.documentElement;
  let saved; try { saved = localStorage.getItem(themeKey); } catch {}
  if (saved) root.dataset.theme = saved;
  const update = () => {
    const dark = root.dataset.theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => { button.querySelector(".theme-icon")?.replaceChildren(document.createTextNode(dark ? "☀" : "☾")); button.querySelector(".theme-label")?.replaceChildren(document.createTextNode(dark ? "浅色模式" : "深色模式")); });
  };
  update();
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => button.addEventListener("click", () => { root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark"; try { localStorage.setItem(themeKey, root.dataset.theme); } catch {} update(); }));
}

function setupNavigation() {
  const page = document.body.dataset.page;
  document.querySelector(`[data-nav="${page}"]`)?.setAttribute("aria-current", "page");
  document.querySelector("[data-menu-open]")?.addEventListener("click", () => document.body.classList.add("sidebar-open"));
  document.querySelectorAll("[data-menu-close], .main-nav a").forEach((item) => item.addEventListener("click", () => document.body.classList.remove("sidebar-open")));
}

function setupContact() {
  const form = document.getElementById("contactForm");
  if (form) form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form); const email = form.dataset.contactEmail || "435783336@qq.com";
    const subject = encodeURIComponent(`来自 ${data.get("name")} 的留言`); const body = encodeURIComponent(`${data.get("message")}\n\n回复邮箱：${data.get("email")}`);
    document.getElementById("formStatus").textContent = "正在打开邮件客户端……";
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
  document.querySelector("[data-copy-link]")?.addEventListener("click", async () => { try { await navigator.clipboard.writeText("https://huangyuecong.github.io"); showToast("网站链接已复制"); } catch { showToast("请手动复制网站地址"); } });
}

function setupScrollHelpers() {
  const top = document.querySelector("[data-back-to-top]");
  window.addEventListener("scroll", () => top?.classList.toggle("visible", window.scrollY > 360), { passive: true });
  top?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .08 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  document.querySelectorAll("[data-year]").forEach((item) => item.textContent = new Date().getFullYear());
}

setupTheme();
setupNavigation();
setupFeaturedProjects();
setupProjectsPage();
setupContact();
setupScrollHelpers();
