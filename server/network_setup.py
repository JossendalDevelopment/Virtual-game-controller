from tkinter import *
import socket

ip_addr = ""


class Window(Frame):

    def __init__(self, parent=None):
        Frame.__init__(self, parent)
        self.parent = parent
        self.user_input = Entry(self)

        self.init_window()

    @staticmethod
    def get_users_ip():
        return ip_addr

    def init_window(self):
        self.pack(fill=BOTH, expand=1)

        current_ip_addr = socket.gethostbyname(socket.gethostname())

        Label(self, text="Please enter your local ip address").grid(
            row=0, columnspan=3, pady=20, padx=20)

        self.user_input.grid(row=1, columnspan=3)
        self.user_input.insert(0, current_ip_addr)
        self.user_input.focus_set()

        quit_button = Button(self, text="Quit", command=self.client_exit)
        quit_button.grid(row=2, column=1)
        accept_button = Button(self, text="Connect",
                               command=self.connect)
        accept_button.grid(row=2, column=2, padx=10, pady=10)

    def client_exit(self):
        exit()

    def connect(self):
        global ip_addr
        ip_addr = self.user_input.get()
        root.destroy()


def center(win):
    """
    centers a tkinter window
    :param win: the root or Toplevel window to center
    """
    win.update_idletasks()
    width = win.winfo_width()
    frm_width = win.winfo_rootx() - win.winfo_x()
    win_width = width + 2 * frm_width
    height = win.winfo_height()
    titlebar_height = win.winfo_rooty() - win.winfo_y()
    win_height = height + titlebar_height + frm_width
    x = win.winfo_screenwidth() // 2 - win_width // 2
    y = win.winfo_screenheight() // 2 - win_height // 2
    win.geometry('{}x{}+{}+{}'.format(width, height, x, y))
    # win.geometry('{}x{}'.format(x, y))
    win.deiconify()


root = Tk()
# initial window dimensions
# root.geometry("400x200")
root.title("Setup")

app = Window(root)
center(root)

root.mainloop()
