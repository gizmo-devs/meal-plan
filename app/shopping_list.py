from .db import get_db, query_db, close_db
from flask import (
    Blueprint, jsonify, flash, g, redirect, render_template, request, session, url_for, jsonify
)
import datetime


bp = Blueprint('sl', __name__, url_prefix='/shopping_list')


@bp.route('/get-items', methods=['GET', 'POST'])
def get_items(all=False):
    all = request.args.get('all')
    print(all)
    if all:
        sql = """SELECT * FROM shopping_list order by collected asc"""
    else:
        sql = """SELECT * FROM shopping_list WHERE collected is null"""

    q = query_db(sql, (), return_dict=True)
    print(q)
    return jsonify(q)


@bp.route('/add-item', methods=['GET', 'POST'])
def add_item():
    if request.method == 'POST':
        db = get_db()
        item = request.form.get('data')
        print(item)
        sql = """INSERT INTO shopping_list (item, booked_by, collected) VALUES (?, ?, ?)"""
        db.execute(sql, (item, g.user['id'], None))
        db.commit()
        return jsonify("{'status' : 'success'}")
    return jsonify("{'status' : 'failed'}")

@bp.route('/edit-item/<int:id>', methods=['GET', 'POST'])
def edit_item():
    if request.method == 'POST':
        db = get_db()
        id = request.form.get('id')
        item = request.form.get('item')
        sql = """UPDATE shopping_list SET item=? WHERE id=? VALUES (?, ?)"""
        db.execute(sql, (item, id))
        db.commit()
        return jsonify("{'status' : 'success'}")
    return jsonify("{'status' : 'failed'}")

@bp.route('/collected/<int:id>', methods=['GET', 'POST'])
def collect_item(id):
    if request.method == 'POST':
        db = get_db()
        if request.form.get('state') == '1':
            state = datetime.date.today()
        else:
            state = None
        sql = """UPDATE shopping_list SET collected=? WHERE id=?"""
        db.execute(sql, [state, id])
        db.commit()
        return jsonify("{'status' : 'success'}")

    return jsonify("{'status' : 'failed'}")


@bp.route('/remove', methods=['GET', 'POST'])
def remove_item(delete=None):
    pass
