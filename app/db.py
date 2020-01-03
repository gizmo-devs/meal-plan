import sqlite3

import click
from flask import current_app, g
from flask.cli import with_appcontext


def get_db(return_dict=None):
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        if return_dict is None:
            g.db.row_factory = sqlite3.Row
        else:
            g.db.row_factory = dict_factory

    return g.db


def query_db(query, args=(), one=False, return_dict=None):
    cur = get_db(return_dict).execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


# Start 'flask init-db' command
def init_db():
    db = get_db()

    with current_app.open_resource('data-files/schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')
# Finish 'flask init-db' command


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)