"use strict";
exports.__esModule = true;
var styleComments = function () {
  var comments = document.querySelectorAll(".commentWrap");
  for (var i = 0; i < comments.length; i++) {
    var sum = 22 + 22 * i;
    comments[i].style.paddingLeft = sum + "px";
  }
};
exports["default"] = styleComments;
