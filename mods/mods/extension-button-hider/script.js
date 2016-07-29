(function() {

  function buttonClick(e) {
    const target = e.target;

    const parent = target.parentNode;
    if (parent) {
      parent.appendChild(target);

      for (let i = 0; i < parent.childNodes.length; i++) {
        const node = parent.childNodes[i];
        if (node && node.classList && !node.classList.contains('extension-button-hider')) {
          if (target.dataset.mode === 'hide') {
            node.classList.add('hider-hide');
          } else {
            node.classList.remove('hider-hide');
          }
        }
      }
      if (target.dataset.mode === 'hide') {
        target.dataset.mode = 'show';
        target.textContent = '>';
        target.title = 'Expand';
      } else {
        target.dataset.mode = 'hide';
        target.textContent = '<';
        target.title = 'Collapse';
      }
    }
  }
  window.addEventListener('load', function() {
    const extensions = document.querySelectorAll('#titlebar .extensions-wrapper');
    let extensionWrapper = null;
    if (extensions) {
      for (var index = 0; index < extensions.length; index++) {
        var element = extensions[index];
        if (element.querySelector('.button-toolbar.browserAction-button')) {
          extensionWrapper = element;
          break;
        }
      }

      if (extensionWrapper) {
        let button = extensionWrapper.querySelector('.extension-button-hider');
        if (!button) {
          button = document.createElement('button');
          button.className = 'extension-button-hider button-toolbar browserAction-button';
          button.dataset.mode = 'hide';
          button.textContent = '<';
          button.addEventListener('click', buttonClick, false);
          extensionWrapper.appendChild(button);
        }
      }
    }
  }, false);
}());