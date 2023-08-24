import glob
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi import Body
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse, HTMLResponse
import chardet
import pathlib

app = FastAPI()
templates = Jinja2Templates('.')

def detect_file_enc(filename, default_encoding='gb2312'):
    """ 自动识别文件编码

    :param default_encoding: (str) 万一没有识别出文件编码时使用的缺省编码
    """
    r = None
    with open(filename, 'rb') as f:
        d = chardet.UniversalDetector()
        for l in f:
            d.feed(l)
            if d.done:
                break
        r = d.close()
    return r['encoding'] if r and r['encoding'] else default_encoding

def open_any_enc(filename, mode='r', default_encoding='gb2312'):
    """ open “自动识别文件编码”版本

    :param default_encoding: (str) 万一没有识别出文件编码时使用的缺省编码
    """
    return open(filename, mode, encoding=detect_file_enc(filename, default_encoding))

app.mount('/books', StaticFiles(directory='./books'), name='book')
app.mount('/scripts', StaticFiles(directory='./scripts'), name='scripts')

@app.get('/STR/index.html')
def get_STR_index():
    with open_any_enc('./STR/index.html') as f:
        html = f.read()
    html += '<script type="text/javascript" src="/scripts/mod.js"></script>'
    return HTMLResponse(html)

app.mount('/STR', StaticFiles(directory='./STR', html=True), name='SimpleTextReader')

@app.get('/progress/{book}')
def get_progress(book: str):
    print("GET progress:", book)
    progress = 0
    progress_file = './books/' + book + ".progress"
    if pathlib.Path(progress_file).exists():
        with open(progress_file, 'r') as f:
            progress = int(f.readline())
    return {"line": progress}

@app.put('/progress/{book}')
def put_progress(book: str, line: int=Body(...)):
    print("PUT progress:", book, ":", line)
    progress_file = './books/' + book + ".progress"
    with open(progress_file, 'w') as f:
       f.write(str(line))
    return {"result": "succ"}

@app.delete('/progress/{book}')
def delete_progress(book: str):
    print("DEL progress:", book)
    return {"result": "succ"}

@app.get('/books')
def get_books(request: Request):
    book_dir = pathlib.Path("./books")
    return {"books": [f.name for f in book_dir.glob("*.txt")]}
