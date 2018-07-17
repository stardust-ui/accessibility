var Menubutton = function(domNode, childNodeName) {
  this.domNode = domNode;
  this.popupMenu = false;

  this.hasFocus = false;

  this.childNodeName = childNodeName;

  this.keyCode = Object.freeze({
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    SPACE: 32,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  });
};

Menubutton.prototype.init = function() {
  this.domNode.setAttribute("aria-haspopup", "true");

  this.domNode.addEventListener("keydown", this.handleKeydown.bind(this));
  this.domNode.addEventListener("click", this.handleClick.bind(this));
  this.domNode.addEventListener("focus", this.handleFocus.bind(this));
  this.domNode.addEventListener("blur", this.handleBlur.bind(this));

  // initialize pop up menus

  var popupMenu = document.getElementById(
    this.domNode.getAttribute("aria-controls")
  );

  if (popupMenu) {
    this.popupMenu = new PopupMenu(popupMenu, this, this.childNodeName);
    this.popupMenu.init();
  }
};

Menubutton.prototype.handleKeydown = function(event) {
  var tgt = event.currentTarget,
    flag = false,
    clickEvent;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
    case this.keyCode.DOWN:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
      }
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToLastItem();
        flag = true;
      }
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

Menubutton.prototype.handleClick = function(event) {
  if (this.domNode.getAttribute("aria-expanded") == "true") {
    this.popupMenu.close();
  } else {
    this.popupMenu.open();
    this.popupMenu.setFocusToFirstItem();
  }
};

Menubutton.prototype.handleFocus = function(event) {
  this.popupMenu.hasFocus = true;
};

Menubutton.prototype.handleBlur = function(event) {
  this.popupMenu.hasFocus = false;
};
