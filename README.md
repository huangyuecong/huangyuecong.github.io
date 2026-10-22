# yuecong 个人博客

纯 HTML / CSS / JavaScript 静态网站，可部署到 GitHub Pages。本目录是可上传的优化版本；本地文件更新不等于已经线上发布。

## 本次功能

- 项目共 7 篇，新增「客户协作台 CRM」，中文与英文分别配工作台示意图。原六篇改为工程案例，前置技术栈、三个核心难点、架构、执行流程、ER / 逻辑关联图、关键代码和验证状态。
- CRM 依据提供的技术说明与界面编写；Mem0、WeKnora、Langfuse 写为后端适配已有、运行联调待确认。示意图不是线上截图，逻辑关联不是物理外键。
- 项目文章移除重复的阅读核对清单，保留关键实现、代码和测试说明。播放器的播放键固定为圆形，播放模式和歌单放在卡片右上角；手机及较矮窗口默认收起文章侧栏的播放器。
- 中英文切换覆盖页面、导航、项目与经验文章、图表说明、表格、搜索反馈和播放器；语言选择保存在当前浏览器，站内跳转继续使用所选语言。
- 通过 HTTP 访问时，站内页面使用无刷新导航，支持浏览器前进、后退及阅读位置恢复；同一播放器持续工作，切换页面不打断音乐。
- 播放器改为 Chris Zabriskie 的真实氛围音乐：**Cylinder One、Cylinder Four、Cylinder Nine**。支持上一首 / 下一首、播放列表、进度、音量、顺序播放、随机播放和单曲循环。首次播放需主动点击，刷新页面后也需点击继续。
- 可选择本机音频试听，文件不会上传，刷新后不保留本机音频。收藏、主题与播放器设置只保存在访客自己的浏览器中。

音乐来自作者的 [Cylinders 专辑](https://chriszabriskie.com/cylinders/)，按 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 使用，音频未经编辑。请保留播放器中的署名链接，以及 `assets/audio/LICENSE.md` 和三个音频文件；完整音源与授权说明见该文件。

## 本地预览

在本目录打开终端，运行：

```powershell
python -m http.server 8000
```

然后访问 <http://localhost:8000/>。Windows 如使用 Python Launcher，可运行 `py -m http.server 8000`。请通过本地服务预览，以验证无刷新导航与连续播放；直接双击 HTML 使用的是普通页面跳转。

## 部署到 GitHub Pages

1. 打开仓库 `huangyuecong/huangyuecong.github.io`，将**本文件夹里面的全部内容**上传到仓库根目录，包括全部 HTML、整个 `assets/` 目录和隐藏文件 `.nojekyll`。不要在仓库中再套一层 `yuecong-blog/` 文件夹。
2. 在仓库 **Settings → Pages** 选择 **Deploy from a branch**，指定上传所在分支（通常为 `main`）和 **/ (root)**，保存配置。
3. 等 GitHub Pages 构建成功后访问 <https://huangyuecong.github.io/>，检查语言切换、项目阅读、前进后退与音乐。以后修改源文件后，需要再次提交到仓库，线上才会更新。

## 编辑位置

| 内容 | 源文件 |
| --- | --- |
| 首页、关于、项目目录、经验目录、联系、项目阅读外壳 | 根目录的六个 `.html` 文件 |
| 项目目录与概览 | `assets/projects-data.js` |
| 项目详细中文文章 | `assets/project-details.js` |
| 项目详细英文文章 | `assets/project-details.en.js` |
| 经验分享与技术补充 | `assets/notes-data.js`、`assets/technical-data.js` |
| 英文项目概览、经验与技术内容 | `assets/content.en.js` |
| CRM 中英文正文与图 | `assets/crm-data.js`、`assets/crm-data.en.js`、`assets/images/` |
| 工程摘要、命名与短介绍 | `assets/engineering-data.js` |
| 架构图与实体关系图 | `assets/architecture-diagrams.js`、`assets/engineering-diagrams.js` |
| 界面文字与语言切换 | `assets/i18n.js` |
| 页面布局、颜色、阅读样式 | `assets/style.css`、`assets/enhancements.css` |
| 播放列表与音频 | `assets/player.js`、`assets/audio/` |
| 无刷新导航与页面初始化 | `assets/navigation.js`、`assets/app.js` |

修改文章时同步维护中英文，保留项目 ID、数据字段与数组结构。HarmonyOS 与 Android 银龄守护是两个独立项目。网页只发布介绍内容；业务源码、凭证、数据库和客户素材不应放入站点。

联系邮箱：435783336@qq.com。留言表单会打开访客的邮件客户端，不提供服务器留言存储。项目文章的测试状态依据已有材料说明，本次改写未运行原业务工程测试。

## 写法参考

只参考表达方式，项目实现和验证状态按现有材料编写，未移用他人的项目指标或案例结果。

- [Ben Hoyt · pyast64](https://benhoyt.com/writings/pyast64/)：用一条输入贯穿处理过程，交代约束与测量条件。
- [Julia Evans · Mess with DNS](https://jvns.ca/blog/2021/12/15/mess-with-dns/)：用实际问题解释技术取舍，让图和验证对应具体机制。
- [Simon Willison · LLM 0.26](https://simonwillison.net/2025/May/27/llm-tools/)：展示工具调用、失败恢复与版本边界。
