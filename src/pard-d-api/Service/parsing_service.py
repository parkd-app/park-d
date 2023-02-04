def parsing(path):
    with open(path, 'r') as f:
        parking_info = f.read()

    pro = str(parking_info).strip('[')[:-1]
    val = []
    ret = []
    for i in pro.split(','):
        i = i.strip()
        if i == 'True':
            val.append(True)
        else:
            val.append(False)
    for i, ele in enumerate(val):
        ret.append({
            'id': i + 1,
            'status': ele
        })

    return ret
