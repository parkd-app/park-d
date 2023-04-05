import pickle
with open("carParkPos", "rb") as f:
    posList = pickle.load(f)
    print(posList)