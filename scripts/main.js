var x = 0;
var y = 0;

$(document).keydown(function (e) {
    if (e.keyCode === 27) { //esc  
        $('#mouse_menu').removeClass('show');
        hidePopUp();
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
            x = e.clientX; //!!!!
            y = e.pageY;
            $('#mouse_menu').addClass('show');
            $('#mouse_menu').attr('style', 'margin-left:' + x + 'px; margin-top:' + y + 'px;');
        }
        e.preventDefault();
    }, false);
}
/*
 * 
 * @param {int} type: 1 - paragraph(text)
 * @param {char} opener: h - header menu, m - mouse menu
 * @returns create new html element
 */
function createElem(type, opener) {
    $('#mouse_menu').removeClass('show');
    if (type === 1) {
        $('body').append(createParagraph(opener));
    }
    $(".draggable").draggable({
        scroll: true,
        drag: function (e, ui) {
            if (e.pageX >= window.innerWidth) {
                ui.position.left = 0; //stop scroll if x is out of display
            }
        }
    });
    $(".draggable").resizable();
    //$('.draggable-textbox').wysiwyg();
}
/*
 * status - 0000 - created, 0001 - saved
 * @returns {String}
 */
function createParagraph(opener) {
    var countX = x - window.innerWidth / 2;
    var countY = y - (window.pageYOffset + (window.outerHeight / 2));
    console.log('x ' + x);
    console.log(y);
    console.log('countY ' + countY);
    console.log('countX ' + countX);
    if (countX > 9) { //at different position 
        countX += 10;
    } else {
        countX = 10;
    }
    if (countY > 19) {
        countY += 20;
    } else {
        countY = 20;
    }
    if (opener === 'h') { //header menu
        console.log(countY);
        y = (window.pageYOffset + window.outerHeight / 2) + countY;
        x = ((window.innerWidth / 2) + countX);
    }
    var id = newId();
    var elem = '<div id="paragaph' + id + '"\n\
                     onmouseover="showEditTools(this)" \n\
                     ondblclick="editElem(this)"\n\
                     style="margin-left:' + x + 'px; margin-top:' + y + 'px;" \n\
                     class="draggable" \n\
                     class="ui-widget-content">'
            + '  <textarea placeholder="Edit me!" class="draggable-textbox"></textarea>'
            + '  <input id="status_paragaph' + id + '" type="hidden" value="0000"/>'
            + '</div>';
    return elem;
}

//ispeejams vajdzees taisiit katram elem savu editTools
function showEditTools(elem) {
    if ($('#edit_tools_' + elem.id).length) { //edit tools already shown
        return;
    }
    $('.editTools').remove();
    var editTools = '<div id="edit_tools_' + elem.id + '" class="editTools">';
    var status = getElemStatus(elem);
    if (status === '0000') { //save
        editTools += '<div id="elem_save_' + elem.id + '"'
                + '        onclick="saveElem(' + elem.id + ')"'
                + '        class="edit-tool-item">Saglabāt'
                + '   </div>';
    } else if (status === '0001') { //edit
        editTools += '<div id="elem_save_' + elem.id + '"'
                + '        onclick="editElem(' + elem.id + ')"'
                + '        class="edit-tool-item">Labot'
                + '   </div>';
    }
    editTools += '<div onclick="openPopUp(' + elem.id + ')" class="edit-tool-item">Formatēt</div>';
    editTools += '<div onclick="deleteElem(' + elem.id + ')" class="edit-tool-item">Dzēst</div>';
    editTools += '</div>';
    $($(elem).children()[0]).before(editTools);
}
function saveElem(elem) {
    if (elem.id.indexOf("paragaph") === 0) {
        var text = $(elem).children('textarea').val();
        var textTrim = text; //do not trim orginal (can be formated)
        if (textTrim.trim() === "" && getElemStatus(elem) === '0000') {
            text = "{no text}";
        }
        $(elem).children('textarea').remove();
        $(elem).append('<p style="word-wrap: break-word; margin:0px;" calss="paragaph-content">' + text + '</p>'); //static styling?
    }

    changeStatus(elem.id, '0001');
    removeTools(elem);
}

function editElem(elem) {
    if (getElemStatus(elem) === '0000') {
        return;
    }
    if (elem.id.indexOf("paragaph") === 0) {
        var text = $(elem).children('p').text();
        $(elem).children('p').remove();
        $(elem).append('<textarea class="draggable-textbox">' + text + '</textarea>');
        removeTools(elem);
        changeStatus(elem.id, '0000'); //why not single elem?
    }
}

function openModal(elem) {

}

function openPopUp(elem) {
    var h = window.pageYOffset + window.outerHeight;
    var top = window.pageYOffset + window.outerHeight / 2; //tested chrome/firefox/ie
    $('#popup_box').attr('style', 'display:inline; top:' + top + 'px;');
    $('#hider').attr('style', 'display:inline; height:' + h + 'px;');
    $('body').attr('style', 'overflow:hidden;');
    removeTools(elem);
}

function hidePopUp() {
    $('#popup_box').hide();
    $('#hider').hide();
    $('body').attr('style', 'overflow:auto;');
}

function deleteElem(elem) {
    $(elem).remove();
}
function removeTools(elem) {
    $(elem).removeAttr('onmouseover');
    $('#edit_tools_' + elem.id).remove();
    $(elem).attr('onmouseover', 'showEditTools(' + elem.id + ')');
}

function getElemStatus(elem) {
    return $('#status_' + elem.id).val();
}

function changeStatus(elem, status) {
    $('#status_' + elem).val(status);
}

function blockElem(elem) {
    //write me
}

function newId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}
;