import asyncio
import ssl
import websockets
import secrets
from flask import Flask, render_template, request, redirect, url_for, flash, \
    Response
from flask_socketio import SocketIO

# Create the Flask app
app = Flask(__name__)

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

@socketio.on('message')
def handle_message(message):
    print('recieved message: ', + message)

@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))

@socketio.on('keypress')
def handle_keypress(json, methods=['GET', 'POST']):
    print('received keypress: ', json)
    socketio.emit('keypress-response', json, callback=message_received)

if __name__ == "__main__":
    # run_server()
    socketio.run(app, debug=True, host='localhost', port=8765)
