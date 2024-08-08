import clr  # pip install pythonnet
__ref = "C:\\Program Files\\Siemens\\Automation\\Portal V19\\PublicAPI\\V19\\Siemens.Engineering.dll"
clr.AddReference(__ref)
from System.IO import DirectoryInfo, FileInfo

class TIAOpennessBase:
    def __init__(self, project_path, project_name):
        self.project_path = DirectoryInfo(project_path)
        self.project_name = project_name
        self.mytia = None
        self.myproject = None
