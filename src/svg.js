/**
 * depend on @svgdotjs/svg.js
 * global event config
 */
let _target = {
  element: null,
  options: {},
};

// 监听事件
const addEventListener = () => {
  document.addEventListener("mousemove", mousemoveHandler);
  document.addEventListener("mouseup", mouseupHandler);
};

// 消除监听
const removeEventListener = () => {
  document.removeEventListener("mousemove", mousemoveHandler);
  document.removeEventListener("mouseup", mouseupHandler);
};

const mousemoveHandler = function (e) {
  const { element, options } = _target;
  if (!element) {
    return;
  }

  if (element.drag) {
    if (options && typeof options.onDragMove === "function") {
      options.onDragMove(e);
    }

    if (options && options.disableFollow) {
      return;
    }
    // console.log(e);
    const { x, y, cx, cy } = element.pos;
    let ncx = cx + (e.pageX - x);
    let ncy = cy + (e.pageY - y);
    if (options.lock) {
      if (options.lock.x) {
        ncx = cx;
      } else if (options.lock.y) {
        ncy = cy;
      }
    }
    element.center(ncx, ncy);
  }
};

const mouseupHandler = function (e) {
  const { element, options } = _target;
  if (!element) {
    return;
  }

  if (options && typeof options.onDragEnd === "function") {
    options.onDragEnd(e);
  }

  const { x, y } = element.pos || {};
  const diffX = e.pageX - x;
  const diffY = e.pageY - y;
  const diff = Math.sqrt(diffX * diffX + diffY * diffY);

  if (diff < 7) {
    // click event
    element.drag = false;
    _target = {};
    return false;
  }

  setTimeout(() => {
    element.drag = false;
    element.pos = null;
    _target = {};
  }, 0);

  removeEventListener();
};

/**
 * set element dragable
 * @param {Element} element SVG Element
 * @param {Object} options drag config
 * @returns {Element} svg element
 */
export const setDraggable = (element, options = {}) => {
  if (!element || typeof element.move !== "function") {
    console.error(
      `Drag target ${element} is not an element of @svgdotjs/svg.js, maybe you should install @svgdotjs/svg.js firstly.`
    );
    return element;
  }

  element.on("mousedown", function (e) {
    // set event target to current target
    _target = { element, options };

    if (typeof options.onDragStart === "function") {
      options.onDragStart(e);
    }

    this.pos = {
      x: e.pageX,
      y: e.pageY,
      cx: this.cx(),
      cy: this.cy(),
    };
    // console.log(pos);
    this.drag = true;

    addEventListener();
  });

  // element.on("mousemove", moveHandler);

  // element.on("mouseup", upHandler);

  return element;
};
