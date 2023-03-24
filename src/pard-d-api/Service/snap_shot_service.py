from io import BytesIO

from pytube import YouTube
from PIL import Image
import requests

def save_frame_sec(url):
    yt = YouTube(url)
    thumbnail_url = yt.thumbnail_url
    # Read the thumbnail image from URL using OpenCV
    im = Image.open(requests.get(thumbnail_url, stream=True).raw)
    return serve_pil_image(im)

def serve_pil_image(pil_img):
    img_io = BytesIO()
    pil_img.save(img_io, 'JPEG', quality=70)
    img_io.seek(0)
    return img_io


