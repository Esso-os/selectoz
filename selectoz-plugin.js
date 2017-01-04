function selectoz(opts) {
        
        var keyCodes = {
                up: 38,
                down: 40,
                pageup: 33,
                pagedown: 34,
                home: 36,
                end: 35,
                ctrl: 17,
                enter: 13,
                tab: 9
            },
        
            select = document.getElementsByTagName('select'),
            isFocused = false,
            controlPressed = false,
            multiCount = 0,
            hasClass,
            splitedTag,
            tagName,
            t,
            isSelectTag,
            selectHTML,
            selectList,
            sll,
            selectString;
        
        // plugin options
        opts.icon.focus != null ? opts.icon.focus : '';
        opts.icon.blur != null ? opts.icon.blur : '';
        
        
        each(select, (i, selectElem) => {
            selectHTML = selectElem.outerHTML.replace(/\n/g, '');
            selectList = selectHTML.split('>');
            sll = selectList.length;
            
            // loop through each element tag
            for (t = 0; t < sll; t++) {
                if (selectList[t] != "") {
                    isSelectTag = false;
                    selectList[t] = selectList[t].trim();
                    selectString = selectList[t];
                    // if not closing tag
                    if (/^(<\w+)/.test(selectString)) {
                        // replace native attributes with data- prefix
                        tagName = selectString.match(/\w+/)[0];
                        if (/<select/.test(selectString)) {
                            isSelectTag = true;
                            selectString = selectString.replace(/(autofocus|name|disabled|multiple)/g, 'data-$1');
                            // replace with ul element
                            selectString = selectString.replace(/\w+/, 'ul');
                        } else {
                            // element tag name
                            if (tagName === 'option') {
                                selectString = selectString.replace(/\w+/, 'li');
                            } else {
                                // optgroup
                                selectString = selectString.replace(/\w+/, 'div');
                            }
                            selectString = selectString.replace(/(disabled|value|selected|label)/g, "data-$1");
                        }

                        if (/class=/.test(selectString)) {
                            selectString = selectString.replace(/(class=('|"))+/, ` $1${tagName}`);
                        } else if (/class/.test(selectString)) {
                            selectString = selectString.replace(/class/, ` class='${tagName}'`);
                        } else {
                            selectString += ` class='${tagName}'`;
                        }
                        if (isSelectTag) {
                            selectString = `${selectString} ><li class="select-input"><span class="selected-value"></span><i class=' ${opts.icon.blur}'></i></li><div`;
                        }
                    } else {
                        // closing tag
                        if (/option/.test(selectString)) {
                            selectString = selectString.replace(/(<\/)\w+/, '</li');
                        } else if (/select/.test(selectString)) {
                            selectString = `</div> ${selectString.replace(/(<\/)\w+/, '</ul')}`;
                        } else {
                            selectString = selectString.replace(/(<\/)\w+/, '</div');
                        }
                    }
                }
                selectList[t] = selectString;
            }
            selectList = selectList.join('>');
            selectList = `<div tabindex='0' class="selectoz-outer">${selectList}</div>`; 
            selectElem.insertAdjacentHTML('afterend', selectList);
            selectElem.style.display = 'none';
        });
        
        var selectOz = [].slice.call(document.getElementsByClassName('selectoz-outer')),
            activeselectOz,
            activeSelectOzOuterIndex = 0,
            multiSelectedCount = 0,
            // to prevent toggle active class from focused div
            checkOnce = 1,
            clickedIndex = [],
            activeSelect,
            target, epath,
            epathEl, multipleSelect = false,
            activeSelectOzOptionsLen,
            activeSelectOzOuterOptions,
            activeOptionIndex,
            activeOpt,
            activeSOOpt,
            activeSelectOptions,
            pressedKey,
            optGLabel;
        
        each(selectOz, (i, el)=> {
            // set selectedValue 
            selectValue(el);
            
            // clickevent
            el.onclick = (e)=> {
                epath = e.path;
                target = e.target;
                
                while(epath) {
                    epathEl = epath.shift();
                    if(epathEl.classList.contains('selectoz-outer')) {
                        activeselectOz = epathEl;
                        break;
                    }
                }
                
                /* select outer */
                activeSelectOzOuterOptions = [].slice.call(activeselectOz.getElementsByClassName('option'));
                activeOptionIndex = activeSelectOzOuterOptions.indexOf(target);
                activeSelect = select[activeSelectOzOuterIndex];
                
                activeSelectOptions = [].slice.call(activeSelect.getElementsByTagName('option'));
                activeOpt = activeSelectOptions[activeOptionIndex];
                multipleSelect = /data-multiple/.test(activeselectOz.innerHTML);
                /* select content */
                if (target.classList.contains('select-input')) {
                    if (!checkOnce) {
                        activeselectOz.classList.toggle('active-selectoz');
                        (activeselectOz.classList.contains('active-selectoz')) ?
                            toggleIcon(activeselectOz, opts.icon.blur, opts.icon.focus) :
                            toggleIcon(activeselectOz, opts.icon.focus, opts.icon.blur);
                    } else {
                        checkOnce = 0;
                    }
                } else if (target.classList.contains('option')) {
                    if(!multipleSelect) {
                        removeSelected(activeSelectOzOuterOptions, 'data-selected');
                        removeSelected(activeSelectOptions,'selected');
                        target.setAttribute('data-selected', '');
                        activeOpt.setAttribute('selected', '');
                    } else {
                        activeselectOz.classList.add('active-selectoz');
                        if(!controlPressed) {
                            removeSelected(activeSelectOzOuterOptions,'data-selected');
                            removeSelected(activeSelectOptions,'selected');
                            target.setAttribute('data-selected', '');
                            activeOpt.setAttribute('selected', '')
                            multiSelectedCount = 0;
                        } else {
                            if (target.getAttribute('data-selected') === null) {
                                multiSelectedCount++;
                                target.setAttribute('data-selected', '');
                                activeOpt.setAttribute('selected', '');
                            } else {
                                if (multiSelectedCount) {
                                    target.removeAttribute('data-selected');
                                    activeOpt.removeAttribute('selected', '')
                                    multiSelectedCount--;
                                }
                            }
                        }
                    }
                }
                
                activeSelectOzOptionsLen = activeSelectOzOuterOptions.length;
                while(--activeSelectOzOptionsLen > -1) {
                    activeSOOpt = activeSelectOzOuterOptions[activeSelectOzOptionsLen];
                    if(activeSOOpt.getAttribute('data-selected') != null) {
                        activeOptionIndex = activeSelectOzOuterOptions.indexOf(activeSOOpt);
                        break;
                    }
                }
                selectValue(activeselectOz);
                selectOzKeysInit(document.getElementsByClassName('active-selectoz'));
            };
        });
        
        each(selectOz, (i, sOz) => {
        // set text from label
            each(sOz.getElementsByClassName('option'), (i, opt)=> {
                if(opt.getAttribute('data-label')) {
                    opt.textContent = opt.getAttribute('data-label');
                }
            });
        
            each(sOz.getElementsByClassName('optgroup'), (i, optG) => {
                optGLabel = optG.getAttribute('data-label');
                optG.insertAdjacentHTML('afterbegin', `<div class="label-value">${optGLabel}</div>`)
            });
        });
        // disabled content 
        each(selectOz, (io,el) => {
            var elD = el.getElementsByTagName('*');
            each(elD, (i,elem) => {
                if (elem.getAttribute('data-disabled') != null){
                    elem.insertAdjacentHTML('beforeend','<div class="disabled-content"></div>')
                }   
            });
        });
        
        // focus/blur
        each(selectOz, (i, elem) => {
            elem.onfocus = (e) => {
                elem.classList.add('active-selectoz');
                activeselectOz = document.getElementsByClassName('active-selectoz')[0];
                activeSelectOzOuterIndex = selectOz.indexOf(activeselectOz);
                activeSelectOzOuterOptions = [].slice.call(activeselectOz.getElementsByClassName('option'));
                
                each(activeSelectOzOuterOptions, (i, opt) => {
                    if (opt.getAttribute('data-selected') != null) {
                        activeOptionIndex = i;
                    }
                });
                activeSelect = select[activeSelectOzOuterIndex];
                activeSelectOptions = activeSelect.getElementsByTagName('option');
                selectOzKeysInit(activeselectOz);
                toggleIcon(elem, opts.icon.blur, opts.icon.focus);
            };
            elem.onblur = (e) => {
                elem.classList.remove('active-selectoz');
                checkOnce = 1;
                toggleIcon(elem, opts.icon.focus, opts.icon.blur);
            };
        });
        
        function toggleIcon(elem, removeClass, addClass) {
            elem.getElementsByClassName('select-input')[0].getElementsByTagName('i')[0].classList.remove(removeClass);
            elem.getElementsByClassName('select-input')[0].getElementsByTagName('i')[0].classList.add(addClass);
        }
        
        // select onkeydown
        function selectOzKeysInit(activeSO) {
            window.onkeydown = (e) => {
                if (document.getElementsByClassName('active-selectoz')[0]) {
                    pressedKey = e.which;
                    if (keyCodes.ctrl === e.which) controlPressed = true;
                    switch (pressedKey) {
                        case keyCodes.down:
                            // if not last opt
                            if (activeOptionIndex < (activeSelectOzOuterOptions.length - 1)) {
                                activeOptionIndex += 1;
                                selectOnKeydown(activeOptionIndex);
                            }
                            break;
                        case keyCodes.up:
                            if (activeOptionIndex > 0) {
                                activeOptionIndex -= 1;
                                selectOnKeydown(activeOptionIndex);
                            }
                            break;
                        case keyCodes.pagedown || keyCodes.end:
                            activeOptionIndex = activeSelectOzOuterOptions.length - 1;
                            selectOnKeydown(activeOptionIndex);
                            break;
                        case keyCodes.pageup || keyCodes.home:
                            activeOptionIndex = 0;
                            selectOnKeydown(activeOptionIndex);
                            break;
                        case keyCodes.enter:
                            activeselectOz.classList.toggle('active-selectoz');
                            toggleIcon(activeselectOz, opts.icon.focus, opts.icon.blur);
                        default:
                            break;
                    }
                    selectValue(activeselectOz);
                }
            };
        }
        
        function selectValue(aSOO) {
            var aSOOpt = aSOO.getElementsByClassName('option');
            each(aSOOpt, function (i, opt) {
                if (opt.getAttribute('data-selected') != null) {
                    aSOO.getElementsByClassName('selected-value')[0].textContent = opt.textContent;
                }
            });
        }
        
        function selectOnKeydown(s) {
            removeSelected(activeSelectOzOuterOptions, 'data-selected');
            removeSelected(activeSelectOptions, 'selected');
            
            if (activeSelectOzOuterOptions[s].getAttribute('data-disabled') != null) {
                if (pressedKey === keyCodes.up) s -= 1;
                else if (pressedKey === keyCodes.down) s += 1;
                activeOptionIndex = s;
            }
            activeSelectOzOuterOptions[s].setAttribute('data-selected', '');
            activeSelectOptions[s].setAttribute('selected', '');
        }
        
        window.onkeydown = (e)=> {
            if (e.which === keyCodes.ctrl) {
                controlPressed = true;
            }
        };
        
        window.onkeyup = (e) => {
            controlPressed = false;
        }
    }
    
    function each(elem, cb) {
        var el = elem, l = el.length, i = 0;
        for(;i < l;i++) {
            cb.call(el[i], i, el[i]);
        }
    }
    function removeSelected(elems, attr) {
        each(elems, (i, el) => {
            el.removeAttribute(attr);
        });
    }
