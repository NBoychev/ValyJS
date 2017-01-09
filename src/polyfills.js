// Polyfills

// Adds support for Element.closest() - Android 4.4, Edge, Safari 8, iOS Safari 8.4
if (!('closest' in Element.prototype)) {
  Element.prototype.closest = function (selector) {
    let all = Array.from(document.querySelectorAll(selector));
    let current = this;

    while (current && !all.includes(current)) {
      current = current.parentNode;
    }

    return current;
  };
}

// Adds support for Element.remove() - IE 11, Android 4.3, Safari 6, iOS Safari 6.1
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}
