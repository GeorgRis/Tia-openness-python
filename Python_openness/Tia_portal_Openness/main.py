from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
from pydantic import BaseModel
from typing import List, Optional, Dict
from Tia_portal_Openness.models.tia_project import TIAProject, TIAOpennessBase

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing classes and endpoints

class DeviceInput(BaseModel):
    order_number: str
    device_name: str
    item_name: str
    cards: List[Dict[str, str]]

class NetworkInput(BaseModel):
    ip_addresses: List[str]

class ProjectInput(BaseModel):
    project_path: str
    project_name: str

class PotentialGroupInput(BaseModel):
    device_name: str
    device_item_name: str
    potential_group_value: str

class AddToDeviceMapInput(BaseModel):
    name: str
    order_number: str
    type_card: str

class SingleDeviceInput(BaseModel):
    order_number: str
    device_name: str
    ip_address: str
    subnet_masks: str

class AssignDeviceInput(BaseModel):
    device_name: str
    order_number: str
    p_value: str
    name: str
    slot: int

class DeleteDevice(BaseModel):
    device_name: str

tia_project = None

@app.post("/start-tia/")
def start_tia(project_input: ProjectInput):
    global tia_project
    tia_project = TIAProject(project_input.project_path, project_input.project_name)
    tia_project.start_tia()
    return {"message": "TIA Portal started with UI"}

@app.post("/create-project/")
def create_project():
    if tia_project is None:
        raise HTTPException(status_code=400, detail="TIA Project not initialized")
    tia_project.create_project()
    return {"message": "Project created successfully"}

@app.post("/open-project/")
def open_project():
    tia_project.open_existing_project()
    return {"message": "Project opened successfully"}

@app.post("/add-device/")
def add_device(device: SingleDeviceInput):
    tia_project.device_manager.create_device(
        tia_project.myproject, device.order_number, device.device_name, device.device_name, device.ip_address, device.subnet_masks
    )
    return {"message": "Device added successfully"}

@app.post("/assign-device/")
def assign_device(assign_device_input: AssignDeviceInput):
    tia_project.device_manager.add_device_cards(
        tia_project.myproject,
        assign_device_input.device_name,
        assign_device_input.order_number,
        assign_device_input.name,
        assign_device_input.slot,
        assign_device_input.p_value
    )
    return {"message": "Device assigned successfully"}

@app.post("/add-devices-json/")
def add_devices(devices: List[DeviceInput]):
    json_data = json.dumps([device.dict() for device in devices])
    tia_project.add_devices_units_from_json(json_data)
    return {"message": "Devices added successfully"}

@app.post("/delete-device/")
def delete(input_data: DeleteDevice):
    tia_project.device_manager.delete_device(tia_project.myproject, input_data.device_name)
    return {"message": "Device deleted successfully"}

@app.post("/configure-network/")
def configure_network(network_input: NetworkInput):
    tia_project.configure_network_interfaces(network_input.ip_addresses)
    return {"message": "Network interfaces configured successfully"}

@app.get("/list-devices/")
def list_devices():
    devices_list = []
    devices = tia_project.myproject.Devices
    for device in devices:
        device_info = {
            "name": device.Name,
            "items": [{"name": item.Name, "type": item.GetAttribute('TypeName')} for item in device.DeviceItems]
        }
        devices_list.append(device_info)
    return devices_list

@app.post("/compile-devices/")
def compile_devices():
    tia_project.compiler_manager.compile_devices(tia_project.myproject)
    return {"message": "Devices compiled successfully"}

@app.post("/compile-software/")
def compile_software():
    tia_project.compiler_manager.compile_software(tia_project.myproject)
    return {"message": "Software compiled successfully"}

@app.post("/set-potential-group/")
def set_potential_group(input_data: PotentialGroupInput):
    result = tia_project.device_manager.set_potential_group(
        tia_project.myproject,
        input_data.device_name,
        input_data.device_item_name,
        input_data.potential_group_value
    )
    return {"message": f"PotentialGroup set to: {result}"}

@app.post("/add-to-device-map/")
def add_to_device_map(input_data: AddToDeviceMapInput):
    print(f"Received data: {input_data}")
    tia_project.device_manager.add_to_map(input_data.name, input_data.order_number, input_data.type_card)
    return {"message": "Device added to mapping successfully"}

@app.get("/get-device-mapping/")
def get_device_mapping(mapping_type: Optional[str] = Query(None, description="Type of mapping: iocards, cpucards, riocards, or leave empty for merged list")):
    return tia_project.device_manager.get_mapping(mapping_type)

@app.post("/save-close/")
def save_and_close():
    tia_project.myproject.Save()
    tia_project.myproject.Close()
    return {"message": "Project saved and closed successfully"}

# New classes and endpoints

class SheetInput(BaseModel):
    sheets: List[str]
    inputData: List[dict]

@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = "temp_uploaded_file.xlsx"
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        print("File uploaded and saved at:", file_location)  # Debug print
        df = pd.ExcelFile(file_location)
        sheet_names = df.sheet_names
        print("Sheet names:", sheet_names)  # Debug print
        return {"sheets": sheet_names}
    except Exception as e:
        print("Error uploading file:", str(e))  # Debug print
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/process-sheets/")
async def process_sheets(sheet_input: SheetInput):
    print("Received sheet input data:", sheet_input)  # Debug print
    file_path = 'temp_uploaded_file.xlsx'
    try:
        excel_data = pd.ExcelFile(file_path)
        print("Excel file loaded:", file_path)  # Debug print

        all_sheets_data = {}
        for index, sheet_name in enumerate(sheet_input.sheets[0:]):
            de_type = sheet_input.inputData[index]['de_type']
            ip = sheet_input.inputData[index]['ip']
            sub = sheet_input.inputData[index]['sub']
            print(f"Processing sheet: {sheet_name}, with inputs: de_type={de_type}, ip={ip}, sub={sub}")  # Debug print

            df = pd.read_excel(file_path, sheet_name=sheet_name, skiprows=5)

            if 'PLSKort' not in df.columns:
                print(f"Sheet '{sheet_name}' does not contain 'PLSKort' column.")  # Debug print
                continue

            for idx, row in df.iterrows():
                if pd.notna(row['PLSKort']):
                    device_name = row.get('Skap/node', '')
                    if device_name not in all_sheets_data:
                        all_sheets_data[device_name] = {
                            "Device Name": device_name,
                            "IP-addr": ip,
                            "SubnetMask": sub,
                            "DeviceType": de_type,
                            "Cards": {}
                        }
                    card_number = int(row['PLSKort'])
                    if card_number not in all_sheets_data[device_name]['Cards']:
                        all_sheets_data[device_name]['Cards'][card_number] = {
                            "Type": row.get('I/O', ''),
                            "BaseUnit": row.get('Sokkel', ''),
                            "Adresses": {}
                        }
                    all_sheets_data[device_name]['Cards'][card_number]["Adresses"][
                        len(all_sheets_data[device_name]['Cards'][card_number]["Adresses"])] = {
                        "Tag": row.get('Objekt', ''),
                        "Signal": row.get('Signal', ''),
                        "Objtype": row.get('PG Objekt', '')
                    }

        json_path = 'all_sheets_devices.json'
        with open(json_path, 'w') as json_file:
            json.dump(all_sheets_data, json_file, indent=4)
        print("JSON data saved at:", json_path)  # Debug print

        # Now process the JSON data to create and assign devices
        process_json_data(all_sheets_data)

        return {"message": "Data processed and saved successfully", "data": all_sheets_data}
    except FileNotFoundError:
        print("File not found error")  # Debug print
        raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        print("Error processing sheets:", str(e))  # Debug print
        raise HTTPException(status_code=500, detail=str(e))

def process_json_data(data):
    print("Processing JSON data to create and assign devices...")  # Debug print
    for device_name, device_info in data.items():
        print(device_name)
        try:
            order_number = device_info.get("DeviceType", "")
            ip_address = device_info.get("IP-addr", "")
            subnet_mask = device_info.get("SubnetMask", "")
            device_type = device_info.get("DeviceType", "")
            print(f"Creating device: {device_name}, order_number={order_number}, ip_address={ip_address}, subnet_mask={subnet_mask}, device_type={device_type}")  # Debug print

            # Create device
            tia_project.device_manager.create_device(
                tia_project.myproject,
                order_number,
                device_name,
                device_name,
                ip_address,
                subnet_mask
            )
            print(f"Device {device_name} created successfully.")  # Debug print

            # Assign cards to device
            for card_number, card_info in device_info['Cards'].items():
                try:
                    card_type = card_info.get("Type", "")
                    base_unit = card_info.get("BaseUnit", "")
                    print(f"Assigning card: card_number={card_number}, card_type={card_type}, base_unit={base_unit}, to device={device_name}")  # Debug print
                    tia_project.device_manager.add_device_cards(
                        tia_project.myproject,
                        device_name,
                        card_type,
                        f"{card_type}_slot{card_number}",
                        card_number,
                        base_unit
                    )
                    print(f"Card {card_number} assigned to device {device_name} successfully.")  # Debug print
                except Exception as card_err:
                    print(f"Error assigning card {card_number} to device {device_name}: {card_err}")  # Debug print

            # Server module
            tia_project.device_manager.add_device_cards(
                tia_project.myproject,
                device_name,
                'Server',
                'Server module_1',
                card_number+1,
                'Server'
            )

        except Exception as device_err:
            print(f"Error creating device {device_name}: {device_err}")  # Debug print
