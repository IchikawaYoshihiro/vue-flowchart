export default {
  data() {
    return {
      touches: [],
      touched_at: null,   // for double touch
      touch_timer: null,  // for long touch
    };
  },
  methods: {
    addMoveListener() {
      if (this.movable) {
        this.$el.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.$el.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      }
    },
    removeMoveListener() {
      this.$el.removeEventListener('touchmove', this.handleTouchMove);
      this.$el.removeEventListener('mousemove', this.handleMouseMove);
    },
    handleTouchStart(event, node) {
      this.processStart([...event.touches], node)
    },
    handleMouseDown(event, node) {
      this.processStart([event], node)
    },
    processStart(touches, node) {
      const touched_at = new Date();
      const node_id = node ? node.id : null;

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
        }
      }, 1000);

      this.touches = touches;
      this.touched_at = touched_at;
      this.$emit('onTouch', { node_id });
    },
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
        this.$emit('onDrag', { dx, dy });
        this.updateNodePosition({ dx, dy })
      }
      if (this.isPinch(touches)) {
        const { dr, dh, dv, dl } = this.calcPinch(touches)

        this.touches = touches;
        this.$emit('onPinch', { dr, dh, dv, dl });
      }
    },
    updateNodePosition({ dx, dy }) {
      this.flow.nodes = this.flow.nodes.map((n) =>
        this.selected_node_ids.includes(n.id)
          ? Object.assign({}, n, {
            position: [n.position[0] + dx, n.position[1] + dy],
          })
          : n
      );
    },
    isDoubleTouch(touches, touched_at) {
      if (this.touched_at && touched_at - this.touched_at < 500 && this.touches.length === 1 && touches.length === 1) {
        const t0 = this.touches[0];
        const t1 = touches[0];
        return Math.abs(t0.clientX - t1.clientX) < 10 && Math.abs(t0.clientY - t1.clientY) < 10;
      }
      return false;
    },
    isLongTouch(touches) {
      if (this.touches.length === 1 && touches.length === 1) {
        const t0 = this.touches[0];
        const t1 = touches[0];
        return Math.abs(t0.clientX - t1.clientX) < 10 && Math.abs(t0.clientY - t1.clientY) < 10;
      }
      return false;
    },
    isDrag(touches) {
      if (this.touches.length === 1 && touches.length === 1) {
        const t0 = this.touches[0];
        const t1 = touches[0];
        return Math.abs(t0.clientX - t1.clientX) > 10 || Math.abs(t0.clientY - t1.clientY) > 10;
      }
      return false;
    },
    isPinch(touches) {
      if (this.touches.length >= 2 && touches.length >= 2) {
        const t00 = this.touches[0];
        const t01 = touches[0];
        const t10 = this.touches[1];
        const t11 = touches[1];
        return Math.abs(Math.abs(t00.clientX - t10.clientX) - Math.abs(t01.clientX - t11.clientX)) > 10
          || Math.abs(Math.abs(t00.clientY - t10.clientY) - Math.abs(t01.clientY - t11.clientY)) > 10
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
  }
}