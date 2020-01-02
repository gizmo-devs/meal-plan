import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from .db import get_db, query_db

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        firstname = request.form['firstname']
        surname  = request.form['surname']
        email = request.form['email']
        pin = request.form['pin']

        username = firstname +', '+ surname

        db = get_db()
        error = None

        if not username:
            error = 'Username is required.'
        elif not pin:
            error = 'PIN is required.'
        elif db.execute(
            'SELECT id FROM users WHERE username = ?', (username,)
        ).fetchone() is not None:
            error = 'User {} is already registered.'.format(username)

        if error is None:
            db.execute(
                'INSERT INTO users (firstname, surname, email, username, password) VALUES (?, ?, ?, ?, ?)',
                (firstname.title(), surname.title(), email, username.title(), generate_password_hash(pin))
            )
            db.commit()
            return redirect(url_for('auth.login'))

        flash(error)

    return render_template('auth/register.html')

@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        #username = request.form['username']
        password = request.form['password']
        # db = get_db()
        error = None
        # users = db.execute(
        #     'SELECT * FROM users'
        # ).fetchall()
        users = query_db('SELECT * FROM users',())

        for user in users:
            if not check_password_hash(user['password'], password):
                error = 'Incorrect password.'
            else:
                print('pin correct')
                error = None
                current_user = user
                break

        if error is None:
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('page.start'))

        flash(error)

    return render_template('auth/login.html')

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view


@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM users WHERE id = ?', (user_id,)
        ).fetchone()