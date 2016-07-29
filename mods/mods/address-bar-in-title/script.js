(function() {
  window.addEventListener('load', function() {
   
    const toolbar = document.querySelector('#main .toolbar.toolbar-addressbar');
    if (toolbar) {
      const titlebar = document.getElementById('titlebar');
      const pagetitle = document.getElementById('pagetitle');
      if (titlebar) {
        if (pagetitle) {
          titlebar.removeChild(pagetitle);
        }
        titlebar.appendChild(toolbar);
      }
    }
  }, false);
}());