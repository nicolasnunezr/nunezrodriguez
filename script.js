(function () {
  'use strict';

  var emailLink = document.querySelector('.email-link');
  var toast = document.querySelector('.copied-toast');
  var toastTimer;

  if (emailLink) {
    emailLink.addEventListener('click', function (e) {
      var addr = emailLink.getAttribute('data-email');
      e.preventDefault();
      copyText(addr).then(function () {
        flash('Copied');
      }).catch(function () {
        window.location.href = 'mailto:' + addr;
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (err) {
        reject(err);
      }
    });
  }

  function flash(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 1600);
  }

  var hoverables = document.querySelectorAll('.hoverable');
  var hasHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  function hasRealDetail(el) {
    var inner = el.querySelector('.detail > div');
    if (!inner) return false;
    var text = inner.textContent.trim();
    return text.length > 0 && text !== '.';
  }

  function setExpanded(el, open) {
    if (open) {
      el.classList.add('show-detail');
      el.setAttribute('aria-expanded', 'true');
    } else {
      el.classList.remove('show-detail');
      el.setAttribute('aria-expanded', 'false');
    }
  }

  hoverables.forEach(function (el) {
    if (!hasRealDetail(el)) {
      el.classList.remove('hoverable');
      el.removeAttribute('tabindex');
      return;
    }
    el.setAttribute('aria-expanded', 'false');
  });

  var interactive = document.querySelectorAll('.hoverable');
  var lang = (document.documentElement.lang || navigator.language || 'en').toLowerCase();
  var hintLabel = lang.indexOf('es') === 0 ? 'Toca para más' : 'Tap for more';

  interactive.forEach(function (el) {
    el.classList.add('has-detail');

    var hint = document.createElement('p');
    hint.className = 'detail-hint';
    hint.textContent = hintLabel;

    var head = el.querySelector('.role-head') || el.querySelector('.cv-head');
    if (head) {
      head.insertAdjacentElement('afterend', hint);
    }
  });

  if (hasHover) {
    interactive.forEach(function (el) {
      var open = function () { setExpanded(el, true); };
      var close = function () { setExpanded(el, false); };
      el.addEventListener('mouseenter', open);
      el.addEventListener('mouseleave', close);
      el.addEventListener('focusin', open);
      el.addEventListener('focusout', close);
    });
  } else {
    interactive.forEach(function (el) {
      el.addEventListener('click', function () {
        var isOpen = el.classList.contains('show-detail');
        interactive.forEach(function (other) {
          setExpanded(other, false);
        });
        if (!isOpen) {
          setExpanded(el, true);
        }
      });
    });
  }
})();
