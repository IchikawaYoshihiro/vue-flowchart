export default {
  data() {
    return {
      tap_record: null,
    };
  },
  methods: {
    // tap control
    handleMouseDown(event, node) {
      this.processStart(event, node);
    },
    handleTouchStart(e, node) {
      this.processStart(e.touches[0], node);
    },
    processStart(event, node) {
      if (event.cancelable) {
        event.preventDefault();
      }

      const tap_record = { event, node, tapped_at: new Date(), is_double: false };
      if (this.tap_record) {
        tap_record.is_double = !this.tap_record.is_drag && !this.isMoved(tap_record) && this.isShortTime(tap_record);
      }
      this.tap_record = tap_record;
    },
    handleMouseUp(event, node) {
      this.processEnd(event, node);
    },
    handleTouchEnd(e, node) {
      this.processEnd(e.changedTouches[0], node);
    },
    processEnd(event, node) {
      const tap_record = { event, node, tapped_at: new Date(), is_double: false };
      if (this.isDifferentNode(tap_record)) {
        return;
      }

      if (this.isLongTap(tap_record)) {
        return this.$emit('onLongTap', { node });
      }
      if (this.isDoubleTap(tap_record)) {
        return this.$emit('onDoubleTap', { node });
      }
      return this.$emit('onTap', { node });
    },
    isDifferentNode(node) {
      if (node && this.tap_record.node) {
        return !this.tap_record.node.id === node.id;
      }
      return !this.tap_record.node === node;
    },
    isMoved({ event }) {
      return Math.abs(this.tap_record.event.clientX - event.clientX) > 10
        && Math.abs(this.tap_record.event.clientY - event.clientY) > 10;
    },
    isShortTime({ tapped_at }) {
      if (this.tap_record) {
        const time = tapped_at - this.tap_record.tapped_at;
        return time <= 500;
      }
      return true;
    },
    isLongTap(tap_record) {
      if (this.tap_record) {
        // background
        if (this.tap_record.node === null && tap_record.node === null) {
          return !this.isMoved(tap_record) && !this.isShortTime(tap_record)
        }
        // node
        if (this.tap_record.node && tap_record.node) {
          return this.tap_record.node.id && tap_record.node.id
            && !this.isMoved(tap_record) && !this.isShortTime(tap_record);
        }
      }
      return false;
    },
    isDoubleTap(tap_record) {
      if (this.tap_record) {
        // background
        if (this.tap_record.node === null && tap_record.node === null) {
          return this.tap_record.is_double
            && !this.isMoved(tap_record)
            && this.isShortTime(tap_record);
        }
        // node
        if (this.tap_record.node && tap_record.node) {
          return this.tap_record.is_double
            && !this.isMoved(tap_record)
            && this.isShortTime(tap_record);
        }
      }
      return false;
    },
    // drag control
    addMouseMove() {
      this.$el.addEventListener('mousemove', this.handleMouseMove)
      this.$el.addEventListener('touchmove', this.handleTouchMove)
    },
    removeMousemove() {
      this.$el.removeEventListener('mousemove', this.handleMouseMove)
      this.$el.removeEventListener('touchmove', this.handleTouchMove)
    },
    handleMouseMove(e) {
      this.processMove(e);
    },
    handleTouchMove(e) {
      e.preventDefault();
      this.processMove(e.touches[0]);
    },
    processMove(event) {
      const tap_record = { event, node: null, tapped_at: new Date(), is_double: false, is_drag: true };
      if (!this.tap_record) {
        this.tap_record = tap_record
      }

      if (this.isDragging(tap_record)) {
        const diff = {
          dx: tap_record.event.clientX - this.tap_record.event.clientX,
          dy: tap_record.event.clientY - this.tap_record.event.clientY
        };
        this.tap_record = tap_record
        this.$emit("onMove", diff);
      }
    },
    isDragging({ event }) {
      return (
        this.tap_record.event.clientX !== event.clientX || this.tap_record.event.clientY !== event.clientY
      );
    },
  }
}