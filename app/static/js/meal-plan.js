Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


/////////////////////////////////////////////
// Setting Global vars
/////////////////////////////////////////////
//var hl_dates = [ new Date(2020, 0, 3).getTime(), new Date(2020, 0, 6).getTime(), new Date(2020, 0, 15).getTime(), new Date(2020, 0, 17).getTime() ]

var today = new Date();
var hl_dates = []
var sel_date = {}

/////////////////////////////////////////////
// Creating JS Functions
/////////////////////////////////////////////
function next_few_dates(){
    var d = new Date(sel_date)
    return [
        d,
        d.addDays(1),
        d.addDays(2)
        ]
}

function formatDate(date){
    var d = new Date(date)
    var weekday = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    var Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Aug', 'Nov', 'Dec']
    return weekday[d.getDay()-1] + ', ' + d.getDate() + " " + Months[d.getMonth()]
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function update_dp() {
    console.log('Updating DP with ::');
    console.log(hl_dates);
    //$('.datepicker').datepicker('remove');
    //$('.datepicker').datepicker("update")
    get_meal_data(meal_data_response);
    return
}

function myCallback(result) {
    // Code that depends on 'result'
    hl_dates = result;
    //$('.datepicker').datepicker("refresh")
    update_dp();
    return
}

function update_cal(callback) {
    //console.log(typeof sel_date);
    console.log('sel_date', sel_date);

    if ($.isEmptyObject(sel_date)){
        console.log('sel_date :: EMPTY', sel_date)
        get_url = 'calendar/month'
    } else {
        console.log('sel_date :: NOT EMPTY', sel_date)
        get_url = 'calendar/month/' + sel_date.getFullYear() +'/'+ (sel_date.getMonth() + 1)
    }
    console.log(get_url);
    $.ajax({
        url : get_url,
        success: function(response) {
            response.forEach(function(part, index) {
                this[index] = new Date(part).getTime();
            }, response);

            callback(response)
        }
    });
}

function update_card_headers() {
    var dates = next_few_dates()

    var meal_card = $('div.card.meal-card')
    //console.log(dates)
    for (i=0; i < meal_card.length; i++){
        meal_card.eq(i).children().find('h1').html(formatDate(dates[i]));
        var btn = meal_card.eq(i).children().find('button.opnMdl')
        btn.val(dates[i]);
    }
    return
}

function highlight_days_in_month(date) {
    if ($.inArray(date.getTime(), hl_dates) !== -1) {
        return {enabled:'true', classes:'css-class-to-highlight', tooltip:''};
    };
}

function init_dp(){
    $(".datepicker").datepicker({
      weekStart: 1,
      inline: true,
      sideBySide: true,
      todayHighlight: true,
      beforeShowDay: highlight_days_in_month
      //,beforeShow: update_cal(myCallback)
    })
    .on({
        changeDate: function(e){
            sel_date = new Date(e.date);
            update_card_headers();
            update_cal(myCallback);
        }
        , changeMonth: function(e){
            sel_date = new Date(e.date);
            update_card_headers();
            update_cal(myCallback);
        }
    });
}


function get_meal_data(callback) {
    var meal_get_url = "";
    if (!$.isEmptyObject(sel_date)){
        meal_get_url = 'calendar/date/' + sel_date.getFullYear() + '/' + (sel_date.getMonth() +1) + '/' + sel_date.getDate();
    } else {
        return
    }
    console.log(meal_get_url);
    $.ajax({
        url : meal_get_url,
        success: callback
    });
}

function meal_data_response(meals) {
    // Code that depends on 'meals'

    console.log('Res from Meal Plan', meals );
    get_planned_meal(meals)
    //$('.datepicker').datepicker("refresh") //
    //update_dp();
    return
}

function get_planned_meal(meal_data){
    var card = $('div.card.meal-card')

    for (m in meal_data) {
        if (Object.keys(meal_data[m]).length == 1) {
            var current_meal = meal_data[m][0]
            update_meal_card(card.eq(m), current_meal)
        } else {
            update_meal_card(card.eq(m))
        }
    }
};

function update_meal_card(card, mealObj=null){
    //console.log(card, mealObj);
    if (mealObj === null) {
        console.log('meal is null')
        if ( !card.children().find('.planned_meal').hasClass('d-none') ){
            card.children().find('.planned_meal').addClass('d-none')
        }
        card.children().find('button').html('Add Meal');
    } else {
        card.children().find('.chosen_meal').val(mealObj['chosen_meal']);
        card.children().find('.book').val(mealObj['book']);
        card.children().find('.book_page').val(mealObj['page']);
        card.children().find('.url').val(mealObj['url']);
        card.children().find('button').html('Update Meal');

        if ( card.children().find('.planned_meal').hasClass('d-none') ){
            card.children().find('.planned_meal').removeClass('d-none')
        }
    }
    return
}

function load_meal(meal_date, callback){
    meal_get_url = 'calendar/date/' + meal_date.getFullYear() + '/' + (meal_date.getMonth() +1) + '/' + meal_date.getDate();
    console.log('calling ' + meal_get_url)
    $.ajax({
        url : meal_get_url,
        success: callback
    });
}

function process_load_meal(meal) {
    // Code that depends on 'result'
    console.log('Res from selected Date', meal[0] );
    if (meal[0].length == 0 ) {
        console.log("NO MEAL")
        load_modal()
        return
    } else {
        load_modal(meal[0]);
    }
    //get_planned_meal(meals)
    //$('.datepicker').datepicker("refresh") //
    //update_dp();
    return
}

function load_modal(planned_meal=null) {
    console.log('Loading Modal', planned_meal)
    var modal = $('#meal_plan_modal')

    var header = modal.children().find('h4.modal-title')
    var m_body = modal.children().find('.modal-body')
    if (planned_meal == null) {
         // Clear modal
         //console.log('clear modal')
         header[0].innerHTML = 'Add meal : '
         var inputs = m_body.children().find('input')
         inputs.each(function(e){
            $(this).val('');
         })
    } else {
         header[0].innerHTML = 'Planned meal : ' + formatDate(new Date(planned_meal[0]['date']))
         $('#modal_id').val(planned_meal[0]['id'])
         $('#modal_chosen_meal').val(planned_meal[0]['chosen_meal'])
         $('#modal_book').val(planned_meal[0]['book'])
         $('#modal_book_page').val(planned_meal[0]['page'])
         $('#url').val(planned_meal[0]['url'])
    }

    $('#meal_plan_modal').modal("show");
    return
}

//function post_meal(callback){
function post_meal(callback, d){
    meal_post_url = 'calendar/modify/day'
    console.log(meal_post_url, d)
    d = new Date(d)
    $.ajax({
        type: 'POST',
        data: {
            'm_id' : $('#modal_id').val(),
            'meal': $('#modal_chosen_meal').val(),
            'book': $('#modal_book').val(),
            'page': $('#modal_book_page').val(),
            'url': $('#modal_url').val(),
            'd': d.getFullYear() + '-' +( d.getMonth() +1 ) + '-' + d.getDate()
        },
        url : meal_post_url,
        success: callback
    });
}

function post_meal_response(resp) {
    //alert(resp)
    update_cal(myCallback)
}


//foo(myCallback);

//function getData() {
//    $.ajax({
//        url : 'calendar/month',
//        type: 'GET',
//        success : handleData
//    })
//}
//
//function handleData(data) {
//    return data
//    //alert(data);
//    //do some stuff
//}


/////////////////////////////////////////////
// Once page is loaded and 'ready'
/////////////////////////////////////////////

$(document).ready(function() {
     //foo(myCallback);
    //alert(get_planned_month());
    //var hl_dates = get_planned_month();
    //console.log(hl_dates);
    init_dp();

    update_cal(myCallback);

    $('.opnMdl').click(function() {
        //alert($(this).val());
        d = new Date($(this).val())
        $('#modal_save').val(d);
        load_meal(d, process_load_meal);

        //console.log('Clicked');
        //console.log(e);
    });
    $('#modal_save').click(function(){
        post_meal(post_meal_response, $(this).val())
    })

});