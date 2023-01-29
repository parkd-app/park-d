try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

#pyyaml==5.4.1
config = {
    "description": "Parking Lot Space Detector",
    "version": "0.1",
    "install_requires": ["cv2", "numpy", "yml"],
    "packages": ["parking_lot"],
    "scripts": [],
    "name": "ParkingLot"
}

setup(**config)
