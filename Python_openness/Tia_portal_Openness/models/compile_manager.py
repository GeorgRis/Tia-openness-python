import clr  # pip install pythonnet
from pydantic import BaseModel
from typing import List, Dict
from fastapi import FastAPI, HTTPException

__ref = "C:\\Program Files\\Siemens\\Automation\\Portal V19\\PublicAPI\\V19\\Siemens.Engineering.dll"
clr.AddReference(__ref)
from System.IO import DirectoryInfo, FileInfo
import Siemens.Engineering as tia
import Siemens.Engineering.HW.Features as hwf
import Siemens.Engineering.Compiler as comp
import json
import os

class CompilerManager:
    def compile_devices(self, myproject):
        def print_comp(messages):
            for msg in messages:
                print(f'Path: {msg.Path}')
                print(f'DateTime: {msg.DateTime}')
                print(f'State: {msg.State}')
                print(f'Description: {msg.Description}')
                print(f'Warning Count: {msg.WarningCount}')
                print(f'Error Count: {msg.ErrorCount}\n')
                print_comp(msg.Messages)

        for device in myproject.Devices:
            compile_service = device.GetService[comp.ICompilable]()
            result = compile_service.Compile()
            print(f'State: {result.State}')
            print(f'Warning Count: {result.WarningCount}')
            print(f'Error Count: {result.ErrorCount}')
            print_comp(result.Messages)

    def compile_software(self, myproject):
        def print_comp(messages):
            for msg in messages:
                print(f'Path: {msg.Path}')
                print(f'DateTime: {msg.DateTime}')
                print(f'State: {msg.State}')
                print(f'Description: {msg.Description}')
                print(f'Warning Count: {msg.WarningCount}')
                print(f'Error Count: {msg.ErrorCount}\n')
                print_comp(msg.Messages)

        for device in myproject.Devices:
            device_item_aggregation = device.DeviceItems
            for deviceitem in device_item_aggregation:
                software_container = tia.IEngineeringServiceProvider(deviceitem).GetService[hwf.SoftwareContainer]()
                if software_container:
                    print(f'compiling: {deviceitem.Name}')
                    software_base = software_container.Software
                    compile_service = software_base.GetService[comp.ICompilable]()
                    result = compile_service.Compile()
                    print(f'State: {result.State}')
                    print(f'Warning Count: {result.WarningCount}')
                    print(f'Error Count: {result.ErrorCount}')
                    print_comp(result.Messages)