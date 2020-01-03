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
function fresh_dates(d){
    max_day_in_month = new Date(d.getFullYear(), (d.getMonth() + 1), 0).getDate()
    return [
        new Date(2020, d.getMonth(), getRandomInt(max_day_in_month)).getTime(),
        new Date(2020, d.getMonth(), getRandomInt(max_day_in_month)).getTime(),
        new Date(2020, d.getMonth(), getRandomInt(max_day_in_month)).getTime(),
        new Date(2020, d.getMonth(), getRandomInt(max_day_in_month)).getTime(),
        'OPS']
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function get_planned_meal(meal_data){

//    console.log(date, t)
    var dummy_Data = [
        {
            "meal":"fish and chips",
            "date":"Thu Jan 02 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"
        },
        {
            "meal":"curry",
            "date":"Thu Jan 12 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"
        },
        {},
        {
            "meal":"roast",
            "date":"Thu Jan 22 2020 00:00:00 GMT+0000 (Greenwich Mean Time)"
        }
    ]
    var card = $('div.card.meal-card')
    console.log(card)

    for (m in meal_data) {

        if (Object.keys(meal_data[m]).length > 1) {
            console.log(meal_data[m])
            card[m].children(0).html(this['date'])
            card[m].children(1).html(meal_data[m]['meal'])
        } else {
            console.log('blank record')
        }

    }

//    $('div.card').each(function(item){
//        for (i=0; i=2; i++) {
//            if (dummy_Data[i]['date'] == date.getTime()) {
//                console.log('YES')
//            }
//        }
//    });

//        if (date.getTime() == t.getTime() ) {
//            alert('Thats today?!');
//            $('div.card').each(function(item){
//                $(this).find('input').val(dummy_Data[item]['meal']);
//            })
//        }
};

function update_dp() {
    console.log('Updating DP with ::');
    console.log(hl_dates);
    //$('.datepicker').datepicker('remove');
    //$('.datepicker').datepicker("refresh")
    get_meal_data(meal_data_response)
    return
}

function myCallback(result) {
    // Code that depends on 'result'
    hl_dates = result;
    //$('.datepicker').datepicker("refresh") //
    update_dp();
    return
}

function update_cal(callback) {
    //console.log(typeof sel_date);
    //console.log(sel_date);

    if (isNaN(sel_date)){
        get_url = 'calendar/month'
    } else {
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

function highlight_days_in_month(date) {
    if ($.inArray(date.getTime(), hl_dates) !== -1) {
        return {enabled:'true', classes:'css-class-to-highlight', tooltip:''};
    };
}

function init_dp(){
    $(".datepicker").datepicker({
      inline: true,
      sideBySide: true,
      todayHighlight: true,
      beforeShowDay: highlight_days_in_month
    })
    .on({
        changeDate: function(e){
            sel_date = new Date(e.date);
            update_cal(myCallback);
        }
        , changeMonth: function(e){
            sel_date = new Date(e.date);
            update_cal(myCallback);
        }
    });
}


function get_meal_data(callback) {
    var meal_get_url = "";
    if (isNaN(sel_date.getDate)){
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
    // Code that depends on 'result'

    console.log('Res from Meal Plan', meals );
    get_planned_meal(meals)
    //$('.datepicker').datepicker("refresh") //
    //update_dp();
    return
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
    init_dp()

    update_cal(myCallback);




});