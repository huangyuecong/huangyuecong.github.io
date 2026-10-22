/* Every page has the same modules; routes reinitialize only page-scoped behavior. */
(() => {
  const app=window.Yuecong,i18n=window.YuecongI18n;
  let controller;
  // History stores category identities, so a later language choice can change labels safely.
  const categories=[
    ['all','全部','All'],
    ['hardware','软硬件开发','Hardware & Software'],
    ['ai','AI 智能体','AI Agents'],
    ['automation','业务自动化','Business Automation'],
    ['notes','经验分享','Field Notes']
  ];
  const categoryKey=value=>categories.find(labels=>labels.includes(value))?.[0]||value;
  app.capturePageState=()=>{
    const inputs={};
    document.querySelectorAll('#projectSearch,#noteSearch').forEach(input=>{inputs[input.id]=input.value;});
    return {inputs,filter:categoryKey(document.querySelector('#projectFilters [data-filter].active')?.dataset.filter)||null};
  };
  app.restorePageState=state=>{
    if(!state)return;
    if(state.filter){
      const key=categoryKey(state.filter);
      [...document.querySelectorAll('#projectFilters [data-filter]')].find(button=>categoryKey(button.dataset.filter)===key)?.click();
    }
    Object.entries(state.inputs||{}).forEach(([id,value])=>{
      if(!['projectSearch','noteSearch'].includes(id))return;
      const input=document.getElementById(id);if(!input)return;
      input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));
    });
  };
  const titles={home:['yuecong · 个人主页','yuecong · Home'],about:['关于我 · yuecong','About · yuecong'],projects:['项目 · yuecong','Projects · yuecong'],notes:['经验分享 · yuecong','Field notes · yuecong'],contact:['联系 · yuecong','Contact · yuecong']};
  app.mountPage=()=>{
    controller?.abort();controller=new AbortController();app.pageSignal=controller.signal;
    i18n.selectData();
    app.renderStory();app.renderNotes();app.renderSite();app.renderInteractions();
    const page=document.body.dataset.page;
    if(!document.querySelector('.story-header')) document.title=(titles[page]||titles.home)[i18n.lang==='en'?1:0];
    document.title=i18n.t(document.title);
    if(i18n.lang==='en')document.title=document.title.replace(' · 经验分享',' · Field notes').replace('未找到项目','Project not found');
    const desc=document.querySelector('meta[name="description"]');
    if(desc&&i18n.lang==='en'&&!document.querySelector('.story-header'))desc.content='yuecong — personal blog, project case studies, and engineering field notes.';
    document.querySelectorAll('[data-lang-toggle]').forEach(button=>button.addEventListener('click',()=>{
      window.YuecongNavigation?.saveState();
      const x=scrollX,y=scrollY,state=app.capturePageState();
      i18n.set(i18n.lang==='en'?'zh':'en');app.mountPage();
      app.restorePageState(state);
      const behavior=document.documentElement.style.scrollBehavior;document.documentElement.style.scrollBehavior='auto';
      scrollTo({left:x,top:y,behavior:'instant'});document.documentElement.style.scrollBehavior=behavior;
      window.YuecongNavigation?.saveState();
    },{signal:controller.signal}));
    window.YuecongMusic.mount();i18n.apply();
  };
  app.mountPage();
})();
