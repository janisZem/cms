PAGE = {
    x: 0,
    y: 0,
    constr: function (elem, event) { //sitas driizaak pie element
        var id = elem.id;
        var arr = {
            'paragaph': 'TEXT'
        };
        for (var i = 0; i < count(arr); i++) {
            if (arr[i].indexOf("paragaph") === 0) {

            }
        }
    },
    POPUP: {
        open: function (elem) {
            var h = window.pageYOffset + window.outerHeight;
            var top = window.pageYOffset + window.outerHeight / 2;
            var $popup_box = $('#popup_box');
            $popup_box.children('textarea').val(PAGE.ELEMENT.TEXT.getValue(elem)); //fixme - can be !ELEMENT.TEXT
            $popup_box.attr('style', 'display:inline; top:' + top + 'px;');
            $('#hider').attr('style', 'display:inline; height:' + h + 'px;');
            $('body').attr('style', 'overflow:hidden;');
            PAGE.ELEMENT.EDITTOOLS.hide(elem);
            $('#pop_up_save').attr('onclick', 'PAGE.POPUP.save(' + elem.id + ')');
        },
        close: function () {
            $('#popup_box').hide();
            $('#hider').hide();
            $('body').attr('style', 'overflow:auto;');
        },
        save: function (elem) {
            //can not be text
            PAGE.ELEMENT.TEXT.setValue(elem, $('#popup_box').children('.pop-up-text').val());
            PAGE.POPUP.close();            
        }
    },
    centerX: function () {
        return window.innerWidth / 2;
    },
    centerY: function () {
        return window.pageYOffset + (window.outerHeight / 2);
    },
    xOffset: function () {
        var countX = (PAGE.x + 200 - PAGE.centerX());
        if (countX > 9) {
            countX += 10;
        } else {
            countX = 10;
        }
        return ((window.innerWidth / 2) + countX) - 200;
    },
    yOffset: function () {
        var countY = (PAGE.y + 200 - PAGE.centerY());
        if (countY > 19) {
            countY += 20;
        } else {
            countY = 20;
        }
        return (window.pageYOffset + window.outerHeight / 2) + countY - 200;
    },
    MOUSEMENU: {
        show: function () {
        },
        hide: function () {
            $('#mouse_menu').removeClass('show');
        }
    },
    ELEMENT: {
        SETDRAGGABLE: function ($elem) {

        },
        save: function (elem) {

            if (elem.id.indexOf("paragaph") === 0) {
                PAGE.ELEMENT.TEXT.save(elem);
            }
        },
        edit: function () {

        },
        EDITTOOLS: {
            shown: false,
            show: function (elem) {
                if ($('#edit_tools_' + elem.id).length) { //edit tools already shown
                    return;
                }
                PAGE.ELEMENT.EDITTOOLS.hide();
                var editTools = '<div id="edit_tools_' + elem.id + '" class="editTools">';
                var status = PAGE.ELEMENT.status(elem);
                if (status === '0000') { //save
                    editTools += '<div id="elem_save_' + elem.id + '"'
                            + '        onclick="PAGE.ELEMENT.save(' + elem.id + ')"'
                            + '        class="edit-tool-item">Saglabāt'
                            + '   </div>';
                } else if (status === '0001') { //edit
                    editTools += '<div id="elem_save_' + elem.id + '"'
                            + '        onclick="PAGE.ELEMENT.edit(' + elem.id + ')"'
                            + '        class="edit-tool-item">Labot'
                            + '   </div>';
                }
                editTools += '<div onclick="PAGE.POPUP.open(' + elem.id + ')" class="edit-tool-item">Formatēt</div>';
                editTools += '<div onclick="PAGE.ELEMENT.delete(' + elem.id + ')" class="edit-tool-item">Dzēst</div>';
                editTools += '</div>';
                $(elem).children().first().before(editTools);
                PAGE.ELEMENT.EDITTOOLS.shown = true;
            },
            hide: function () {
                $('.editTools').remove();
            }

        },
        INSERT: function (elemText, id) {
            PAGE.MOUSEMENU.hide();
            $('body').append(elemText);
            $('#' + id).draggable({
                scroll: true,
                drag: function (e, ui) {
                    if (e.pageX >= window.innerWidth) {
                        ui.position.left = 0; //stop scroll if x is out of display
                    }
                }
            });
            $('#' + id).resizable();
        },
        TEXT: {
            create: function (opener) {
                if (opener === 'h') { //header menu
                    PAGE.y = PAGE.yOffset();
                    PAGE.x = PAGE.xOffset();
                }
                var id = newId(); ///
                var elem = '<div id="paragaph' + id + '"\n\
                     onmouseover="PAGE.ELEMENT.EDITTOOLS.show(this)" \n\
                     ondblclick="PAGE.ELEMENT.TEXT.edit(this)"\n\
                     style="margin-left:' + PAGE.x + 'px; margin-top:' + PAGE.y + 'px;" \n\
                     class="draggable" \n\
                     class="ui-widget-content">'
                        + '  <textarea placeholder="Edit me!" class="draggable-textbox"></textarea>'
                        + '  <input id="status_paragaph' + id + '" type="hidden" value="0000"/>'
                        + '</div>';
                PAGE.ELEMENT.INSERT(elem, 'paragaph' + id);
            },
            save: function (elem) {
                var $elem = $(elem);
                var text = $elem.children('textarea').val();
                var textTrim = text; //do not trim orginal (can be formated)
                if (textTrim.trim() === "" && PAGE.ELEMENT.status(elem) === '0000') {
                    text = "{no text}";
                }
                $elem.children('textarea').remove();
                $elem.append('<p style="word-wrap: break-word; margin:0px;" calss="paragaph-content">' + text + '</p>'); //static styling?
                PAGE.ELEMENT.setStatus(elem, '0001');
                PAGE.ELEMENT.EDITTOOLS.hide();
            },
            edit: function (elem) {
                console.log('test');
                if (PAGE.ELEMENT.status(elem) === '0000') {
                    return;
                }
                var $elem = $(elem);
                var text = $elem.children('p').text();
                $elem.children('p').remove();
                $elem.append('<textarea class="draggable-textbox">' + text + '</textarea>');
                PAGE.ELEMENT.EDITTOOLS.hide(elem);
                PAGE.ELEMENT.setStatus(elem, '0000');

            },
            setValue: function (elem, val) {
                var status = PAGE.ELEMENT.status(elem);
                if (status === '0000') {
                    $(elem).children('textarea').val(val);
                }
                if (status === '0001') {
                    $(elem).children('p').text(val);
                }
            },
            getValue: function (elem) {
                var status = PAGE.ELEMENT.status(elem);
                if (status === '0000') {
                    return $(elem).children('textarea').val(); //magic?
                }
                if (status === '0001') {
                    return $(elem).children('p').text();
                }
            }
        },
        LINK: {
        },
        status: function (elem) {
            return $('#status_' + elem.id).val();
        },
        setStatus: function (elem, status) {
            $('#status_' + elem.id).val(status);
        },
        delete: function (elem) {
            $(elem).remove();
        }
    }
};
function newId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}

$(document).keydown(function (e) {
    if (e.keyCode === 27) { //esc  
        $('#mouse_menu').removeClass('show');
        PAGE.POPUP.close()();
    }
});
/*
 * 
 * some events may be saved to url, for page refresh and golbal variables
 * add alert on page leave or refresh
 */
if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
        if (e.button === 2) {
            PAGE.x = e.clientX; //!!!!
            PAGE.y = e.pageY;
            var $menu = $('#mouse_menu');
            $menu.addClass('show');
            $menu.attr('style', 'margin-left:' + PAGE.x + 'px; margin-top:' + PAGE.y + 'px;');
        }
        e.preventDefault();
    }, false);
}
