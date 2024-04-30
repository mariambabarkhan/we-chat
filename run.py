import os
import subprocess
import webbrowser
import tkinter as tk
from PIL import ImageTk, Image

project_dir = os.getcwd()
node_command = "node server.js"

root = tk.Tk()
root.title("Starting App")
root.overrideredirect(True)

windowWidth = 600
windowHeight = 400

positionRight = int(root.winfo_screenwidth() / 2 - windowWidth / 2)
positionDown = int(root.winfo_screenheight() / 2 - windowHeight / 2)

root.geometry(f"{windowWidth}x{windowHeight}+{positionRight}+{positionDown}")
imgPath = os.path.join(project_dir, "src", "images", "start.png")

img = Image.open(imgPath)
img = img.resize((windowWidth, windowHeight))
img = ImageTk.PhotoImage(img)

tk.Label(root, image=img, bg="#a43838").pack()

process = subprocess.Popen(
    node_command,
    shell=True,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    cwd=project_dir
)

def open_browser():
    webbrowser.open("http://localhost:3000")
    root.destroy()

root.after(2000, open_browser)

root.mainloop()
try:
    process.wait()
except KeyboardInterrupt:
    process.terminate()
