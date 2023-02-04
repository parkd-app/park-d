import socket

def start(model):
    clientsocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    if model == 'side':
        port = 12000
    else:
        port = 12345
    clientsocket.connect(('localhost', port))
    val = clientsocket.send(b"incoming request")
    clientsocket.close()
    return val != -1




