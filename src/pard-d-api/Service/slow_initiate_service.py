import socket

def start(model):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    if model == 'side':
        port = 12000
    else:
        port = 12345
    client_socket.connect(('localhost', port))
    val = client_socket.send(b"incoming request")
    client_socket.close()
    return val != -1





