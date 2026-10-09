/* Shared header/footer and small helpers. Pages set <body data-root="" or "../"> */
(function(){
  const root = document.body.dataset.root || "";
  const page = document.body.dataset.page || "";
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="skip" href="#main">Skip to content</a>
    <div class="wrap">
      <a class="brand" href="${root}index.html" aria-label="MORRC home">
        <span class="brand-mark">MORRC</span>
        <span class="brand-text">McGill Ortho Resident Research Curriculum</span>
      </a>
      <nav class="nav" aria-label="Main">
        <a href="${root}index.html#about" ${page==="home"?'aria-current="page"':''}>About</a>
        <a href="${root}index.html#catalogue">Modules</a>
        <a href="${root}index.html#progress">My progress</a>
      </nav>
    </div>`;
  document.body.prepend(header);
  const draft = document.createElement("div");
  draft.className = "draft-banner"; draft.setAttribute("role","note");
  draft.textContent = "Draft preview, content under faculty review, not yet for resident use";
  document.body.prepend(draft);
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `<div class="wrap">
    <p><strong>MORRC</strong> · McGill Orthopaedics Resident Research Committee and Curriculum · v1 (pilot), October 2026</p>
    <p class="small">Educational resource for McGill orthopaedic surgery residents. Progress is saved only in this browser on this device. Content is for teaching research methods and is not clinical guidance. Not an official McGill University website.</p>
  </div>`;
  document.body.append(footer);

  MORRC.h = function(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); };
  MORRC.shuffle = function(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  MORRC.tierClass = t => "t"+t;
})();
