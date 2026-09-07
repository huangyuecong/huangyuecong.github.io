# yuecong 个人博客 / 项目作品集

这是一个纯 HTML + CSS + JavaScript 的奶油风多页面个人网站，可以直接部署到 GitHub Pages。

## 页面

- `index.html`：首页、个人简介预览、精选项目、经历时间线
- `about.html`：完整个人介绍、价值观、技能、经历
- `projects.html`：项目展示、搜索、分类筛选、详情弹窗、添加项目
- `contact.html`：邮箱、GitHub、联系表单、常见问题

## 上传到 GitHub Pages

把这四个文件和 `assets` 文件夹中的两个文件上传到仓库根目录：

```text
index.html
about.html
projects.html
contact.html
assets/style.css
assets/script.js
```

然后打开 `https://huangyuecong.github.io`。

## 修改个人资料

在 HTML 文件中搜索并替换：

- `yuecong`
- `yuecong@example.com`
- `https://github.com/huangyuecong`

在 `assets/script.js` 的 `defaultProjects` 数组中修改项目名称、介绍、技术标签和链接。

## 关于“添加项目”

项目页里的“添加项目”可以在当前浏览器中添加项目，并用 `localStorage` 保存；它不会把文件上传到 GitHub 服务器，也不会自动让其他访客看到。要永久公开项目，请把新项目写进 `defaultProjects`，再提交 `assets/script.js` 到 GitHub。

联系表单使用 `mailto:` 打开访客的邮件客户端，不需要后端服务。正式使用前，请把 `yuecong@example.com` 改成你的真实邮箱。
