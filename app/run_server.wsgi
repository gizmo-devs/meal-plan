#!/usr/bin/python3
import sys, os
sys.path.insert(0,'/home/ubuntu/repos/meal-plan/')
from app import create_app
application = create_app()