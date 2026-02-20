// โหลด header.html แล้วแทรกลงใน <div id="header-container"></div>
(function(){
  const containerId = 'header-container';

  // Build a list of candidate URLs to try. This attempts:
  // - local `header.html` (same folder)
  // - progressively up the folder tree (`../header.html`, `../../header.html`, ...)
  // - an absolute header at the site root folder (encoded)
  const candidates = [];
  candidates.push('header.html', './header.html');

  // add parent-level candidates up to 6 levels
  for(let i=1;i<=6;i++){
    let rel = '';
    for(let j=0;j<i;j++) rel += '../';
    rel += 'header.html';
    candidates.push(rel);
  }

  try{
    const parts = location.pathname.split('/').filter(Boolean);
    if(parts.length > 0){
      // first segment is usually the site folder, encode it (handles spaces)
      const first = encodeURIComponent(parts[0]);
      candidates.push(location.origin + '/' + first + '/header.html');
    }
    // also try header at root
    candidates.push(location.origin + '/header.html');
  }catch(e){
    // ignore
  }

  function tryFetch(list){
    if(!list.length) return Promise.reject('no-header-paths');
    const url = list.shift();
    return fetch(url, {cache:'no-cache'}).then(r=>{
      if(!r.ok) return tryFetch(list);
      return r.text();
    }).catch(()=>tryFetch(list));
  }

  function insert(html){
    const holder = document.getElementById(containerId);
    if(!holder){
      console.warn('header container not found:', containerId);
      return;
    }
    holder.innerHTML = html;
  }

  function init(){
    tryFetch(candidates.slice()).then(insert).catch(err=>{
      console.warn('Load header failed:', err);
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();