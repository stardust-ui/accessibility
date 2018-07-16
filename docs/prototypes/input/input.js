var buttons = document.querySelectorAll('.input-container button');
var buttonsArray = [].slice.apply(buttons);

buttonsArray.map(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        var input = e.target.parentElement.querySelector('input');
        var inputText = input.value.trim();
        if (inputText) {            
            alert('Your input text is: ' + inputText);
            input.value = '';
        }
    });
});

var buttons = document.querySelectorAll('.textarea-container button');
var buttonsArray = [].slice.apply(buttons);

buttonsArray.map(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        var ta = e.target.parentElement.querySelector('textarea');
        var inputText = ta.value.trim();
        if (inputText) {            
            alert('Your textarea text is: ' + inputText);
            ta.value = '';
        }
    });
});

var clearBtn = document.querySelector('.clear-btn');
clearBtn.addEventListener('click', function(e) {
    var input = e.target.parentElement.querySelector('input');
    input.value = '';    
});