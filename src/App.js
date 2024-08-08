import React, { useState } from 'react';
import './App.css';
import StartTIA from './components/StartTIA';
import CreateProject from './components/CreateProject';
import OpenProject from './components/OpenProject';
import AddDevice from './components/AddDevice';
import AssignDevice from './components/AssignDevice';
import AddDevicesJson from './components/AddDevicesJson';
import DeleteDevice from './components/DeleteDevice';
import ConfigureNetwork from './components/ConfigureNetwork';
import ListDevices from './components/ListDevices';
import CompileDevices from './components/CompileDevices';
import CompileSoftware from './components/CompileSoftware';
import SetPotentialGroup from './components/SetPotentialGroup';
import AddToDeviceMap from './components/AddToDeviceMap';
import GetDeviceMapping from './components/GetDeviceMapping';
import SaveAndClose from './components/SaveAndClose';
import UploadFile from './components/UploadFile'; // Import the new component

function App() {
    const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
    const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
    const [isCompileMenuOpen, setIsCompileMenuOpen] = useState(false);
    const [isMapMenuOpen, setIsMapMenuOpen] = useState(false);

    return (
        <div className="App">
            <h1>TIA Portal Management</h1>

            <StartTIA />

            <div className="menu">
                <h2 onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}>
                    Project Management {isProjectMenuOpen ? '-' : '+'}
                </h2>
                <div className={`submenu ${isProjectMenuOpen ? 'open' : 'closed'}`}>
                    <CreateProject />
                    <OpenProject />
                </div>
            </div>

            <div className="menu">
                <h2 onClick={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}>
                    Device Management {isDeviceMenuOpen ? '-' : '+'}
                </h2>
                <div className={`submenu ${isDeviceMenuOpen ? 'open' : 'closed'}`}>
                    <AddDevice />
                    <AssignDevice />
                    <AddDevicesJson />
                    <DeleteDevice />
                    <SetPotentialGroup />
                </div>
            </div>

            <ListDevices />

            <div className="menu">
                <h2 onClick={() => setIsCompileMenuOpen(!isCompileMenuOpen)}>
                    Compile Management {isCompileMenuOpen ? '-' : '+'}
                </h2>
                <div className={`submenu ${isCompileMenuOpen ? 'open' : 'closed'}`}>
                    <CompileDevices />
                    <CompileSoftware />
                </div>
            </div>

            <div className="menu">
                <h2 onClick={() => setIsMapMenuOpen(!isMapMenuOpen)}>
                    Mapping Management {isMapMenuOpen ? '-' : '+'}
                </h2>
                <div className={`submenu ${isMapMenuOpen ? 'open' : 'closed'}`}>
                    <AddToDeviceMap />
                    <GetDeviceMapping />
                </div>
            </div>

            <SaveAndClose />

            <UploadFile /> {/* Add the new component here */}
        </div>
    );
}

export default App;
