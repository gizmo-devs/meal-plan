from db import query_db, close_db
from flask import (
    Blueprint, jsonify, flash, g, redirect, render_template, request, session, url_for
)
import datetime

bp = Blueprint('cal', __name__, url_prefix='/calendar')


@bp.route('/date', methods=('GET', 'POST'))
@bp.route('/date/<date>', methods=('GET', 'POST'))
def get_date(date=None):
    close_db()
    if date is None:
        date = datetime.datetime.now()
    print(date)
    sql = """
    SELECT * 
    FROM meals 
    WHERE date 
        between date(strftime(?)) AND date(strftime(?), '+2 days');
    """
    res = query_db(sql, [date.__str__(), date.__str__()], return_dict=True)
    print(res)
    # if len(res) == 1:
    #     return res[0]
    # else:
    return jsonify(res)


@bp.route('/month', methods=('GET', 'POST'))
@bp.route('/month/<m>', methods=('GET', 'POST'))
def get_month(m=None):
    close_db()
    if m is None:
        m = datetime.datetime.now()
    sql = """
    SELECT date 
    FROM meals 
    WHERE 
        date between date(strftime(?), 'start of month',  '-7 days') AND date('now', 'start of month', '+1 month', '+7 days')
    """
    res = query_db(sql, [m.__str__()], return_dict=True)
    dates = []
    for i in res:
        dates += [i['date']]
    return jsonify(dates)


