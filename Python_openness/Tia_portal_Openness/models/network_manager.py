class NetworkManager:
    def assign_ip_addresses(self, n_interfaces, ip_addresses, subnet_masks):
        for n_interface in n_interfaces:
            n_interface.Nodes[0].SetAttribute('Address', ip_addresses)
            n_interface.Nodes[0].SetAttribute('SubnetMask', subnet_masks)

    def create_network_and_iosystem(self, n_interfaces):
        subnet = n_interfaces[0].Nodes[0].CreateAndConnectToSubnet("Profinet")
        ioSystem = n_interfaces[0].IoControllers[0].CreateIoSystem("PNIO")
        for n in n_interfaces[1:]:
            n.Nodes[0].ConnectToSubnet(subnet)
            if n.IoConnectors.Count > 0:
                n.IoConnectors[0].ConnectToIoSystem(ioSystem)