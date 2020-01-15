$(document).ready(function() {
    function state(ajax_state=false) {
        if (ajax_state == 'pending') {
            $('.loading').addClass('show');
            $('#shopping_list').addClass('d-none');
        } else {
            $('.loading').removeClass('show');
            $('.loading').addClass('d-none');
            $('#shopping_list').removeClass('d-none');
            $('#shopping_list').addClass('show');

        }
        console.log(ajax_state);
        return
    }

    function ajaxCall(call_url, method, req_data, callback, feedback=null){
        console.log(call_url, method, req_data);
        $.ajax({
            url: call_url,
            type: method,
            data: req_data,
            success: function(response){
                callback(response, feedback)
            },
            error: function(msg) {
                alert('Something has gone wrong, Check console.')
                console.error(msg)
            }
        })
    }

    function handleInitCall(response){
        console.log(response.length)
        $('#shopping_list').empty();
        state();
        if ( response.length != 0 ) {
            show_no_list_items(false);
            $.each(response, function ( index, value ){
                render_item(this);
            });
            bind_toggles();
        } else {
            show_no_list_items(true);
        }
    }

    function show_no_list_items(display) {
        if (display){
            $('#no_items').addClass('show').removeClass('d-none');
        } else {
            $('#no_items').removeClass('show').addClass('d-none');
        }
        return
    }

    function render_item(item){
        var col = item['collected'] ? true : false

        var li = `<li class="d-flex list-group-item `+ (col ? 'list-group-item-secondary':'') +`">
                    <span class="mr-auto">` + item['item'] + `</span>
                    <span class="feedback mr-2"></span>
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input collected" `+ (col ? 'checked':'') +` id="collect-`+ item['id'] +`" data-id=`+item['id']+`>
                        <label class="custom-control-label" for="collect-`+ item['id'] +`">Collected</label>
                    </div>
                  </li>`;
        $('#shopping_list').append(li);
        return
    }

    function init_call(all=false){
        state('pending')
        if (all){
            ajaxCall('/shopping_list/get-items', 'GET', "all=true", handleInitCall)
        } else {
            ajaxCall('/shopping_list/get-items', 'GET', '', handleInitCall)
        }
    }

    function add_item_to_db(){
        var item = $('#add_item').val();
        var data = { 'data': item }
        ajaxCall('/shopping_list/add-item', 'POST', data, handleAddNewItem)
    }

    function handleAddNewItem(response){
        if (response == "{'status' : 'success'}") {
            state('pending')
            ajaxCall('/shopping_list/get-items', 'GET', '', handleInitCall)
        }
        state();
    }

    function item_change(item, collected){
        var item_data = {'state':collected}
        var item_id = item.data('id');
        var feedback_ele = item.parent().siblings('span.feedback');
        item.parents('li').toggleClass('list-group-item-secondary');
        feedback_ele.toggleClass('spinner-border spinner-border-sm');
        // Call to update the database
        ajaxCall('/shopping_list/collected/' + item_id, 'POST', item_data, handleCollectedCall, feedback=feedback_ele)
        return
    }

    function handleCollectedCall(response, feedback){
        console.log(response, feedback)
        if (response == "{'status' : 'success'}") {
            feedback.toggleClass('spinner-border spinner-border-sm');
            feedback.toggleClass('fa fa-check');
        } else {
            feedback.toggleClass('spinner-border spinner-border-sm');
            feedback.toggleClass('fa fa-warning')
        }
        return
    }

    function bind_toggles(){
        $("input[type='checkbox'].collected").change(function() {
            if(this.checked) {
                item_change($(this), 1)
            } else {
                item_change($(this), 0)
            }
        });
    }

    $('#add_to_db_form').submit(function(e){
        event.preventDefault(e);
        add_item_to_db();
        this.reset();
    })

    $('#show_all').change(function(){
        this.checked ? init_call(true) : init_call()
        return
    })

    init_call()
});