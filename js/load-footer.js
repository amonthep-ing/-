(function(){
  const containerId = 'footer-container';
  const inlineFooter = `
    <footer class="site-footer">
      <div class="container">
        <p>© อุทยานแห่งชาติภูกระดึง — สถานที่ติดต่อ: หมู่ที่ 1 บ้านศรีฐาน ต.ศรีฐาน อ.ภูกระดึง จ.เลย 42180</p>
        <p>โทร: 042-810833, 042-810834 &nbsp;|&nbsp; อีเมล์: pkd_11@hotmail.co.th</p>
      </div>
    </footer>
  `;
  const cssText = `.site-footer{background:#333;color:#fff;padding:1rem;text-align:center}.site-footer .container{max-width:980px;margin:0 auto}`;

  function ensureContainer(){
    let c = document.getElementById(containerId);
    if(!c){
      c = document.createElement('div');
      c.id = containerId;
      document.body.appendChild(c);
    }
    return c;
  }

  function insert(html){
    const c = ensureContainer();
    c.innerHTML = html;
  }

  function addInlineCSS(){
    if(!document.getElementById('site-footer-style')){
      const s = document.createElement('style');
      s.id = 'site-footer-style';
      s.appendChild(document.createTextNode(cssText));
      (document.head || document.documentElement).appendChild(s);
    }
  }

  function tryFetchCandidates(candidates){
    if(!candidates.length) return Promise.reject('no-candidates');
    const url = candidates.shift();
    return fetch(url, {cache: 'no-cache'}).then(r => {
      if(!r.ok) return tryFetchCandidates(candidates);
      return r.text();
    }).catch(() => tryFetchCandidates(candidates));
  }

  function init(){
    // try relative paths (covers different URL encodings / folder setups)
    const pathBase = location.pathname.replace(/\/[^\/]*$/, '/');
    const candidates = ['footer.html', './footer.html', pathBase + 'footer.html'];
    tryFetchCandidates(candidates.slice())
      .then(html => {
        insert(html);
        addInlineCSS(); // footer.html may include its own styles; ensure basic styling exists
      })
      .catch(err => {
        console.warn('Load footer failed, using inline fallback:', err);
        insert(inlineFooter);
        addInlineCSS();
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();