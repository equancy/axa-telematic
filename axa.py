import csv
import json
import os

from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/data/<driver_id>')
def data(driver_id):
    travels = []
    for dirname, dirnames, filenames in os.walk(os.path.join('drivers', str(driver_id))):
        for filename in filenames:
            travel = []
            with open(os.path.join(dirname, filename)) as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    travel.append((float(row['x']), float(row['y'])))
                travels.append(travel)
    return jsonify(results=travels)

@app.route('/')
def hello():
    return render_template('index.html')

if __name__ == '__main__':
    app.config.from_object('config.DevelopmentConfig')
    app.run()
