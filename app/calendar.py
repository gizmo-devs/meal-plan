from db import query_db, close_db
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

    sql = """
    SELECT date 
    FROM meals 
    WHERE 
        date between date(strftime(?), 'start of month',  '-7 days') AND date(strftime(?), 'start of month', '+1 month', '+7 days')
    """
    print(sql, m.__str__())
    res = query_db(sql, [m.__str__(), m.__str__()], return_dict=True)
    dates = []
    for i in res:
        dates += [i['date']]
    return jsonify(dates)


