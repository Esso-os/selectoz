window.onload = function () {
    'use strict';
    var keyCodes = {
            up: 38,
            down: 40,
            pageup: 33,
            pagedown: 34,
            home: 36,
            end: 35,
            ctrl: 17
        },
        
        select = document.getElementById('select'),
        multiSelect = select.getAttribute('data-multiple-select'),
        selectedInput = select.getElementsByClassName('select-input')[0],
        selectedVal = select.getElementsByClassName('selected-value')[0],
        option = [].slice.call(select.getElementsByClassName('option')),
        selectedIndex;
    
    function removeSelected() {
        forEach(option, function (i,el) {
            el.setAttribute('data-selected', 'false');
        });
    }
    
    function setSelectedVal() {
        forEach(option, function (i,el) {
            if (el.getAttribute('data-selected') === 'true') {
                selectedVal.textContent = el.textContent;
                selectedIndex = i;
            }
        });
    }
    setSelectedVal();
    
    var isCTRL = false,
        multiCount = 0;
    
    forEach(option, function (i,el) {
        el.onclick = function (e) {
            e.preventDefault();
            if (multiSelect === 'false') {
                removeSelected();
                el.setAttribute('data-selected', 'true');
            } else {
                // if ctrl not pressed then set selected for clicked item only
                if(!isCTRL) { removeSelected(); }
                
                if (el.getAttribute('data-selected') === 'false') {
                    if (isCTRL) {
                        Math.min(multiCount++, (option.length - 1));
                    }
                    
                    el.setAttribute('data-selected', 'true');
                    console.log('selected false '+multiCount)
                } else {
                    if (multiCount) {
                        el.setAttribute('data-selected', 'false');
                    }
                    if (isCTRL) {
                        multiCount--;
                        if (multiCount < 0) {
                            multiCount = 0;
                            return;
                        }
                    }
                }
            }
            
            setSelectedVal();
            selectedIndex = option.indexOf(el);
        };
    });
    
    window.addEventListener('keydown', function (e) {
        if (keyCodes.ctrl == e.which) isCTRL = true;
        
        if (select.classList.contains('focused')) {
            switch (e.which) {
                case keyCodes.down:
                    if ((selectedIndex + 1) % option.length) {
                        selectedIndex += 1;
                        keyDownSelected(selectedIndex);
                    }
                    break;
                case keyCodes.up:
                    if (selectedIndex > 0) {
                        selectedIndex -= 1;
                        keyDownSelected(selectedIndex);
                    }
                    break;
                case keyCodes.pagedown || keyCodes.end:
                    selectedIndex = option.length - 1;
                    keyDownSelected(selectedIndex);
                    break;
                case keyCodes.pageup || keyCodes.home:
                    selectedIndex = 0;
                    keyDownSelected(selectedIndex);
                    break;
                default:
                    break;
            }
        }
    });
    
    window.onkeyup = ()=> {
        isCTRL = false;
    }
    
    window.onclick = (e)=> {
        var t = e.path;
        while(t.length) {
            if (t[0].id === 'select') { break; }
            
            if (t.length === 1 && t[0].id != 'select') {
                selectBlur();
                return;
            }
            t.shift();
        }
    }
    
    selectedInput.onclick = function () {
        if (!select.classList.contains('focused')) {
            selectFocus();
        } else {
            selectBlur();
        }
    };
    
    function keyDownSelected(s) {
        removeSelected();
        option[s].setAttribute('data-selected', 'true');
        setSelectedVal();
    }
    
    function selectBlur() {
        select.classList.remove('focused');
    }
    
    function selectFocus() {
        select.classList.add('focused');
    }
};

function forEach(elem, cb) {
    var e = elem, i = 0, l = e.length;
    for (; i < l; i++) {
        cb.call(e[i], i, e[i]);
    }
}
