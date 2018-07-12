var appsMenuItems = document.querySelectorAll(
  "#appmenu > li > [role='menuitem']"
);
var subMenuItems = document.querySelectorAll(
  "#appmenu > li li [role='menuitem']"
);
var keys = {
  tab: 9,
  enter: 13,
  esc: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40
};
var currentIndex, subIndex;
// Prevent focus on first submenu item, if click action
// wasn't triggered by screen reader
var preventFocusOnFirstSubMenuItem = false;

var gotoIndex = function(idx) {
  if (idx == appsMenuItems.length) {
    idx = 0;
  } else if (idx < 0) {
    idx = appsMenuItems.length - 1;
  }

  currentIndex = idx;
  appsMenuItems[currentIndex].focus();
};

var gotoSubIndex = function(menu, idx) {
  var items = menu.querySelectorAll("[role='menuitem']");
  if (idx == items.length) {
    idx = 0;
  } else if (idx < 0) {
    idx = items.length - 1;
  }
  items[idx].focus();
  subIndex = idx;
};

Array.prototype.forEach.call(appsMenuItems, function(el, i) {
  if (0 == i) {
    el.addEventListener("focus", function() {
      currentIndex = 0;
    });
  }
  el.addEventListener("focus", function(event) {
    subIndex = 0;
    Array.prototype.forEach.call(appsMenuItems, function(el, i) {
      el.setAttribute("aria-expanded", "false");
      el.tabIndex = -1;
    });

    event.target.tabIndex = 0;
  });
  el.addEventListener("click", function(event) {
    var hasPopup = this.getAttribute("aria-haspopup");
    // does not contain popup menu, do action
    if (!hasPopup) {
      alert(this.innerText);
      return false;
    }
    var currState = this.getAttribute("aria-expanded");
    var nextState = currState === "false" ? true : false;
    this.setAttribute("aria-expanded", nextState);
    event.preventDefault();

    // we assume Click was triggerd by screen reader
    if (!preventFocusOnFirstSubMenuItem) {
      subindex = 0;
      var submenu = this.parentElement.querySelector('[role="menu"]');
      if (submenu) {
        gotoSubIndex(submenu, 0);
      }
    }
    return false;
  });
  el.addEventListener("mouseout", function(event) {
    preventFocusOnFirstSubMenuItem = false;
  });
  el.addEventListener("mouseenter", function(event) {
    preventFocusOnFirstSubMenuItem = true;
  });
  el.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case keys.right:
        gotoIndex(currentIndex + 1);
        break;
      case keys.left:
        gotoIndex(currentIndex - 1);
        break;
      case keys.tab:
        if (event.shiftKey) {
          gotoIndex(currentIndex - 1);
        } else {
          gotoIndex(currentIndex + 1);
        }
        break;
      case keys.enter:
      case keys.down:
      case keys.space:
        this.click();
        subindex = 0;
        var submenu = this.parentElement.querySelector('[role="menu"]');
        if (submenu) {
          gotoSubIndex(submenu, 0);
        }
        break;
      case keys.up:
        this.click();
        var submenu = this.parentElement.querySelector('[role="menu"]');
        if (submenu) {
          subindex = submenu.querySelectorAll("[role='menuitem']").length - 1;
          gotoSubIndex(submenu, subindex);
        }
        break;
    }
    event.preventDefault();
  });
});

Array.prototype.forEach.call(subMenuItems, function(el, i) {
  el.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case keys.tab:
        if (event.shiftKey) {
          gotoIndex(currentIndex - 1);
        } else {
          gotoIndex(currentIndex + 1);
        }
        break;
      case keys.right:
        gotoIndex(currentIndex + 1);
        break;
      case keys.left:
        gotoIndex(currentIndex - 1);
        break;
      case keys.esc:
        gotoIndex(currentIndex);
        break;
      case keys.down:
        gotoSubIndex(this.parentNode.parentElement, subIndex + 1);
        break;
      case keys.up:
        gotoSubIndex(this.parentNode.parentElement, subIndex - 1);
        break;
      case keys.enter:
      case keys.space:
        alert(this.innerText);
        break;
    }
    event.preventDefault();
    event.stopPropagation();
    return false;
  });
  el.addEventListener("click", function(event) {
    alert(this.innerHTML);
    event.preventDefault();
    event.stopPropagation();
    return false;
  });
});
