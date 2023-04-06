import flask

#Bypass chrome settings
def handle_response(data):
    response = flask.jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response