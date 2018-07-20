const keys = {
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

function SelectableList(node, itemRole) {
  this.listItems = [].slice.apply(node.querySelectorAll("[role='" + itemRole + "']"));
  this.itemRole = itemRole;
  this.parentNode = node;
}

SelectableList.prototype.init = function() {
  this.selectedIndex = 0;
  this.kbFocusIndex = 0;

  for (let index = 0; index < this.listItems.length; index++) {
    const item = this.listItems[index];
    if (index === 0) {
      item.setAttribute("tabindex", "0");
    } else {
      item.setAttribute("tabindex", "-1");
    }
  
    item.setAttribute("aria-selected", false);
    item.setAttribute("aria-setsize", this.listItems.length);
    item.setAttribute("aria-posinset", index + 1);
    item.addEventListener("click", event => {
      this.applySelection(this.getIndexInList(event.target));
    });
  
    // When navigate using Screen Reader shortcuts, we have to handle indexes based on focus event
    item.addEventListener('focus', event => {
      this.listItems[this.kbFocusIndex].setAttribute("tabindex", "-1");
      var currIndex = this.getIndexInList(event.target);
      this.kbFocusIndex = currIndex;
      this.listItems[this.kbFocusIndex].setAttribute("tabindex", "0");
    });
    item.addEventListener("keydown", event => {
      switch (event.keyCode) {
        case keys.down:
          this.applyKbFocus(this.kbFocusIndex + 1);
          break;
        case keys.up:
          this.applyKbFocus(this.kbFocusIndex - 1);
          break;
        case keys.enter:
        case keys.space:
          this.applySelection(this.kbFocusIndex);
          break;
        case keys.home:
          this.applyKbFocus(0);
          break;
        case keys.end:
          this.applyKbFocus(this.listItems.length - 1);
          break;
      }
    });
  }
}

SelectableList.prototype.applySelection = function(index) {
  if (index >= this.listItems.length || index < 0) {
    return;
  }
  this.kbFocusIndex = index;
  this.listItems[this.selectedIndex].setAttribute("tabindex", "-1");
  this.listItems[this.selectedIndex].setAttribute("aria-selected", false);
  this.selectedIndex = index;
  this.listItems[this.selectedIndex].focus();
  this.listItems[this.selectedIndex].setAttribute("tabindex", "0");
  this.listItems[this.selectedIndex].setAttribute("aria-selected", "true");
  var id = this.listItems[this.selectedIndex].id;

  if (id) {
    this.parentNode.setAttribute('aria-activedescendant', id);
  }
  else {
    this.parentNode.removeAttribute('aria-activedescendant');
  }

  window.alert(this.listItems[this.selectedIndex]
    .getElementsByClassName("info-card-right-title")
    .item(0).textContent + ' says ' + this.listItems[this.selectedIndex].getElementsByClassName("info-card-right-msg").item(0).textContent);
}

SelectableList.prototype.applyKbFocus = function(index) {
  if (index >= this.listItems.length || index < 0) {
    return;
  }
  this.listItems[index].focus();
}

SelectableList.prototype.getIndexInList = function(child) {
  return this.listItems.indexOf(child.getAttribute('role') === this.itemRole ? child : child.parentElement);
}
