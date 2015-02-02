var x = 0;
var y = 0;

$(document).keydown(function (e) {
    if (e.keyCode === 27) {
        $('#mouse_menu').removeClass('show')
    }
});

if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
        if (e.button === 2) {
            x = e.clientX;
            y = e.clientY;
            $('#mouse_menu').addClass('show');
            $('#mouse_menu').attr('style', 'margin-left:' + x + 'px; margin-top:' + y + 'px;');
        }
        e.preventDefault();
    }, false);
}

function createElem(type) {
    $('#mouse_menu').removeClass('show');
    if (type === 1) {
        $('body').append(createParagraph());
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
function createParagraph() {
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
        changeStatus(elem.id, '0000'); //why not single elem?
        removeTools(elem);
    }
}

function openModal(elem) {

}

function openPopUp(elem) { //rewrite
    $("body").css("overflow", "hidden");
    $('#open_modal').children('textarea').wysiwyg();
    $('#open_modal').dialog({
        resizable: false,
        modal: true,
        title: "Labot ",
        height: 350,
        width: 700,
        buttons: {
            "Saglabāt": function () {

                $(this).dialog('close');
            },
            "Atcelt": function () {
                $(this).dialog('close');
            }
        },
        beforeClose: function () {
            $("body").css("overflow", "auto");
        }
    });
    var elem = $(".ui-dialog-buttonset")[0].firstChild;
    $('#ui-id-1').hide();
    $(elem.firstChild).css("background-color", "#CBE32D !important");
    $(elem.firstChild).css("border", "0px solid rgba(0, 0, 0, 0.6) !important");
    $(elem).addClass("btn-shine");
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