//var hl_dates = [ new Date(2020, 0, 3).getTime(), new Date(2020, 0, 6).getTime(), new Date(2020, 0, 15).getTime(), new Date(2020, 0, 17).getTime() ]
var today = new Date();
var hl_dates = []
//console.log(hl_dates)
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

function get_planned_month() {
    var get_url = 'calendar/month'
    $.ajax({
        url: get_url,
        success: function(result){
            result.forEach(function(part, index) {
                this[index] = new Date(part).getTime();
            }, result);
            return result;
            //update_datepicker();
        }
    });
}



function get_planned_meal(date, meal_data){
    t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
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

    for (m in dummy_Data) {
        if (Object.keys(dummy_Data[m]).length) {
            console.log(dummy_Data[m])
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
    //$('.datepicker').datepicker('destroy');
    $('.datepicker').datepicker('update');
    return
}

function myCallback(result) {
    // Code that depends on 'result'
    console.log(result)
    hl_dates = result
    update_dp();
    return
}

function update_cal(callback) {
    $.ajax({
        url : 'calendar/month',
        success: function(response) {
            response.forEach(function(part, index) {
                this[index] = new Date(part).getTime();
            }, response);

            callback(response)
        }
    });
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


$(document).ready(function() {
     //foo(myCallback);
    //alert(get_planned_month());
    //var hl_dates = get_planned_month();
    //console.log(hl_dates);
    $(".datepicker").datepicker({
      todayHighlight: true,
      beforeShowDay: function (date) {
        if ($.inArray(date.getTime(), hl_dates) !== -1) {
            return {enabled:'true', classes:'css-class-to-highlight', tooltip:''};
        };
      }
    })
    .on({
        changeDate: function(e){
            update_cal(myCallback)
            //hl_dates = fresh_dates(e.date)
            //$('.datepicker').datepicker('update');
            //get_planned_meal(e.date);
        },
        changeMonth: function(e){
            //hl_dates = fresh_dates(e.date)
            update_cal(myCallback)
        }
    });
    update_cal(myCallback);
});