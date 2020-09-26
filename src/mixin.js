const DOUBLE_TAP_THRESHOLD_MSEC = 500;
const LONG_TAP_THRESHOLD_MSEC = 1000;
const DISTANCE_THRESHOLD_PX = 10;

export default {
  data() {
    return {
      touches: [],
      touch_node: null,   // touch target is node or background
      touched_at: null,   // for double touch
      touch_timer: null,  // for long touch
      offset: [0, 0],
      render_area: [100, 100]
    };
  },
  methods: {
    // touch start
    handleTouchStart(event, node) {
      this.processStart([...event.touches], node)
    },
    handleMouseDown(event, node) {
      this.processStart([event], node)
    },
    processStart(touches, node) {
      const touched_at = new Date();
      const node_id = node ? node.id : null;

      this.touch_node = node_id;
      this.addMoveListener();

      if (this.touch_timer) {
        clearTimeout(this.touch_timer);
      }

      if (this.isDoubleTouch(touches, touched_at)) {
        this.$emit('onDoubleTouch', { node_id });
        return;
      }

      this.touch_timer = setTimeout(() => {
        if (this.isLongTouch(touches)) {
          this.$emit('onLongTouch', { node_id });
          this.removeMoveListener();
        }
      }, LONG_TAP_THRESHOLD_MSEC);

      this.touches = touches;
      this.touched_at = touched_at;
      this.$emit('onTouch', { node_id });
    },

    // touch end
    handleTouchEnd(event, node) {
      this.processEnd([...event.touches], node);
    },
    handleMouseUp(event, node) {
      this.processEnd([], node);
    },
    processEnd(touches, node) {
      if (this.touch_timer) {
        clearTimeout(this.touch_timer);
      }

      if (touches.length === 0) {
        this.removeMoveListener();
        const node_id = node ? node.id : null;
        this.$emit('onTouchEnd', { node_id });
      }
    },

    // mouve handling
    addMoveListener() {
      if (this.movable) {
        this.$el.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.$el.addEventListener('mousemove', this.handleMouseMove, { passive: true });
        this.$el.addEventListener('wheel', this.handleWheel, { passive: false });
      }
    },
    removeMoveListener() {
      this.$el.removeEventListener('touchmove', this.handleTouchMove);
      this.$el.removeEventListener('mousemove', this.handleMouseMove);
      this.$el.removeEventListener('wheel', this.handleWheel);
    },
    handleTouchMove(event) {
      event.preventDefault();
      this.processMove([...event.touches]);
    },
    handleMouseMove(event) {
      this.processMove([event]);
    },
    processMove(touches) {
      if (this.isDrag(touches)) {
        const { dx, dy } = this.calcDrag(touches);

        this.touches = touches;
        if (this.touch_node) {
          this.$emit('onDrag', { dx, dy });
          this.updateNodePosition({ dx, dy })
        } else {
          this.$emit('onBackgroundDrag', { dx, dy });
          this.updateBackgroundPosition({ dx, dy })
        }
      }
      if (this.isPinch(touches)) {
        const { dr, dh, dv, dl } = this.calcPinch(touches)

        this.touches = touches;
        this.$emit('onPinch', { dr, dh, dv, dl });
        this.updateScale(dl);
      }
    },
    handleWheel(event) {
      event.preventDefault();
      if (event.deltaY) {
        this.updateScale(-event.deltaY);
      }
    },

    updateNodePosition({ dx, dy }) {
      const [real_dx, real_dy] = [dx / this.computedOptions.canvas.scale, dy / this.computedOptions.canvas.scale];
      this.flow.nodes = this.flow.nodes.map((n) =>
        this.selected_node_ids.includes(n.id)
          ? Object.assign({}, n, {
            position: [
              Math.round((n.position[0] + real_dx) / this.computedOptions.canvas.grid) * this.computedOptions.canvas.grid,
              Math.round((n.position[1] + real_dy) / this.computedOptions.canvas.grid) * this.computedOptions.canvas.grid
            ],
          })
          : n
      );
    },
    updateBackgroundPosition({ dx, dy }) {
      this.offset = [this.offset[0] + dx, this.offset[1] + dy];
    },
    updateScale(dl) {
      this.computedOptions.canvas.scale = this.computedOptions.canvas.scale + dl / this.render_area[0];
    },
    isDoubleTouch(touches, touched_at) {
      if (this.touched_at && touched_at - this.touched_at < DOUBLE_TAP_THRESHOLD_MSEC && this.touches.length === 1 && touches.length === 1) {
        const t0 = this.touches[0];
        const t1 = touches[0];
        return Math.abs(t0.clientX - t1.clientX) < DISTANCE_THRESHOLD_PX
          && Math.abs(t0.clientY - t1.clientY) < DISTANCE_THRESHOLD_PX;
      }
      return false;
    },
    isLongTouch(touches) {
      if (this.touches.length === 1 && touches.length === 1) {
        const t0 = this.touches[0];
        const t1 = touches[0];
        return Math.abs(t0.clientX - t1.clientX) < DISTANCE_THRESHOLD_PX
          && Math.abs(t0.clientY - t1.clientY) < DISTANCE_THRESHOLD_PX;
      }
      return false;
    },
    isDrag(touches) {
      if (this.touches.length === 1 && touches.length === 1) {
        const t0 = this.touches[0];
        const t1 = touches[0];
        return Math.abs(t0.clientX - t1.clientX) > DISTANCE_THRESHOLD_PX
          || Math.abs(t0.clientY - t1.clientY) > DISTANCE_THRESHOLD_PX;
      }
      return false;
    },
    isPinch(touches) {
      if (this.touches.length >= 2 && touches.length >= 2) {
        const t00 = this.touches[0];
        const t01 = touches[0];
        const t10 = this.touches[1];
        const t11 = touches[1];
        return Math.abs(Math.abs(t00.clientX - t10.clientX) - Math.abs(t01.clientX - t11.clientX)) > DISTANCE_THRESHOLD_PX
          || Math.abs(Math.abs(t00.clientY - t10.clientY) - Math.abs(t01.clientY - t11.clientY)) > DISTANCE_THRESHOLD_PX
      }
      return false;
    },
    calcDrag(touches) {
      const dx = touches[0].clientX - this.touches[0].clientX;
      const dy = touches[0].clientY - this.touches[0].clientY;

      return { dx, dy };
    },
    calcPinch(touches) {
      const w1 = this.touches[0].clientX - this.touches[1].clientX;
      const h1 = this.touches[0].clientY - this.touches[1].clientY;
      const w2 = touches[0].clientX - touches[1].clientX;
      const h2 = touches[0].clientY - touches[1].clientY;

      // rotate
      const r1 = Math.abs(Math.atan(h1 / w1));
      const r2 = Math.abs(Math.atan(h2 / w2));
      const dr = (r2 - r1) * 180 / Math.PI;
      // horizontal
      const dh = Math.abs(h2) - Math.abs(h1);
      // vertical
      const dv = Math.abs(w2) - Math.abs(w1);

      // length
      const dl = Math.sqrt(w2 ** 2 + h2 ** 2) - Math.sqrt(w1 ** 2 + h1 ** 2);

      return { dr, dh, dv, dl }
    },
    updateRenderArea() {
      this.render_area = [
        this.$el.clientWidth,
        this.$el.clientHeight
      ];
    }
  },
  computed: {
    boxStyle() {
      return `max-width: ${this.render_area[0]}px; margin: auto;`;
    },
    bgTransform() {
      return `translate(${this.offset[0]}, ${this.offset[1]}) scale(${this.computedOptions.canvas.scale})`;
    },
    bgWidth() {
      return this.render_area[0];
    },
    bgHeight() {
      return this.render_area[1];
    },
    bgViewBox() {
      return `0 0 ${this.render_area[0]} ${this.render_area[1]}`;
    },
    gridTransform() {
      const x = (this.offset[0] % this.computedOptions.canvas.grid) - this.computedOptions.canvas.grid;
      const y = (this.offset[1] % this.computedOptions.canvas.grid) - this.computedOptions.canvas.grid;
      return `translate(${x}, ${y}) scale(${this.computedOptions.canvas.scale})`;
    },
    gridPoints() {
      return `0, ${this.gridHeight} 0, 0 ${this.gridWidth}, 0`
    },
    gridWidth() {
      return (this.render_area[0] + this.computedOptions.canvas.grid * 2) / this.computedOptions.canvas.scale;
    },
    gridHeight() {
      return (this.render_area[1] + this.computedOptions.canvas.grid * 2) / this.computedOptions.canvas.scale;
    },
    gridScaleX() {
      return (
        this.computedOptions.canvas.grid * this.computedOptions.canvas.scale / this.render_area[0]
      );
    },
    gridScaleY() {
      return (
        this.computedOptions.canvas.grid * this.computedOptions.canvas.scale / this.render_area[1]
      );
    },
  },
  mounted() {
    this.$el.addEventListener('resize', this.updateRenderArea);
    this.updateRenderArea();
  }
}