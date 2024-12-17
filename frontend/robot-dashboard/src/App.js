import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [robots, setRobots] = useState([]);
  const [filteredRobots, setFilteredRobots] = useState([]);
  const [filter, setFilter] = useState("all"); // Filter state: 'all', 'active', 'offline', 'low_battery'

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/fake_robot_data")
      .then((response) => {
        console.log("Data fetched successfully:", response.data); // Debugging log
        setRobots(response.data);
        setFilteredRobots(response.data); // Initialize filteredRobots with full data
      })
      .catch((error) => {
        console.error("Error fetching data from the backend:", error);
      });
  }, []);

  // Handle filter changes
  const handleFilterChange = (filter) => {
    setFilter(filter);
    let updatedFilteredRobots = [];
    switch (filter) {
      case "active":
        updatedFilteredRobots = robots.filter((robot) => robot.status);
        break;
      case "offline":
        updatedFilteredRobots = robots.filter((robot) => !robot.status);
        break;
      case "low_battery":
        updatedFilteredRobots = robots.filter((robot) => robot.battery < 20);
        break;
      default:
        updatedFilteredRobots = robots;
    }
    setFilteredRobots(updatedFilteredRobots);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Robot Monitoring Dashboard</h1>

      {/* Filter Buttons */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          onClick={() => handleFilterChange("all")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: filter === "all" ? "#2196F3" : "#f0f0f0",
            color: filter === "all" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          All Robots
        </button>
        <button
          onClick={() => handleFilterChange("active")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: filter === "active" ? "#4CAF50" : "#f0f0f0",
            color: filter === "active" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Active
        </button>
        <button
          onClick={() => handleFilterChange("offline")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: filter === "offline" ? "#FF5722" : "#f0f0f0",
            color: filter === "offline" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Offline
        </button>
        <button
          onClick={() => handleFilterChange("low_battery")}
          style={{
            padding: "10px 20px",
            backgroundColor: filter === "low_battery" ? "#FFC107" : "#f0f0f0",
            color: filter === "low_battery" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Low Battery
        </button>
      </div>

      {/* Dashboard Layout */}
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        {/* Robot Details Section */}
        <div
          style={{
            flex: "1",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Robot Details</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>ID</th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Status</th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Battery</th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>CPU</th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>RAM</th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredRobots.map((robot) => (
                <tr
                  key={robot.id}
                  style={{
                    backgroundColor: robot.status ? "#e8f5e9" : "#ffebee",
                  }}
                >
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{robot.id}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {robot.status ? "Online" : "Offline"}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{robot.battery}%</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{robot.cpu}%</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{robot.ram} MB</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {new Date(robot.last_updated * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Map Section */}
        <div
          style={{
            flex: "1.5",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <MapContainer
            center={filteredRobots.length > 0 ? [filteredRobots[0].location.lat, filteredRobots[0].location.lng] : [0, 0]}
            zoom={filteredRobots.length > 0 ? 5 : 2}
            style={{ height: "80vh", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredRobots.map((robot) => (
              <Marker
                key={robot.id}
                position={[robot.location.lat, robot.location.lng]}
                icon={L.icon({
                  iconUrl: robot.status ? "/location.png" : "/placeholder.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              >
                <Popup>
                  <div>
                    <strong>{robot.id}</strong>
                    <br />
                    Status: {robot.status ? "Online" : "Offline"}
                    <br />
                    Battery: {robot.battery}%
                    <br />
                    CPU: {robot.cpu}%
                    <br />
                    RAM: {robot.ram} MB
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
