// cascader Initializer.
/**
 *
 *  @param element string -- .class or #id
 *
 *  @param data_tree array[] -- consist of id and title and subarray as Children[]
 *
 *  @return nothing
 *
 *  @example -- cascader_init(".cascader" , data_tree );
 *
 *  @example data_tree = [{
 *                          "id": 1,
 *                          "title": "Electronics",
 *
 *                          "children": [{
 *                                          "id": 2,
 *                                          "title": "Tvs",
 *
 *                                          "children": [{
 *                                                          "id": 9,
 *                                                          "title": "Led",
 *
 *                                                      }]
 *                                      }]
 *                        }]
 *
 */
function cascader_init(element, data_tree) {
    var $cascader = $(element);
    var cascader_id = $cascader.attr('cascader_id');

    if (cascader_id == undefined) {

        cascader_id = new_cascader_id();
        $cascader.attr('cascader_id', cascader_id);

        if ($cascader.attr('current_value') == undefined) {

            $cascader.attr('current_value', '');
            var input_clone_val = '';
        } else {
            // $cascader.attr('current_value', );
            var input_clone_val = $cascader.attr('current_value');


        }

        $cascader.after(`
            <div class="cascader-list main-list" cascaderList="${cascader_id}">

            </div>
        `);

        var input_name = $cascader.attr('name');
        $cascader.attr('name', '');
        $cascader.after(`
            <input type="text"  name="${input_name}" input-clone="${cascader_id}" value="${input_clone_val}" style="display:none;">

        `);

    }
    var $cascaderList = $(`[cascaderList="${cascader_id}"]`);
    var $inputCascader = $cascader;

    var render_list = data_tree;

    renderMenu(render_list, $cascaderList);


    $cascader.on("click", function() {
        var cascader_id = $(this).attr('cascader_id');
        var $cascaderList = $(`[cascaderList="${cascader_id}"]`);
        $cascaderList.slideDown(200);
    });


    $(".list-group-item").on("click", function(e) {
        if (e.target !== this) return; //return if clicked element is not same

        var parent = $(this).parent();
        parent.find(".list-group-item").removeClass("active");
        parent.find(".list-group-item").find("> ul").hide(0);
        $(this).addClass("active");
        $(this).find("> ul").show(0);

        if ($(this).find('ul').length == 0) {
            // get current value
            var current_value = $(this).attr('cat-id');

            // Animate Cascader list
            $(this).parents('[cascaderList]').slideUp(200);

            // get input_id and set current value attribute
            var cas_input_id = $(this).parents('[cascaderList]').attr('cascaderList');
            var input = $('body').find(`[cascader_id="${cas_input_id}"]`);
            input.attr('current_value', current_value);
            // set clone input value
            $('body').find(`[input-clone="${cas_input_id}"]`).val(current_value).trigger('change');

            // set text array
            var current_text = [];

            // Select all active items
            $(this).parents('[cascaderList]').find('.active').each(function() {
                current_text.push(`${$(this).clone()    //clone the element
                    .children() //select all the children
                    .remove()   //remove all the children
                    .end()     //again go back to selected element
                    .text().trim()}`);

            });
            input.val(current_text.join('/'));
            input.trigger('change');

        }

    });






}

$one = '';

// render listing
function renderMenu(array, el) {

    array.forEach(function(cat) {
        var $ul = $(`<ul class="list-group sub-list " >`);
        var $li = $(`<li class="list-group-item list-group-item-action st" cat-id="${cat.id}" >`);
        var $arrow = $('<i class="fas fa-angle-right float-right mt-1"></i>');
        $one = $(document.createDocumentFragment());



        if (cat.children) {
            if (cat.children.length > 0) {
                el.append($li.text(cat.title + " ").append($arrow).append($ul.append($one)));

                renderMenu(cat.children, $ul);
            } else {
                el.append($li.text(cat.title + " "));

            }
        } else {
            el.append($li.text(cat.title + " "));

        }

    });

}


// generate id
function new_cascader_id() {
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = ""
    var charactersLength = characters.length;

    for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
