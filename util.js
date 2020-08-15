(function (global) {
  "use strict";

  global.elem = function elem(name, attrs, children) {
    attrs = attrs || {};
    children = children || [];
    var e = document.createElement(name);
    Object.keys(attrs).forEach((key) => e.setAttribute(key, attrs[key]));
    children.forEach((child) => {
      if (typeof child === "string") {
        child = document.createTextNode(child);
      }
      e.appendChild(child);
    });
    return e;
  };

  var matchesFuncName = [
    "matches",
    "mozMatchesSelector",
    "webkitMatchesSelector",
    "msMatchesSelector",
    "oMatchesSelector",
  ].find((func) => document.body[func]);

  if (matchesFuncName !== undefined) {
    global.matches = (elem, selector) => elem[matchesFuncName](selector);
  }

  global.closest = (elem, selector) => {
    while (elem) {
      if (matches(elem, selector)) {
        return elem;
      }
      elem = elem.parentElement;
    }
    return null;
  };

  global.requestAnimationFrame =
    global.requestAnimationFrame ||
    global.mozRequestAnimationFrame ||
    global.webkitRequestAnimationFrame ||
    global.msRequestAnimationFrame ||
    function (fn) {
      setTimeout(fn, 20);
    };

  global.trigger = (name, target) =>
    target.dispatchEvent(
      new CustomEvent(name, { bubbles: true, cancelable: false })
    );
})(window);
