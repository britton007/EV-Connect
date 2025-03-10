import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import {
  getChargePoints,
  createChargePoint as createChargePointDb,
  updateChargePoint as updateChargePointDb,
  deleteChargePoint as deleteChargePointDb,
} from "../../database.server";

function ChargePointManagement() {
  const [chargePoints, setChargePoints] = useState([]);
  const [newChargePoint, setNewChargePoint] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    ocppServerAddress: "",
    authorizationKey: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChargePointIndex, setEditingChargePointIndex] = useState(null);
  const [websiteAddress, setWebsiteAddress] = useState("");
  const [wssAddress, setWssAddress] = useState("");
  const [selectedChargePoint, setSelectedChargePoint] = useState(null);

  useEffect(() => {
    // Dynamically determine the website address
    const protocol = window.location.protocol;
    const host = window.location.host;
    setWebsiteAddress(`${protocol}//${host}`);

    // Determine the WSS address (assuming it's the same host but with wss protocol)
    const wssProtocol = protocol === "https:" ? "wss:" : "ws:";
    setWssAddress(`${wssProtocol}//${host}`);

    loadChargePoints();
  }, []);

  const loadChargePoints = async () => {
    const chargePoints = await getChargePoints();
    setChargePoints(chargePoints);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChargePoint((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateChargePoint = async () => {
    const newKey = Math.random().toString(36).substring(2, 15);
    // Extract first name and last name from the charge point name
    const nameParts = newChargePoint.name.split(" ");
    let username = "";
    if (nameParts.length >= 2) {
      const firstName = nameParts[0].toLowerCase();
      const lastName = nameParts[nameParts.length - 1].toLowerCase();
      username = `${firstName}${lastName}`;
    } else {
      // If there's only one name, use it as the username
      username = newChargePoint.name.toLowerCase();
    }
    const chargePointData = {
      ...newChargePoint,
      authorizationKey: newKey,
      username: username, // Add username to charge point details
      password: null, // Initially no password
    };
    const createdChargePoint = await createChargePointDb(chargePointData);
    if (createdChargePoint) {
      setChargePoints((prev) => [...prev, createdChargePoint]);
      setNewChargePoint({
        name: "",
        address: "",
        phoneNumber: "",
        ocppServerAddress: "",
        authorizationKey: "",
      });
      setShowCreateForm(false);
    } else {
      alert("Failed to create charge point.");
    }
  };

  const handleEditChargePoint = (index) => {
    setEditingChargePointIndex(index);
    setNewChargePoint(chargePoints[index]);
  };

  const handleUpdateChargePoint = async () => {
    const chargePointToUpdate = chargePoints[editingChargePointIndex];
    if (!chargePointToUpdate) {
      alert("Charge point not found for updating.");
      return;
    }

    const updatedChargePoint = await updateChargePointDb(
      chargePointToUpdate.id,
      newChargePoint
    );
    if (updatedChargePoint) {
      const updatedChargePoints = [...chargePoints];
      updatedChargePoints[editingChargePointIndex] = updatedChargePoint;
      setChargePoints(updatedChargePoints);
      setEditingChargePointIndex(null);
      setNewChargePoint({
        name: "",
        address: "",
        phoneNumber: "",
        ocppServerAddress: "",
        authorizationKey: "",
      });
    } else {
      alert("Failed to update charge point.");
    }
  };

  const handleDeleteChargePoint = async (index) => {
    const chargePointToDelete = chargePoints[index];
    if (!chargePointToDelete) {
      alert("Charge point not found for deletion.");
      return;
    }

    const success = await deleteChargePointDb(chargePointToDelete.id);
    if (success) {
      const updatedChargePoints = [...chargePoints];
      updatedChargePoints.splice(index, 1);
      setChargePoints(updatedChargePoints);
    } else {
      alert("Failed to delete charge point.");
    }
  };

  const handleChargePointSelect = (chargePoint) => {
    setSelectedChargePoint(chargePoint);
  };

  const handleBackToList = () => {
    setSelectedChargePoint(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Charge Point Management
      </h2>

      {!selectedChargePoint ? (
        <>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          >
            Create New Charge Point
          </button>

          {showCreateForm && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                New Charge Point Details
              </h3>
              <div className="flex flex-col gap-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newChargePoint.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  >
                    Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newChargePoint.address}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  >
                    Phone Number:
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={newChargePoint.phoneNumber}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ocppServerAddress"
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  >
                    OCPP Server Address:
                  </label>
                  <input
                    type="text"
                    id="ocppServerAddress"
                    name="ocppServerAddress"
                    value={newChargePoint.ocppServerAddress}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <button
                  onClick={handleCreateChargePoint}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Charge Point
                </button>
              </div>
            </div>
          )}

          {chargePoints && chargePoints.length > 0 ? (
            <ul>
              {chargePoints.map((chargePoint, index) => (
                <li
                  key={index}
                  className="border rounded p-4 mb-2 dark:border-gray-600"
                >
                  <button
                    onClick={() => handleChargePointSelect(chargePoint)}
                    className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:underline"
                    style={{ textAlign: "left", display: "block", width: "100%" }}
                  >
                    {chargePoint.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No charge points connected yet.
            </p>
          )}
        </>
      ) : (
        <div>
          <button
            onClick={handleBackToList}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          >
            Back to List
          </button>

          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Charge Point Details
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Name: {selectedChargePoint.name}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Address: {selectedChargePoint.address}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Phone: {selectedChargePoint.phoneNumber}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            OCPP Server: {selectedChargePoint.ocppServerAddress}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Authorization Key: {selectedChargePoint.authorizationKey}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Username: {selectedChargePoint.username}
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => handleEditChargePoint(chargePoints.indexOf(selectedChargePoint))}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteChargePoint(chargePoints.indexOf(selectedChargePoint))}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete
            </button>
          </div>

          {editingChargePointIndex === chargePoints.indexOf(selectedChargePoint) && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Edit Charge Point
              </h3>
              <div className="flex flex-col gap-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newChargePoint.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  >
                    Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newChargePoint.address}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  >
                    Phone Number:
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={newChargePoint.phoneNumber}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ocppServerAddress"
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  >
                    OCPP Server Address:
                  </label>
                  <input
                    type="text"
                    id="ocppServerAddress"
                    name="ocppServerAddress"
                    value={newChargePoint.ocppServerAddress}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <button
                  onClick={handleUpdateChargePoint}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Charge Point
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <p className="text-gray-600 dark:text-gray-400">
          Website Address: {websiteAddress}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          WSS Address: {wssAddress}
        </p>
      </div>
    </div>
  );
}

function Logs() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Logs
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        Here you can monitor the logs.
      </p>
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("chargePoints");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here, e.g., clear session, tokens, etc.
    // For now, just navigate back to the index route.
    navigate("/");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Admin Panel
        </h1>

        <nav className="flex justify-around mb-4">
          <button
            onClick={() => setActiveTab("chargePoints")}
            className={`py-2 px-4 rounded focus:outline-none ${activeTab === "chargePoints"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            Charge Points
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`py-2 px-4 rounded focus:outline-none ${activeTab === "logs"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            Logs
          </button>
        </nav>

        {activeTab === "chargePoints" && <ChargePointManagement />}
        {activeTab === "logs" && <Logs />}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
