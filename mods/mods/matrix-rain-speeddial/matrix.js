(function() {
  class MatrixRain {

    constructor(canvas, config = null) {
      this.config = {
        chars: 'ヲアイウエオヤユヨツソカキクケコサシスセ0146782359',
        mirror: '2359',
        offsetX: '1234567890',
        font: {
          name: 'monospace',
          size: 12,
          weight: 900,
          colors: [
            '#1ea444',
            '#afc'
          ],
          glowColors: [
            'rgba(30, 164, 38, 0.5)',
            '#3f3'
          ]
        },
        clearColor: '#000',
        laneSpeed: {
          max: 5,
          min: 1
        },
        margin: {
          rows: 0,
          columns: 0
        },
        frameInterval: 25
      };
      if (config) {
        for (let key in config) {
          if (config.hasOwnProperty(key)) {
            if (typeof config[key] === 'object') {
              Object.assign(this.config[key], config[key]);
            } else {
              this.config[key] = config[key];
            }
          }
        }
      }

      this.characters = {
        characters: [],
        width: 1,
        height: 1
      };
      this.grid = {
        columns: 1,
        rows: 1,
        width: 1,
        height: 1
      }
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');

      this.drawCount = 0;
      this.playAnimation = false;
      this.startTime = 0;

      this.drawCallback = this.draw.bind(this);
      this.init();

      this.updateSize = this.debounce(this.updateSize, 500);
    };

    getFontName() {
      return this.config.font.weight + ' ' + this.config.font.size + 'px ' + this.config.font.name;
    }

    calcCharacters() {
      const characters = this.config.chars.split('');
      let width = 1;
      let height = 1;

      this.ctx.font = this.getFontName();
      for (let i = 0; i < characters.length; i++) {
        const size = this.ctx.measureText(characters[i]);
        if (size.width > width) {
          width = size.width;
        }
      }
      height = this.config.font.size;
      this.characters = {
        characters,
        width,
        height
      };
    }

    calcGrid() {
      const width = this.characters.width + 2 * this.config.margin.columns;
      const height = this.characters.height + 2 * this.config.margin.rows;
      const rows = Math.floor(this.canvas.height / height);
      const columns = Math.floor(this.canvas.width / width);

      this.grid = {
        rows,
        columns,
        width,
        height
      };
    }

    getRandomCharacter() {
      return this.characters.characters[Math.floor(Math.random() * this.characters.characters.length)];
    }

    clear() {

      this.ctx.fillStyle = this.config.clearColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getRandomLaneSpeed() {
      return Math.floor(Math.random() * (this.config.laneSpeed.max - this.config.laneSpeed.min) + this.config.laneSpeed.min);
    }

    createLanes() {
      const lanes = [];
      for (let col = 0; col < this.grid.columns; col++) {
        const speed = this.getRandomLaneSpeed()
        lanes.push({
          id: col,
          pos: -this.grid.height * Math.floor(Math.random() * 10),
          speed: speed,
          lastCharacter: this.getRandomCharacter(),
          lastSpeed: speed
        });
      }
      this.lanes = lanes;
    }


    createPrerender(allnew) {
      if (!window.MatrixRainPrerenders && !allnew) {
        const canvases = {};
        const imageBuffer = new Image();
        for (let i = 0; i < this.characters.characters.length; i++) {

          const character = this.characters.characters[i];
          const canvas = document.createElement('canvas');
          canvas.width = this.grid.width;
          canvas.height = (this.grid.height + 1) * this.config.font.colors.length;

          canvases[character] = canvas;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.font = this.getFontName();
          let x = 0;
          if (this.config.mirror.indexOf(character) >= 0) {
            x = -canvas.width * 0.75;
            ctx.scale(-1, 1);
          } else
          if (this.config.offsetX.indexOf(character) >= 0) {
            x = canvas.width / 4
          }

          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 0;

          for (let k = 0; k < this.config.font.colors.length; k++) {


            ctx.fillStyle = this.config.font.colors[k];
            ctx.fillText(character, x, (this.characters.height) * (k + 1) + k);

            const randomGradientX = Math.random() < 0.5 ? 0 : this.grid.width;
            const grd = ctx.createLinearGradient(randomGradientX, (this.characters.height) * (k), this.grid.width - randomGradientX, this.grid.height);
            grd.addColorStop(0, 'rgba(255, 255, 255, .7)');
            grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grd;
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillRect(0, (this.characters.height) * (k), this.grid.width, this.grid.height);
            ctx.globalCompositeOperation = 'source-over';

          }
          imageBuffer.src = canvas.toDataURL('image/png');
          if (this.config.mirror.indexOf(character) >= 0) {
            ctx.scale(-1, 1);
          }
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let k = 0; k < this.config.font.colors.length; k++) {
            const grd = ctx.createRadialGradient(
              this.grid.width / 2,
              (this.grid.height + 1) * (k) + this.grid.height / 2,
              0,
              this.grid.width / 2,
              (this.grid.height + 1) * (k) + this.grid.height / 2,
              this.grid.width - 2);
            grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
            grd.addColorStop(0, this.config.font.glowColors[k]);

            ctx.fillStyle = grd;
            ctx.fillRect(0, (this.grid.height + 1) * (k), this.grid.width, this.grid.height);
          }


          ctx.drawImage(imageBuffer, 0, 0);

        }
        this.prerender = canvases;
        window.MatrixRainPrerenders
      }
      else {
        this.prerender = window.MatrixRainPrerenders;
      }
    }

    draw(timestamp) {
      let progress = timestamp - this.startTime;

      if (progress > this.config.frameInterval) {
        this.startTime = timestamp;
        if (this.drawCount % 5 == 0) {
          this.ctx.fillStyle = 'rgba(0,0,0,0.051)';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        for (let i = 0; i < this.lanes.length; i++) {
          const lane = this.lanes[i];
          const x = i * this.grid.width;

          if (this.drawCount % lane.speed == 0) {

            lane.pos += this.grid.height;
            if (lane.pos > (this.grid.rows + 1) * this.grid.height) {
              lane.pos = -this.grid.height * 2;
              lane.lastSpeed = lane.speed;
              lane.speed = this.getRandomLaneSpeed();
            }
            let y = lane.pos;

            let character = this.getRandomCharacter();
            lane.lastCharacter = character;
            this.ctx.drawImage(this.prerender[character], 0, 0, this.grid.width, this.grid.height * 2 + 1, x, y, this.grid.width, this.grid.height * 2 + 1);

            //random characters appearing
            const randMax = (lane.pos / this.grid.height) - 1;
            const randMin = randMax - (this.grid.rows / 2) * (lane.speed / this.config.laneSpeed.max);
            const randomPos = Math.floor(Math.random() * (randMax - randMin) + randMin) * this.grid.height;

            if (randomPos > 0) {
              const character = this.getRandomCharacter();
              this.ctx.drawImage(this.prerender[character], 0, 0, this.grid.width, this.grid.height, x, randomPos, this.grid.width, this.grid.height);
            }
          }
        }


        this.drawCount++;
        if (this.drawCount > 1200) {
          this.drawCount = 1;
        }
      }
      if (this.playAnimation) {
        window.requestAnimationFrame(this.drawCallback);
      }
    }

    init() {
      this.resize();
      this.calcCharacters();
      this.calcGrid();
      this.createPrerender();
    }

    resize() {
      if (this.canvas.parentNode) {
        this.canvas.width = this.canvas.parentNode.clientWidth;
        this.canvas.height = this.canvas.parentNode.clientHeight;
      }
    }

    updateSize() {

      this.resize();
      this.calcGrid();
      this.createLanes();
      this.clear();
    }
    start() {
      this.createLanes();
      this.clear();
      this.playAnimation = true;
      window.requestAnimationFrame(this.drawCallback);
    }
    startPrepared() {
      this.createLanes();
      this.clear();

      for (let i = 0; i < 150; i++) {
        this.draw(i * 10000);
      }
      this.startTime = 0;
      this.playAnimation = true;
      window.requestAnimationFrame(this.drawCallback);
    }
    stop() {
      this.playAnimation = false;
    }

    debounce(func, wait, immediate) {
      let timeout;
      return function() {
        const context = this,
          args = arguments;
        const later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      }
    }
  }
  if (!window.MatrixRain) {
    window.MatrixRain = MatrixRain;
  }

}());