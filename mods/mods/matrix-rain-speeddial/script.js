(function() {
  window.addEventListener('load', function() {

    function checkIfStartPageActive() {
      const startpage = document.querySelector('#webpage-stack .webpageview.visible .internal-page .startpage');
      if (startpage) {
        modifyStartPage(startpage);
      }
    }

    function observeWebpageViewClass(nodes) {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        webpageViewObserver.observe(node, {
          attributeFilter: ['class']
        });
      }
    }

    function modifyStartPage(startpage) {
      const content = startpage.querySelector('.startpage-content');

      if (content) {
        if (!content.querySelector('.matrix-canvas')) {
          if (!window.MatrixRainCanvas) {
            window.MatrixRainCanvas = document.createElement('canvas');
            window.MatrixRainCanvas.className = 'matrix-canvas';
            content.appendChild(window.MatrixRainCanvas);
            window.MatrixRainInstance = new MatrixRain(window.MatrixRainCanvas);
            window.MatrixRainInstance.startPrepared();
            window.addEventListener('resize', () => window.MatrixRainInstance.updateSize());
          }
          const canvas = window.MatrixRainCanvas;

          if (canvas) {
            content.appendChild(canvas);
          }
        }
      }
    }
    const webpageStack = document.querySelector('#webpage-stack');

    const webpageViewObserver = new MutationObserver((records) => {
      for (let i = 0; i < records.length; i++) {
        if (records[i].target.classList.contains('visible')) {
          const startpage = records[i].target.querySelector('.internal-page .startpage');
          if (startpage) {
            modifyStartPage(startpage);
          }
        }
      }
    });
    const webpageStackObserver = new MutationObserver((records) => {
      const nodes = records[0].addedNodes;
      observeWebpageViewClass(nodes);
      checkIfStartPageActive()
    });

    if (webpageStack) {
      webpageStackObserver.observe(webpageStack, {
        childList: true
      });

      observeWebpageViewClass(webpageStack.childNodes);
    }
    checkIfStartPageActive();


  }, false);
}());