(function () {
  var btn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
  }

  var tabs = document.querySelector('[data-tabs]');
  if (tabs) {
    var list = tabs.querySelector('[role="tablist"]');
    var items = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      items.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    list.hidden = false;
    tabs.classList.add('is-ready');
    items.forEach(function (t) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var i = items.indexOf(t);
        if (e.key === 'ArrowRight') select(items[(i + 1) % items.length], true);
        else if (e.key === 'ArrowLeft') select(items[(i - 1 + items.length) % items.length], true);
        else if (e.key === 'Home') select(items[0], true);
        else if (e.key === 'End') select(items[items.length - 1], true);
        else return;
        e.preventDefault();
      });
    });
    select(items[0], false);
  }

  var copy = document.querySelector('[data-copy]');
  if (copy) {
    var status = document.querySelector('.copy-status');
    copy.addEventListener('click', function () {
      var text = copy.getAttribute('data-copy');
      var done = function (msg) {
        status.textContent = msg;
        setTimeout(function () { status.textContent = ''; }, 2500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done('Copiado'); }, function () { done('Não foi possível copiar'); });
      } else {
        done('Não foi possível copiar');
      }
    });
  }
})();
