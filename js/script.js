document.addEventListener("DOMContentLoaded", function() {
  // Handler when the DOM is fully loaded

  // page init
  function initPage() {
    FontResize.init();
  }

  // font resize script
  FontResize = {
    options: {
      maxStep: 1.5,
      defaultFS: 1.2,
      resizeStep: 0.1,
      resizeHolder: 'body',
      cookieName: 'fontResizeCookie'
    },
    init: function() {
      this.runningLocal = (location.protocol.indexOf('file:') === 0);
      this.setDefaultScaling();
      this.addDefaultHandlers();
    },
    addDefaultHandlers: function() {
      this.addHandler('increase', 'inc');
      this.addHandler('decrease', 'dec');
      this.addHandler('reset');
    },
    setDefaultScaling: function() {
      if (this.options.resizeHolder == 'html') {
        this.resizeHolder = document.documentElement;
      } else {
        this.resizeHolder = document.body;
      }
      var cSize = this.getCookie(this.options.cookieName);
      if (!this.runningLocal && cSize) {
        this.fSize = parseFloat(cSize, 10);
      } else {
        this.fSize = this.options.defaultFS;
      }
      this.changeSize();
    },
    changeSize: function(direction) {
      if (typeof direction !== 'undefined') {
        if (direction == 1) {
          this.fSize += this.options.resizeStep;
          if (this.fSize > this.options.defaultFS * this.options.maxStep) this.fSize = this.options.defaultFS * this.options.maxStep;
        } else if (direction == -1) {
          this.fSize -= this.options.resizeStep;
          if (this.fSize < this.options.defaultFS / this.options.maxStep) this.fSize = this.options.defaultFS / this.options.maxStep;
        } else {
          this.fSize = this.options.defaultFS;
        }
      }
      this.resizeHolder.style.fontSize = this.fSize + 'em';
      this.updateCookie(this.fSize.toFixed(2));

      // refresh Cufon if present
      if (typeof Cufon !== 'undefined' && typeof Cufon.refresh === 'function') {
        Cufon.refresh();
      }
      return false;
    },
    addHandler: function(obj, type) {
      if (typeof obj === 'string') {
        obj = document.getElementById(obj);
      }
      if (obj && obj.tagName) {
        switch (type) {
          case 'inc':
            obj.onclick = this.bind(this.changeSize, this, [1]);
            break;
          case 'dec':
            obj.onclick = this.bind(this.changeSize, this, [-1]);
            break;
          default:
            obj.onclick = this.bind(this.changeSize, this, [0]);
        }
      }
    },
    updateCookie: function(scaleLevel) {
      if (!this.runningLocal) {
        this.setCookie(this.options.cookieName, scaleLevel);
      }
    },
    getCookie: function(name) {
      var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    setCookie: function(name, value) {
      var exp = new Date();
      exp.setTime(exp.getTime() + (30 * 24 * 60 * 60 * 1000));
      document.cookie = name + '=' + value + ';' + 'expires=' + exp.toGMTString() + ';' + 'path=/';
    },
    bind: function(fn, scope, args) {
      return function() {
        return fn.apply(scope, args || arguments);
      };
    }
  };

  if (window.addEventListener) window.addEventListener('load', initPage, false);
  else if (window.attachEvent) window.attachEvent('onload', initPage);

  // document.getElementById('toggle').addEventListener('click', function(e) {
  //   document.getElementById('tuckedMenu').classList.toggle('custom-menu-tucked');
  //   document.getElementById('toggle').classList.toggle('x');
  // })
});
