
(function(){
  var y = new Date().getFullYear();
  var yf = document.querySelectorAll('#year');
  for(var i=0;i<yf.length;i++) yf[i].textContent = y;

  var loaderWrap = document.getElementById('loader-wrap');
  var progressBar = document.getElementById('progressBar');
  var progressPercent = document.getElementById('progressPercent');
  var site = document.getElementById('site');

  const DURATION = 1200;
  const INTERVAL = 16;
  const TOTAL_STEPS = DURATION / INTERVAL;
  let stepCount = 0;

  var step = function(){
    stepCount++;
    const progress = Math.min(100, (stepCount / TOTAL_STEPS) * 100);
    const roundedProgress = Math.round(progress);

    if(progressBar) progressBar.style.width = progress + '%';
    if(progressPercent) progressPercent.textContent = roundedProgress + '%';

    if(stepCount < TOTAL_STEPS){
      setTimeout(step, INTERVAL);
    } else {
      setTimeout(function(){
        var headerImg = document.querySelector('.brand img');
        if(headerImg) headerImg.classList.add('fly-up');
        document.body.classList.add('show-site');
        loaderWrap.style.transition = 'opacity .6s ease';
        loaderWrap.style.opacity = '0';
        setTimeout(function(){ 
          loaderWrap.style.display = 'none'; 
        }, 600);
      }, 100);
    }
  };
  setTimeout(step, 50);

  function updateLogoTheme() {
    const isLight = document.documentElement.classList.contains('light');
    const logos = document.querySelectorAll('img[data-light][data-dark]');
    logos.forEach(img => {
      img.src = isLight ? img.getAttribute('data-light') : img.getAttribute('data-dark');
    });
  }

  updateLogoTheme();

  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  function applyTheme(name){
    if(name === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    localStorage.setItem('site_theme', name);
    if(themeIcon) themeIcon.textContent = (name === 'light') ? '☀️' : '🌙';
    if(themeToggle) themeToggle.setAttribute('aria-pressed', name === 'light');
  }
  var saved = localStorage.getItem('site_theme');
  if(saved) applyTheme(saved);
  else {
    var prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    applyTheme(prefers === 'light' ? 'light' : 'dark');
  }
  if(themeToggle){
    themeToggle.addEventListener('click', function(){
      var cur = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      var next = cur === 'light' ? 'dark' : 'light';
      applyTheme(next);
      setTimeout(updateLogoTheme, 50);
    });
  }

  // Service form toggles: show/hide top and bottom forms
  var reqTopBtn = document.getElementById('requestServiceBtn');
  var reqBottomBtn = document.getElementById('requestServiceBtnBottom');
  var wrapTop = document.getElementById('serviceFormWrapTop');
  var wrapBottom = document.getElementById('serviceFormWrapBottom');

  function toggleWrap(wrap){
    if(!wrap) return;
    var visible = window.getComputedStyle(wrap).display !== 'none';
    if(visible) wrap.style.display = 'none';
    else {
      wrap.style.display = 'block';
      try{ wrap.scrollIntoView({behavior:'smooth', block:'center'}); }catch(e){}
    }
  }

  if(reqTopBtn && wrapTop) reqTopBtn.addEventListener('click', function(){ toggleWrap(wrapTop); });
  if(reqBottomBtn && wrapBottom) reqBottomBtn.addEventListener('click', function(){ toggleWrap(wrapBottom); });

  // Cancel buttons inside the top form
  var cancelBtns = document.querySelectorAll('.serviceCancel');
  cancelBtns.forEach(function(btn){
    btn.addEventListener('click', function(e){
      var parent = e.target.closest('#serviceFormWrapTop, #serviceFormWrapBottom');
      if(parent) parent.style.display = 'none';
    });
  });

  // Simple submit UX: immediately show confirmation and disable the submit button briefly
  function showSimpleToast(msg){
    var t = document.getElementById('formToast');
    if(!t){
      t = document.createElement('div');
      t.id = 'formToast';
      t.style.position = 'fixed';
      t.style.left = '50%';
      t.style.transform = 'translateX(-50%)';
      t.style.bottom = '24px';
      t.style.padding = '10px 16px';
      t.style.borderRadius = '8px';
      t.style.color = '#fff';
      t.style.background = '#16a34a';
      t.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
      t.style.zIndex = 9999;
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._to);
    t._to = setTimeout(function(){ t.style.opacity = '0'; }, 3000);
  }

  var serviceForms = document.querySelectorAll('form.service-form');
  serviceForms.forEach(function(form){
    form.addEventListener('submit', function(e){
      var submitBtn = form.querySelector('button[type="submit"]');
      if(submitBtn && submitBtn.disabled){
        e.preventDefault();
        return;
      }

      if(submitBtn){
        submitBtn.disabled = true;
        submitBtn.dataset.origText = submitBtn.textContent;
        submitBtn.textContent = 'تم الارسال وشكرا';
      }
      var note = form.querySelector('.service-form-note');
      if(note) note.textContent = 'تم الارسال وشكرا';
      showSimpleToast('تم الارسال وشكرا');

      // keep normal submit (targeted at hidden iframe) so data still posts.
      // re-enable button after 7 seconds
      setTimeout(function(){
        if(submitBtn){
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.origText || 'إرسال';
        }
        if(note) note.textContent = 'سيتم التواصل معك لتأكيد تفاصيل الطلب خلال 24 ساعة.';
      }, 7000);
    });
  });
})();
