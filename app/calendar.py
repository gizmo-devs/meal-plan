from .db import get_db, query_db, close_db
from flask import (
    Blueprint, jsonify, flash, g, redirect, render_template, request, session, url_for
)
import datetime

bp = Blueprint('cal', __name__, url_prefix='/calendar')


@bp.route('/date', methods=('GET', 'POST'))
@bp.route('/date/<int:y>/<int:m>/<int:d>', methods=('GET', 'POST'))
def get_date(y=None, m=None, d=None):
    close_db()
    if [y, m, d] is None:
        date = datetime.datetime.now()
    else:
        date = datetime.date(y, m, d)
    print(date)
    # sql = """
    # SELECT *
    # FROM meals
    # WHERE date
    #     between date(strftime(?)) AND date(strftime(?), '+2 days');
    # """
    # res = query_db(sql, [date.__str__(), date.__str__()], return_dict=True)
    sql = """
    SELECT *
    FROM meals 
    WHERE date = date(strftime(?), 'start of day');
    """
    res = [query_db(sql, [(date + datetime.timedelta(days=n)).__str__()], return_dict=True) for n in range(3)]
    print(res)
    # if len(res) == 1:
    #     return res[0]
    # else:
    return jsonify(res)


@bp.route('/month', methods=('GET', 'POST'))
@bp.route('/month/<int:y>/<int:m>', methods=('GET', 'POST'))
def get_month(m=None, y=None):
    close_db()
    if m is None:
        m = datetime.datetime.now()
    else:
        m = datetime.date(y, m, 1)

    print (m)
    sql = """
    SELECT date 
    FROM meals 
    WHERE 
        date between date(strftime(?), 'start of month',  '-7 days') 
            AND date(strftime(?), 'start of month', '+1 month', '+7 days')
    """
    print(sql, m.__str__())
    res = query_db(sql, [m.__str__(), m.__str__()], return_dict=True)
    dates = []
    for i in res:
        dates += [i['date']]
    return jsonify(dates)


@bp.route('/modify/day', methods=('GET', 'POST'))
def update_date():
    if request.method == 'POST':
        # print(request.form['data'])
        print('Request to make change to DB')
        meal_id = request.form['m_id']
        meal = request.form['meal']
        url = request.form['url']
        book = request.form['book']
        page = request.form['page']
        d = datetime.datetime.strptime(request.form['d'],'%Y-%m-%d')
        db = get_db()
        print(meal_id, meal, url, book, page, d)
        print(meal_id, type(meal_id))
        if int(meal_id) > 0:
            print('Add new meal to DB')
            sql = """
            INSERT INTO meals (chosen_meal, book, page, url, date, chosen_by) VALUES (?, ?, ?, ?, date(?) , ?)
            """
            db.execute(sql, (meal, book, page, url, d, g.user['id']))
        else:
            print('update meal in DB')
            sql = """
            UPDATE meals SET chosen_meal=?, book=?, page=?, url=?, chosen_by=? WHERE id=?
            """
            db.execute(sql, (meal, book, page, url, g.user['id'], meal_id))

        db.commit()
        db.close()


        #data = request.json['data']
        #print(data)
    return 'done'\



@bp.route('/test/modify/day', methods=('GET', 'POST'))
def test_update_date():
    # print(request.form['data'])
    print('Request to make change to DB')
    meal_id = '' #request.form['m_id']
    meal = 'SomethingNew' #request.form['meal']
    url = 'bbcgodfood.com' #request.form['url']
    book = '' #request.form['book']
    page = '' #request.form['page']
    d = datetime.datetime.strptime('2020-01-01', '%Y-%m-%d') #request.form['d']
    db = get_db()
    print(meal_id, meal, url, book, page, d)
    if meal_id.decode() > 0:
        print('Add new meal to DB')
        sql = """
        INSERT INTO meals (chosen_meal, book, page, url, date, chosen_by) VALUES (?, ?, ?, ?, date(?) , ?)
        """
        db.execute(sql, (meal, book, page, url, d, 1))
    else:
        print('update meal in DB')
        sql = """
        UPDATE meals SET chosen_meal=?, book=?, page=?, url=?, chosen_by=? WHERE id=?
        """
        db.execute(sql, (meal, book, page, url, g.user['id'], meal_id))

    db.commit()
    db.close()


    #data = request.json['data']
    #print(data)
    return 'done'