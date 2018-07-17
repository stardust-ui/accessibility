function Accordions() {
    var accordions = document.querySelectorAll('.accordion-container');
    [].slice.apply(accordions).map(function(accordion) {
        var accordion = new Accordion(accordion);
        accordion.init();
    });
}

function Accordion(node) {
    this.accordionContainer = node;
    this.list = this.accordionContainer.querySelector('.listbox');
    this.listItems = [].slice.apply(this.list.querySelectorAll('li'));
    this.button = this.accordionContainer.querySelector('.expand-btn');

    this.keys = {
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        left: 37,
        up: 38,
        right: 39,
        down: 40
      };
}

Accordion.prototype.init = function() {
    this.button.addEventListener('click', function() {
        toggle(this);
    });

    this.button.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            case this.keys.right:
                if (isExpanded(event.target)) {
                    focusSelectableListFirstItem(this.list);
                }
                else {
                    expand(event.target);
                }
            break;
            case this.keys.left:
                collapse(event.target);
            break;
        }
    }.bind(this));

    this.listItems.map(function(li) {
        li.addEventListener('keydown', function(event) {
            switch(event.keyCode) {
                case this.keys.left: {
                    collapse(this.button);
                    this.button.focus();
                    break;
                }
            }
        }.bind(this));
    }.bind(this));

}

function toggle(button) {
    var currentState = button.getAttribute('aria-expanded');
    var nextState = currentState === 'true' ? false : true;
    button.setAttribute('aria-expanded', nextState);
}

function expand(button) {
    button.setAttribute('aria-expanded', true);
}

function isExpanded(button) {
    return button.getAttribute('aria-expanded') === 'true';
}

function collapse(button) {
    button.setAttribute('aria-expanded', false);
}

function focusSelectableListFirstItem(list) {
    var firstItem = list.querySelector('li:first-child');
    firstItem.focus();
}