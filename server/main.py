import asyncio
import ssl
import websockets
import secrets
import json

from flask import Flask, request, jsonify, url_for, Response
from flask_cors import CORS
from flask_socketio import SocketIO

# Create the Flask app
app = Flask(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

# This is a properly random 32 bit secret key generated via:
#        "".join([chr(secrets.randbits(8)) for x in range(32)]).encode()
app.config['SECRET_KEY'] = "".join([chr(secrets.randbits(8)) for x in range(32)]).encode()
# app.secret_key = b"\xc3\xb8\xc3\x8ei\xc3\xa7d\xc2\xa0@\xc3\xb8\x15\xc3\xbd" \
#                  b"\xc2\x9d\xc3\xb5\xc2\x86L^0}\x12,\\\x01\xc2\xa8P\xc3\xb2" \
#                  b"\xc2\xber@\xc3\xaf\x02(\xc2\xa8\t"

socketio = SocketIO(app, cors_allowed_origins="*")

def message_received(methods=['GET', 'POST']):
    print('message was received!!!')

@app.route('/')
def index():
    print("Route '/' loaded")
    return 'Loaded'

@app.route('/get_key_mapping', methods=['GET'])
def get_key_mapping():
    with open('keyMappings.json') as json_file:
        data = json.load(json_file)
        return jsonify(data)

@app.route('/set_key_mapping', methods=['POST'])
def set_key_mapping():
    data = request.get_json()
    new_json = {}
    new_json['keyMappings'] = data

    with open('./keyMappings.json', 'w') as json_file:
        json.dump(new_json, json_file, indent=2)
        return jsonify(new_json)


@socketio.on('message')
def handle_message(message):
    print('recieved message: ', + message)

@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))

@socketio.on('keypress')
def handle_keypress(json_data, methods=['GET', 'POST']):
    print('received keypress: ', json_data)
    socketio.emit('keypress-response', json_data, callback=message_received)

if __name__ == "__main__":
    # run_server()
    app.run()
    socketio.run(app, debug=True, host='localhost', port=8765)
