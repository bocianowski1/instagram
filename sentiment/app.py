from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
    return jsonify({'message': 'Hello, World!'})

@app.route('/sentiment')
def sentiment():
    return jsonify({'score': 0.5, 'magnitude': 0.5, 'sentiment': 'positive'})

if __name__ == '__main__':
    app.run(debug=True, port=5555)
