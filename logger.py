import sys
from datetime import datetime

def log(message, level="INFO"):
    timestamp = datetime.now().strftime("%H:%M:%S")
    sys.stdout.write(f"[{timestamp}] {level}: {message}\n")
    sys.stdout.flush()

def success(message):
    log(message, "SUCCESS")

def error(message):
    log(message, "ERROR")
