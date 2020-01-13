from flask import (
    Blueprint, jsonify, flash, g, redirect, render_template, request, session, url_for
)
import datetime
from .auth import login_required

bp = Blueprint('view', __name__, url_prefix='/')

@bp.route('/')
@login_required
def plan():
    return render_template('plan.html')

@bp.route('/shopping-list')
@login_required
def shopping_list():
    return render_template('shopping-list.html')

