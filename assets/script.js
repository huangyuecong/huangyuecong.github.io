/*
  yuecong 个人博客 / 作品集
  你可以在 defaultProjects 中修改项目名称、介绍、标签和链接。
  “添加项目”弹窗会把新项目保存在当前浏览器 localStorage 中；
  如果要让所有访客看到，请把项目写入 defaultProjects 后提交到 GitHub。
*/

const defaultProjects = [
  { id: "knowledge-base", title: "个人知识库", description: "把阅读、灵感和经验整理成自己的第二大脑。", tech: ["Next.js", "Notion API"], category: "工具", link: "https://github.com/huangyuecong", tone: "sage", featured: true },
  { id: "task-flow", title: "待办清单应用", description: "一个简洁优雅的待办清单，支持多端同步思路。", tech: ["Vue 3", "TypeScript"], category: "开发", link: "https://github.com/huangyuecong", tone: "blue", featured: true },
  { id: "photo-notes", title: "静谧摄影博客", description: "记录生活与摄影作品的个人博客站点。", tech: ["Astro", "Markdown"], category: "设计", link: "https://huangyuecong.github.io", tone: "apricot", featured: true },
  { id: "weather-now", title: "天气预报应用", description: "获取实时天气与未来预报的轻量应用。", tech: ["React", "OpenWeather"], category: "开发", link: "https://github.com/huangyuecong", tone: "sky", featured: false }
];

const storageKey = "yuecong-custom-projects";
const themeKey = "yuecong-theme";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
const safeLink = (value) => /^(https?:\/\/|mailto:)/i.test(String(value || "")) ? String(value) : "#";
const readCustomProjects = () => {
  try { const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]"); return Array.isArray(parsed) ? parsed : []; }
  catch { return []; }
};
const getProjects = () => [...defaultProjects, ...readCustomProjects()];

function renderProjectCard(project) {
  const image = project.image ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} 项目封面" />` : `<div class="thumb-art"></div>`;
  const tags = (project.tech || []).slice(0, 4).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  const link = safeLink(project.link);
  return `<article class="project-card">
    <div class="project-thumb thumb-${escapeHtml(project.tone || "sage")}">${image}</div>
    <div class="project-info"><div class="project-topline"><span class="project-category">${escapeHtml(project.category || "项目")}</span><span class="card-kicker">WORK</span></div>
      <h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p><div class="tag-list">${tags}</div>
      <div class="project-actions"><button class="small-button" type="button" data-project-detail="${escapeHtml(project.id)}">查看详情 <span>→</span></button><a class="small-button primary" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">项目链接 ↗</a></div>
    </div></article>`;
}

function renderProjectList(target, projects) {
  if (!target) return;
  target.innerHTML = projects.map(renderProjectCard).join("");
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

function setupProjectModals() {
  const addModal = document.getElementById("projectModal");
  const detailModal = document.getElementById("projectDetailModal");
  const form = document.getElementById("projectForm");
  const openButton = document.getElementById("openAddProject");
  if (!addModal || !form || !openButton) return;
  openButton.addEventListener("click", () => addModal.showModal());
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => button.closest("dialog")?.close()));
  [addModal, detailModal].forEach((modal) => modal?.addEventListener("click", (event) => { if (event.target === modal) modal.close(); }));

  document.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-project-detail]");
    if (!detailButton || !detailModal) return;
    const project = getProjects().find((item) => item.id === detailButton.dataset.projectDetail);
    if (!project) return;
    const tags = (project.tech || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const image = project.image ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} 项目封面" />` : `<div class="thumb-art"></div>`;
    document.getElementById("projectDetailContent").innerHTML = `<p class="eyebrow">PROJECT DETAIL · ${escapeHtml(project.category || "WORK")}</p><h2>${escapeHtml(project.title)}</h2><div class="project-thumb detail-thumb thumb-${escapeHtml(project.tone || "sage")}">${image}</div><p class="detail-copy">${escapeHtml(project.description)}</p><div class="detail-meta">${tags}</div><a class="button button-primary detail-link" href="${escapeHtml(safeLink(project.link))}" target="_blank" rel="noreferrer">打开项目链接 ↗</a>`;
    detailModal.showModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const file = data.get("image");
    const finish = (image = "") => {
      const newProject = { id: `custom-${Date.now()}`, title: data.get("title"), description: data.get("description"), category: data.get("category"), tech: String(data.get("tech") || "").split(",").map((item) => item.trim()).filter(Boolean), link: data.get("link") || "#", tone: ["sage", "blue", "apricot", "sky"][Math.floor(Math.random() * 4)], image, featured: false };
      localStorage.setItem(storageKey, JSON.stringify([...readCustomProjects(), newProject]));
      form.reset(); addModal.close(); setupProjectsPage(); showToast("项目已添加到当前浏览器");
    };
    if (file && file.size) { const reader = new FileReader(); reader.onload = () => finish(String(reader.result)); reader.readAsDataURL(file); } else finish();
  });
}

function setupTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem(themeKey);
  if (saved) root.dataset.theme = saved;
  const update = () => {
    const dark = root.dataset.theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => { button.querySelector(".theme-icon")?.replaceChildren(document.createTextNode(dark ? "☀" : "☾")); button.querySelector(".theme-label")?.replaceChildren(document.createTextNode(dark ? "浅色模式" : "深色模式")); });
  };
  update();
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => button.addEventListener("click", () => { root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark"; localStorage.setItem(themeKey, root.dataset.theme); update(); }));
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
setupProjectModals();
setupContact();
setupScrollHelpers();
