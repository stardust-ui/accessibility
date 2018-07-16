var PopupMenu = function(domNode, controllerObj, childNodeName) {
  var elementChildren,
    msgPrefix = "PopupMenu constructor argument domNode ";

  this.childNodeName = childNodeName.toUpperCase();

  // Check whether domNode is a DOM element
  if (!domNode instanceof Element) {
    throw new TypeError(msgPrefix + "is not a DOM Element.");
  }

  // Check whether domNode has child elements
  if (domNode.childElementCount === 0) {
    throw new Error(msgPrefix + "has no element children.");
  }

  // Check whether domNode descendant elements have A elements
  var childElement = domNode.firstElementChild;
  while (childElement) {
    var menuitem = childElement.firstElementChild;
    if (menuitem && menuitem.tagName !== this.childNodeName) {
      throw new Error(
        msgPrefix +
          "has descendant elements that are not " +
          this.childNodeName +
          " elements."
      );
    }
    childElement = childElement.nextElementSibling;
  }

  this.domNode = domNode;
  this.controller = controllerObj;

  this.menuitems = []; // see PopupMenu init method
  this.firstChars = []; // see PopupMenu init method

  this.firstItem = null; // see PopupMenu init method
  this.lastItem = null; // see PopupMenu init method

  this.hasFocus = false; // see MenuItemLinks handleFocus, handleBlur
  this.hasHover = false; // see PopupMenu handleMouseover, handleMouseout
};

/*
*   @method PopupMenu.prototype.init
*
*   @desc
*       Add domNode event listeners for mouseover and mouseout. Traverse
*       domNode children to configure each menuitem and populate menuitems
*       array. Initialize firstItem and lastItem properties.
*/
PopupMenu.prototype.init = function() {
  var childElement, menuElement, menuItem, textContent, numItems, label;

  // Configure the domNode itself
  this.domNode.tabIndex = -1;

  this.domNode.setAttribute("role", "menu");

  if (
    !this.domNode.getAttribute("aria-labelledby") &&
    !this.domNode.getAttribute("aria-label") &&
    !this.domNode.getAttribute("title")
  ) {
    label = this.controller.domNode.innerHTML;
    this.domNode.setAttribute("aria-label", label);
  }

  // Traverse the element children of domNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  childElement = this.domNode.firstElementChild;

  while (childElement) {
    menuElement = childElement.firstElementChild;

    if (menuElement && menuElement.tagName === this.childNodeName) {
      menuItem = new MenuItemLinks(menuElement, this);
      menuItem.init();
      this.menuitems.push(menuItem);
      textContent = menuElement.textContent.trim();
      this.firstChars.push(textContent.substring(0, 1).toLowerCase());
    }
    childElement = childElement.nextElementSibling;
  }

  // Use populated menuitems array to initialize firstItem and lastItem.
  numItems = this.menuitems.length;
  if (numItems > 0) {
    this.firstItem = this.menuitems[0];
    this.lastItem = this.menuitems[numItems - 1];
  }
};

/* FOCUS MANAGEMENT METHODS */

PopupMenu.prototype.setFocusToController = function(command) {
  if (typeof command !== "string") {
    command = "";
  }

  if (command === "previous") {
    this.controller.menubar.setFocusToPreviousItem(this.controller);
  } else {
    if (command === "next") {
      this.controller.menubar.setFocusToNextItem(this.controller);
    } else {
      this.controller.domNode.focus();
    }
  }
};

PopupMenu.prototype.setFocusToFirstItem = function() {
  this.firstItem.domNode.focus();
};

PopupMenu.prototype.setFocusToLastItem = function() {
  this.lastItem.domNode.focus();
};

PopupMenu.prototype.setFocusToPreviousItem = function(currentItem) {
  var index;

  if (currentItem === this.firstItem) {
    this.lastItem.domNode.focus();
  } else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index - 1].domNode.focus();
  }
};

PopupMenu.prototype.setFocusToNextItem = function(currentItem) {
  var index;

  if (currentItem === this.lastItem) {
    this.firstItem.domNode.focus();
  } else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index + 1].domNode.focus();
  }
};

PopupMenu.prototype.setFocusByFirstCharacter = function(currentItem, char) {
  var start,
    index,
    char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menuitems.indexOf(currentItem) + 1;
  if (start === this.menuitems.length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(start, char);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(0, char);
  }

  // If match was found...
  if (index > -1) {
    this.menuitems[index].domNode.focus();
  }
};

PopupMenu.prototype.getIndexFirstChars = function(startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[i]) {
      return i;
    }
  }
  return -1;
};

/* MENU DISPLAY METHODS */

PopupMenu.prototype.open = function() {
  // get position and bounding rectangle of controller object's DOM node
  var rect = this.controller.domNode.getBoundingClientRect();

  // set CSS properties
  this.domNode.style.display = "block";
  this.domNode.style.position = "absolute";
  this.domNode.style.top = rect.height + "px";
  this.domNode.style.left = "0px";

  // set aria-expanded attribute
  this.controller.domNode.setAttribute("aria-expanded", "true");
};

PopupMenu.prototype.close = function(force) {
  if (force || (!this.hasFocus && !this.hasHover)) {
    this.domNode.style.display = "none";
    this.controller.domNode.removeAttribute("aria-expanded");
  }
};
