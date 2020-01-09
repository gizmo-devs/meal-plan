from flask import (
    Blueprint, jsonify, flash, g, redirect, render_template, request, session, url_for
)
import datetime
from .auth import login_required

bp = Blueprint('page', __name__, url_prefix='/')

@bp.route('/')
@login_required
def start():
    return render_template('index.html')
