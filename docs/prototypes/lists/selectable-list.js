const keys = {
  tab: 9,
  enter: 13,
  esc: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

const listItems = document.getElementsByTagName("li");
let selectedIndex = 0;
let kbFocusIndex = 0;

function applySelection(index) {
  if (index >= listItems.length || index < 0) {
    return;
  }
  kbFocusIndex = index;
  listItems[selectedIndex].setAttribute("tabindex", "-1");
  listItems[selectedIndex].removeAttribute("aria-selected");
  selectedIndex = index;
  listItems[selectedIndex].focus();
  listItems[selectedIndex].setAttribute("tabindex", "0");
  listItems[selectedIndex].setAttribute("aria-selected", "true");

  window.alert(`${
    listItems[selectedIndex]
      .getElementsByClassName("info-card-right-title")
      .item(0).textContent
  }
    says
    ${
      listItems[selectedIndex]
        .getElementsByClassName("info-card-right-msg")
        .item(0).textContent
    }`);
}

function applyKbFocus(index) {
  if (index >= listItems.length || index < 0) {
    return;
  }
  listItems[kbFocusIndex].setAttribute("tabindex", "-1");
  kbFocusIndex = index;
  listItems[kbFocusIndex].focus();
  listItems[kbFocusIndex].setAttribute("tabindex", "0");
}

function getIndexInList(child) {
  return $(child)
    .closest("li")
    .index();
}

for (let index = 0; index < listItems.length; index++) {
  const item = listItems.item(index);
  if (index === 0) {
    item.setAttribute("tabindex", "0");
  } else {
    item.setAttribute("tabindex", "-1");
  }
  item.setAttribute("aria-setsize", listItems.length);
  item.setAttribute("aria-posinset", index + 1);
  item.addEventListener("click", event => {
    applySelection(getIndexInList(event.target));
  });
  item.addEventListener("keydown", event => {
    switch (event.keyCode) {
      case keys.down:
        applyKbFocus(kbFocusIndex + 1);
        break;
      case keys.up:
        applyKbFocus(kbFocusIndex - 1);
        break;
      case keys.enter:
      case keys.space:
        applySelection(kbFocusIndex);
        break;
      default:
        break;
    }
    if (event.shiftKey) {
    }
  });
}
