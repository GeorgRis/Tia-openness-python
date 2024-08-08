import clr  # pip install pythonnet
# Your refference code
__ref = ""
clr.AddReference(__ref)

from System.IO import DirectoryInfo, FileInfo
import Siemens.Engineering as tia
import Siemens.Engineering.HW.Features as hwf
import json

from Tia_portal_Openness.models.device_manager import DeviceManager
from Tia_portal_Openness.models.network_manager import NetworkManager
from Tia_portal_Openness.models.compile_manager import CompilerManager
class TIAOpennessBase:
    def __init__(self, project_path, project_name):
        self.project_path = DirectoryInfo(project_path)
        self.project_name = project_name
        self.mytia = None
        self.myproject = None

class TIAProject(TIAOpennessBase):
    def __init__(self, project_path, project_name):
        super().__init__(project_path, project_name)
        self.device_manager = DeviceManager()
        self.network_manager = NetworkManager()
        self.compiler_manager = CompilerManager()

    def start_tia(self):
        print('Starting TIA with UI')
        self.mytia = tia.TiaPortal(tia.TiaPortalMode.WithUserInterface)
        processes = tia.TiaPortal.GetProcesses()
        print(processes)

    def create_project(self):
        try:
            self.myproject = self.mytia.Projects.Create(self.project_path, self.project_name)
            print(self.myproject)
        except Exception as e:
            print(e)
            self.open_existing_project()
            print(f"{self.project_name} already exist or something went wrong, opening the project instead.")

    def open_existing_project(self):
        project_file_path = f"{self.project_path.FullName}\\{self.project_name}\\{self.project_name}.ap19"
        print(project_file_path)
        try:
            self.myproject = self.mytia.Projects.Open(FileInfo(project_file_path))
            print(f"Project {self.project_name} opened successfully.")
        except Exception as e:
            print(f"Error opening project: {e}")

    def add_devices_units_from_json(self, json_data):
        try:
            with open(json_data, 'r') as file:
                data = file.read()
            devices = json.loads(data)
            for device_name, device_info in devices.items():
                order_number = device_info["Device Name"]
                device_type = device_info["DeviceType"]
                ip_address = device_info.get("IP-addr", {})
                subnet_masks = device_info.get("SubnetMask", {})
                cards = device_info["Cards"]

                # Create device
                device = self.device_manager.create_device(
                    self.myproject,
                    device_type,
                    device_name,
                    device_name,  # Using order_number as item_name
                    ip_address,
                    subnet_masks
                )
                i = 1
                # Add device cards
                for slot, card_info in cards.items():
                    card_type = card_info["Type"]
                    base_unit = card_info["BaseUnit"]
                    addresses = card_info["Adresses"]
                    # Avoid adding addresses with NaN values
                    self.device_manager.add_device_cards(
                        self.myproject,
                        device_name,
                        card_type,
                        card_type,
                        i,
                        base_unit
                    )
                    i += 1

                print(f"Added device: {device_name}")
        except Exception as e:
            print(e)
            print('Device may already exist, check error')

        # self.network_manager.create_network_and_iosystem(n_interfaces)

    def add_and_configure_devices(self, devices, ip_addresses):
        try:
            for unit in devices:
                device = self.device_manager.create_device(self.myproject, unit['order_number'], unit['device_name'], unit['item_name'])
                self.device_manager.add_device_cards(device, unit['cards'])
                print(f"Added device: {unit['device_name']}")

            n_interfaces = []
            for device in self.myproject.Devices:
                device_item_aggregation = device.DeviceItems[1].DeviceItems
                for deviceitem in device_item_aggregation:
                    network_service = tia.IEngineeringServiceProvider(deviceitem).GetService[hwf.NetworkInterface]()
                    if isinstance(network_service, hwf.NetworkInterface):
                        n_interfaces.append(network_service)

            self.network_manager.assign_ip_addresses(n_interfaces, ip_addresses)
            self.network_manager.create_network_and_iosystem(n_interfaces)
        except Exception as e:
            print(f"Error during adding or configuring devices: {e}")
