(function() {
  console.log('autohide');
  window.addEventListener('load', function() {

    const browser = document.getElementById('browser');
    const main = document.getElementById('main');
    const placeholderId = 'addressfield-hover-placeholder';

    const toolbar = document.querySelector('#main .toolbar');

    const header = document.getElementById('header');
    const tabsContainer = document.getElementById('tabs-container');

    function showBar() {
      if (toolbar) {
        document.body.style.setProperty('--address-bar-height', toolbar.getBoundingClientRect().height + 'px');
        if (tabsContainer) {
          document.body.style.setProperty('--tab-container-height', tabsContainer.getBoundingClientRect().height + 'px');
        }
        toolbar.classList.add('shown');

      }
    }

    function hideBar() {
      if (toolbar) {
        document.body.style.setProperty('--address-bar-height', toolbar.getBoundingClientRect().height + 'px');
        if (tabsContainer) {
          document.body.style.setProperty('--tab-container-height', tabsContainer.getBoundingClientRect().height + 'px');
        }
        toolbar.classList.remove('shown');
      }
    }

    function unfocusBar() {
      if (toolbar) {
        document.body.style.setProperty('--address-bar-height', toolbar.getBoundingClientRect().height + 'px');
        if (tabsContainer) {
          document.body.style.setProperty('--tab-container-height', tabsContainer.getBoundingClientRect().height + 'px');
        }
        toolbar.classList.remove('focused');
      }
    }

    function focusBar() {
      if (toolbar) {
        document.body.style.setProperty('--address-bar-height', toolbar.getBoundingClientRect().height + 'px');
        if (tabsContainer) {
          document.body.style.setProperty('--tab-container-height', tabsContainer.getBoundingClientRect().height + 'px');
        }
        toolbar.classList.add('focused');
      }
    }


    if (header) {
      header.addEventListener('mouseenter', () => {
        if (!browser.classList.contains('address-bottom')) {
          showBar();
        }
      }, false);
      header.addEventListener('mouseleave', () => {
        if (!browser.classList.contains('address-bottom')) {
          hideBar();
        }
      }, false);
    }

    const addressfields = document.querySelectorAll('#main .toolbar.toolbar-addressbar input');
    if (addressfields) {
      for (let i = 0; i < addressfields.length; i++) {
        addressfields[i].addEventListener('focus', focusBar, false);
        addressfields[i].addEventListener('blur', unfocusBar, false);
      }
    }

    if (tabsContainer) {
      tabsContainer.addEventListener('mouseenter', () => {
        if (browser.classList.contains('address-bottom')) {
          showBar();
        }
      }, false);
      tabsContainer.addEventListener('mouseleave', () => {
        if (browser.classList.contains('address-bottom')) {
          hideBar();
        }
      }, false);
    }

    function createHoverPlaceholder() {
      const hoverPlaceholder = document.getElementById(placeholderId);
      if (!hoverPlaceholder) {

        if (main) {
          const placeholder = document.createElement('div');
          placeholder.id = placeholderId;
          placeholder.addEventListener('mouseenter', showBar, false);
          placeholder.addEventListener('mouseleave', hideBar, false);
          main.appendChild(placeholder);
        }
      }
    }
    createHoverPlaceholder();
  }, false);
}());