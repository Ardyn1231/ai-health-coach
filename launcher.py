"""
PulseCoach AI - Desktop Launcher
Launches the local web server and automatically opens your web browser.
"""

import sys
import os
import time
import socket
import threading
import webbrowser
from app import app

def find_available_port(start_port=5000, max_attempts=10):
    for p in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', p)) != 0:
                return p
    return start_port

def open_browser_delayed(url, delay=1.2):
    time.sleep(delay)
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

def main():
    port = find_available_port(5000)
    url = f"http://localhost:{port}"

    print("==============================================================")
    print("  PulseCoach AI — Intelligent Health & Fitness Coach")
    print("==============================================================")
    print(f"  Starting local web server...")
    print(f"  Opening your browser at: {url}")
    print("  To stop the application, close this window or press Ctrl+C.")
    print("==============================================================\n")

    # Start browser opener in background thread
    threading.Thread(target=open_browser_delayed, args=(url,), daemon=True).start()

    # Start Flask server
    app.run(host="127.0.0.1", port=port, debug=False)

if __name__ == "__main__":
    main()
