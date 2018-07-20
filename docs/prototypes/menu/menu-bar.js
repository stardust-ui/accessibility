var appsMenuItems = [].slice.apply(document.querySelectorAll(
  "#appmenu > li > [role='menuitem']"
));
var subMenuItems = [].slice.apply(document.querySelectorAll(
  "#appmenu > li li [role='menuitem']"
));
var keys = {
  tab: 9,
  enter: 13,
  esc: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  end: 35,
  home: 36
};
var currentIndex, subIndex;
var firstMenuItemChars = [];
// Prevent focus on first submenu item, if click action
// wasn't triggered by screen reader
var preventFocusOnFirstSubMenuItem = false;

Array.prototype.forEach.call(appsMenuItems, function (el, i) {
  var textContent = el.textContent.trim();
  firstMenuItemChars.push(textContent.substring(0, 1).toLowerCase());

  if (0 == i) {
    el.addEventListener("focus", function () {
      currentIndex = 0;
    });
  }
  el.addEventListener("focus", function (event) {
    subIndex = 0;
    Array.prototype.forEach.call(appsMenuItems, function (el, i) {
      el.setAttribute("aria-expanded", "false");
      el.tabIndex = -1;
    });

    event.target.tabIndex = 0;
  });
  el.addEventListener("click", function (event) {
    // does not contain popup menu, do action
    if (!hasPopup(this)) {
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
  el.addEventListener("mouseout", function (event) {
    preventFocusOnFirstSubMenuItem = false;
  });
  el.addEventListener("mouseenter", function (event) {
    preventFocusOnFirstSubMenuItem = true;
  });
  el.addEventListener("keydown", function (event) {
    var char = event.key;

    switch (event.keyCode) {
      case keys.right:
        gotoIndex(currentIndex + 1);
        break;
      case keys.left:
        gotoIndex(currentIndex - 1);
        break;
      case keys.tab:
        if ((event.shiftKey && currentIndex === 0) ||
         (!event.shiftKey && currentIndex === appsMenuItems.length - 1)) {
          return;
        }
        if (event.shiftKey) {
          gotoIndex(currentIndex - 1);
        } else {
          gotoIndex(currentIndex + 1);
        }
        break;
      case keys.down:
        if (hasPopup(this)) {
          this.click();
          subindex = 0;
          var submenu = this.parentElement.querySelector('[role="menu"]');
          if (submenu) {
            gotoSubIndex(submenu, 0);
          }

        }
        break;

      case keys.enter:
      case keys.space:
        this.click();
        subindex = 0;
        var submenu = this.parentElement.querySelector('[role="menu"]');
        if (submenu) {
          gotoSubIndex(submenu, 0);
        }
        break;

      case keys.up:
        if (hasPopup(this)) {
          this.click();
          var submenu = this.parentElement.querySelector('[role="menu"]');
          if (submenu) {
            subindex = submenu.querySelectorAll("[role='menuitem']").length - 1;
            gotoSubIndex(submenu, subindex);
          }
        }
        break;

      case keys.home:
        gotoIndex(0);
        break;

      case keys.end:
        gotoIndex(appsMenuItems.length - 1);
        break;
      
      default:
        if (isPrintableCharacter(char)) {
          setFocusByFirstCharacter(this, char);
        }
        
        break;

    }
    event.preventDefault();
  });
});

Array.prototype.forEach.call(subMenuItems, function (el, i) {

  el.addEventListener("keydown", function (event) {
    var char = event.key;

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

      case keys.home:
        gotoSubIndex(this.parentNode.parentElement, 0);
        break;

      case keys.end:
        gotoSubIndex(this.parentNode.parentElement, -1);
        break;
      
      default: 
        if (isPrintableCharacter(char)) {
            setFocusByFirstCharacterToSubMenuItem(this.parentNode.parentElement, this, char);
        }

    }
    event.preventDefault();
    event.stopPropagation();
    return false;
  });

  el.addEventListener("click", function (event) {
    alert(this.innerHTML);
    event.preventDefault();
    event.stopPropagation();
    return false;
  });
});

function hasPopup(element) {
  return element.nextElementSibling && element.nextElementSibling.getAttribute('role') === 'menu';
}

var gotoIndex = function (idx) {
  if (idx == appsMenuItems.length) {
    idx = 0;
  } else if (idx < 0) {
    idx = appsMenuItems.length - 1;
  }

  currentIndex = idx;
  appsMenuItems[currentIndex].focus();
};

var gotoSubIndex = function (menu, idx) {
  var items = menu.querySelectorAll("[role='menuitem']");
  if (idx == items.length) {
    idx = 0;
  } else if (idx < 0) {
    idx = items.length - 1;
  }
  items[idx].focus();
  subIndex = idx;
};

function setFocusByFirstCharacter (currentItem, char) {
  var start, index, char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = appsMenuItems.indexOf(currentItem) + 1;
  if (start === appsMenuItems.length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(start, char, firstMenuItemChars);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(0, char, firstMenuItemChars);
  }

  // If match was found...
  if (index > -1) {
    this.gotoIndex(index);
  }
};

function setFocusByFirstCharacterToSubMenuItem(menu, currentItem, char) {
  var start, index, char = char.toLowerCase();
  var firstChars = [];

  var items = [].slice.apply(menu.querySelectorAll("[role='menuitem']"));

  items.map(function(item) {
    var textContent = item.textContent.trim();
    firstChars.push(textContent.substring(0, 1).toLowerCase());
  });

  // Get start index for search based on position of currentItem
  start = items.indexOf(currentItem) + 1;
  if (start === items.length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(start, char, firstChars);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(0, char, firstChars);
  }

  // If match was found...
  if (index > -1) {
    this.gotoSubIndex(menu, index);
  }

}

function getIndexFirstChars(startIndex, char, firstChars) {
  for (var i = startIndex; i < firstChars.length; i++) {
    if (char === firstChars[ i ]) {
      return i;
    }
  }
  return -1;
};

function isPrintableCharacter (str) {
  return str.length === 1 && str.match(/\S/);
}