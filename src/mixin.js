import { DOUBLE_TAP_THRESHOLD_MSEC, LONG_TAP_THRESHOLD_MSEC, MOVE_THRESHOLD_PX } from "./const";

export default {
  data() {
    return {
      touches: [],
      touch_node: null,   // touch target is node or background
      touched_at: null,   // for double touch
      touch_timer: null,  // for long touch
      offset: { x: 0, y: 0 },
      render_area: { w: 100, h: 100 },
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
        if (!this.shouldMove(touches[0])) {
          return;
        }
        const { dx, dy } = this.calcDrag(touches[0]);

        this.touches = touches;
        if (this.touch_node) {
          this.$emit('onDrag', { dx, dy });
          this.updateNodePosition({ dx, dy })
        } else {
          this.$emit('onBackgroundDrag', { dx, dy });
          this.updateBackgroundPosition({ dx, dy })
        }
        return;
      }
      if (this.isPinch(touches)) {
        const { dr, dh, dv, dl, cx, cy } = this.calcPinch(touches)

        this.touches = touches;
        this.$emit('onPinch', { dr, dh, dv, dl, cx, cy });
        this.updateScale({ dl, cx, cy });
      }
    },
    handleWheel(event) {
      event.preventDefault();

      if (this.touch_timer) {
        clearTimeout(this.touch_timer);
      }

      if (event.deltaY) {
        this.updateScale({ dl: -event.deltaY, cx: event.clientX, cy: event.clientY });
      }
    },

    updateNodePosition({ dx, dy }) {
      const [real_dx, real_dy] = [dx / this.computedOptions.canvas.scale, dy / this.computedOptions.canvas.scale];
      this.flow.nodes = this.flow.nodes.map((n) =>
        this.selected_node_ids.includes(n.id)
          ? Object.assign({}, n, {
            x: Math.round((n.x + real_dx) / this.computedOptions.canvas.grid) * this.computedOptions.canvas.grid,
            y: Math.round((n.y + real_dy) / this.computedOptions.canvas.grid) * this.computedOptions.canvas.grid
          })
          : n
      );
    },
    updateBackgroundPosition({ dx, dy }) {
      this.offset.x += dx;
      this.offset.y += dy;
    },
    updateScale({ dl, cx, cy }) {
      const old_scale = this.computedOptions.canvas.scale;
      const new_scale = old_scale + dl / this.render_area.w;
      if (new_scale <= 0.2 || 5 < new_scale) {
        return;
      }

      this.offset.x = this.offset.x - (new_scale - old_scale) * cx;
      this.offset.y = this.offset.y - (new_scale - old_scale) * cy;
      this.computedOptions.canvas.scale = new_scale;
    },
    updateRenderArea() {
      this.render_area.w = this.$el.offsetWidth;
      this.render_area.h = this.$el.offsetHeight;
    },
    isDoubleTouch(touches, touched_at) {
      if (this.touched_at && touched_at - this.touched_at < DOUBLE_TAP_THRESHOLD_MSEC && this.touches.length === 1 && touches.length === 1) {
        const t0 = this.touches[0];
        const t1 = touches[0];
        return Math.abs(t0.clientX - t1.clientX) < MOVE_THRESHOLD_PX
          && Math.abs(t0.clientY - t1.clientY) < MOVE_THRESHOLD_PX;
      }
      return false;
    },
    isLongTouch(touches) {
      if (this.touches.length === 1 && touches.length === 1) {
        const t0 = this.touches[0];
        const t1 = touches[0];
        return Math.abs(t0.clientX - t1.clientX) < MOVE_THRESHOLD_PX
          && Math.abs(t0.clientY - t1.clientY) < MOVE_THRESHOLD_PX;
      }
      return false;
    },
    isDrag(touches) {
      if (this.touches.length === 1 && touches.length === 1) {
        const t0 = this.touches[0];
        const t1 = touches[0];
        return Math.abs(t0.clientX - t1.clientX) > MOVE_THRESHOLD_PX
          || Math.abs(t0.clientY - t1.clientY) > MOVE_THRESHOLD_PX;
      }
      return false;
    },
    shouldMove(touch) {
      const t0 = this.touches[0];
      const t1 = touch;
      return Math.abs(t0.clientX - t1.clientX) > this.computedOptions.canvas.grid
        || Math.abs(t0.clientY - t1.clientY) > this.computedOptions.canvas.grid;
    },
    isPinch(touches) {
      if (this.touches.length >= 2 && touches.length >= 2) {
        const t00 = this.touches[0];
        const t01 = touches[0];
        const t10 = this.touches[1];
        const t11 = touches[1];
        return Math.abs(Math.abs(t00.clientX - t10.clientX) - Math.abs(t01.clientX - t11.clientX)) > MOVE_THRESHOLD_PX
          || Math.abs(Math.abs(t00.clientY - t10.clientY) - Math.abs(t01.clientY - t11.clientY)) > MOVE_THRESHOLD_PX
      }
      return false;
    },
    calcDrag(touch) {
      const dx = touch.clientX - this.touches[0].clientX;
      const dy = touch.clientY - this.touches[0].clientY;

      return { dx, dy };
    },
    calcPinch(touches) {
      // distance
      const w1 = this.touches[0].clientX - this.touches[1].clientX;
      const h1 = this.touches[0].clientY - this.touches[1].clientY;
      const w2 = touches[0].clientX - touches[1].clientX;
      const h2 = touches[0].clientY - touches[1].clientY;
      // center
      const cx = (touches[0].clientX + touches[1].clientX) / 2;
      const cy = (touches[0].clientY + touches[1].clientY) / 2;

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

      return { dr, dh, dv, dl, cx, cy }
    },
  },
  computed: {
    boxStyle() {
      return `max-width: ${this.render_area.w}px; margin: auto;`;
    },
    transform() {
      return `scale(${this.computedOptions.canvas.scale}) translate(${this.offset.x}, ${this.offset.y}) `;
    },
    viewbox() {
      return `0 0 ${this.render_area.w} ${this.render_area.h}`;
    },
    gridTransform() {
      const x = (this.offset.x % this.computedOptions.canvas.grid) - this.computedOptions.canvas.grid;
      const y = (this.offset.y % this.computedOptions.canvas.grid) - this.computedOptions.canvas.grid;
      return `scale(${this.computedOptions.canvas.scale}) translate(${x}, ${y}) `;
    },
    gridSize() {
      return this.computedOptions.canvas.grid * this.computedOptions.canvas.scale;
    },
    gridPoints() {
      return `0, ${this.computedOptions.canvas.grid} 0, 0 ${this.computedOptions.canvas.grid}, 0`
    },
    gridCount() {
      return {
        x: 2 + Math.round(this.render_area.w / this.gridSize),
        y: 2 + Math.round(this.render_area.h / this.gridSize)
      };
    },
    gridArea() {
      return {
        w: this.gridCount.x * this.computedOptions.canvas.grid,
        h: this.gridCount.y * this.computedOptions.canvas.grid,
      }
    },
    gridScale() {
      return {
        x: 1 / this.gridCount.x,
        y: 1 / this.gridCount.y
      }
    }
  },
  mounted() {
    this.$el.addEventListener('resize', this.updateRenderArea);
    this.updateRenderArea();
  }
}