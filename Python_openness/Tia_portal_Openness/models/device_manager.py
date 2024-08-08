import json
import os
import clr # pip install pythonnet

__ref = "C:\\Program Files\\Siemens\\Automation\\Portal V19\\PublicAPI\\V19\\Siemens.Engineering.dll"
clr.AddReference(__ref)
from System.IO import DirectoryInfo, FileInfo
import Siemens.Engineering as tia
import Siemens.Engineering.HW.Features as hwf
import json
from Tia_portal_Openness.models.network_manager import NetworkManager


class DeviceManager:
    def __init__(self):
        self.file_paths = {
            "iocards": "C:\\Users\\gr\\PycharmProjects\\pythonProject\\Tia_portal_Openness\\models\\mapping_iocards.json",
            "cpucards": "C:\\Users\\gr\\PycharmProjects\\pythonProject\\Tia_portal_Openness\\models\\mapping_cpucards.json",
            "riocards": "C:\\Users\\gr\\PycharmProjects\\pythonProject\\Tia_portal_Openness\\models\\mapping_riocards.json"
        }
        self.merged_file_path = "C:\\Users\\gr\\PycharmProjects\\pythonProject\\Tia_portal_Openness\\models\\merged_mapping.json"
        self.device_mapping = self.merge_and_load_mappings()

    def merge_and_load_mappings(self):
        merged_mapping = {}
        for key, file_path in self.file_paths.items():
            with open(file_path, 'r') as file:
                mapping = json.load(file)
                merged_mapping.update({key: mapping})

        # Optionally save the merged mapping to a file for future use
        with open(self.merged_file_path, 'w') as file:
            json.dump(merged_mapping, file, indent=4)

        return merged_mapping

    def add_to_map(self, name, order_number, type_card):
        if type_card in self.file_paths:
            # Update the specified file directly
            with open(self.file_paths[type_card], 'r+') as file:
                data = json.load(file)
                data[name] = order_number
                file.seek(0)  # Move file cursor to the beginning
                json.dump(data, file, indent=4)
                print(f'Device added to {type_card} mapping.')
                self.device_mapping = self.merge_and_load_mappings()
        else:
            # Update the merged mapping
            self.device_mapping[type_card][name] = order_number
            self.save_mapping_to_file(self.device_mapping)
            print('Device added to device mapping.')

    def save_mapping_to_file(self, mapping):
        # This method now saves to the merged file
        with open(self.merged_file_path, 'w') as file:
            json.dump(mapping, file, indent=4)

    def get_mapping(self, mapping_type=None):
        if mapping_type and mapping_type in self.file_paths:
            with open(self.file_paths[mapping_type], 'r') as file:
                return {mapping_type: json.load(file)}
        else:
            return self.device_mapping

    def find_device_by_name(self, myproject, device_name):
        device = next((d for d in myproject.Devices if d.Name == device_name), None)
        if device is None:
            raise ValueError(f"Device with name {device_name} not found.")
        return device

    def create_device(self, myproject, order_number, device_name, item_name, ip_address, subnet_masks):
        found = False
        for device_type, devices in self.device_mapping.items():
            if order_number in devices:
                order_number = devices[order_number]
                found = True
                break
        if not found:
            raise ValueError("Order number not found in device mapping!")
        print(order_number)
        device = myproject.Devices.CreateWithItem(order_number, device_name, item_name)
        self.configure_network_interfaces(device, ip_address, subnet_masks)

    def configure_network_interfaces(self, device, ip_addresses, subnet_masks):
        ip = ip_addresses
        n_interfaces = []
        device_item_aggregation = device.DeviceItems[1].DeviceItems
        for deviceitem in device_item_aggregation:
            network_service = tia.IEngineeringServiceProvider(deviceitem).GetService[hwf.NetworkInterface]()
            if isinstance(network_service, hwf.NetworkInterface):
                n_interfaces.append(network_service)
        network = NetworkManager()
        network.assign_ip_addresses(n_interfaces, ip, subnet_masks)

    def add_device_cards(self, myproject, device_name, order_number, name, slot, potential):
        device = self.find_device_by_name(myproject, device_name)
        found = False
        for device_type, devices in self.device_mapping.items():
            if order_number in devices:
                order_number = devices[order_number]
                found = True
                break
        if not found:
            raise ValueError("Order number not found in device mapping!")
        if device.DeviceItems[0].CanPlugNew(order_number, name, slot):
            device.DeviceItems[0].PlugNew(order_number, name, slot)
        if potential == 'WH':
            potential = 'Light'
        elif potential == 'Server':
            return
        else: potential = 'Dark'
        self.set_potential_group(myproject, device_name, name, potential)

    def list_all_devices(self, myproject):
        devices = myproject.Devices
        for device in devices:
            print(f"Device: {device.Name}")
            for index, device_item in enumerate(device.DeviceItems):
                type_name = device_item.GetAttribute('TypeName')
                print(f"  DeviceItem: {device_item.Name}, TypeName: {type_name}")

    def set_potential_group(self, myproject, device_name, device_item_name, potential_group_value):
        device = next((d for d in myproject.Devices if d.Name == device_name), None)
        if device is None:
            print(f"Device with name {device_name} not found.")
            return

        device_item = next((item for item in device.DeviceItems if item.Name == device_item_name), None)
        if device_item is None:
            print(f"DeviceItem with name {device_name} not found.")
            return

        if potential_group_value == "Light":
            potential_group_value = tia.HW.PotentialGroup.LightBaseUnit
        else: potential_group_value = tia.HW.PotentialGroup.DarkBaseUnit

        device_item.SetAttribute("PotentialGroup", potential_group_value)
        retrieved_potential_group = device_item.GetAttribute("PotentialGroup")
        print(f"Set PotentialGroup to: {retrieved_potential_group}")

    def delete_device(self, myproject, device_name):
        device = next((d for d in myproject.Devices if d.Name == device_name), None)
        if device is None:
            raise ValueError(f"Device with name {device_name} not found.")
        device.Delete()