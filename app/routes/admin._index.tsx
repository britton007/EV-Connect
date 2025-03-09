import { useState, useEffect } from "react";

function ChargePointManagement({ chargePoints, setChargePoints }) {
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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChargePoint((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateChargePoint = () => {
    const newKey = Math.random().toString(36).substring(2, 15);
    const chargePointWithKey = {
      ...newChargePoint,
      authorizationKey: newKey,
    };
    setChargePoints((prev) => [...prev, chargePointWithKey]);
    setNewChargePoint({
      name: "",
      address: "",
      phoneNumber: "",
      ocppServerAddress: "",
      authorizationKey: "",
    });
    setShowCreateForm(false);
  };

  const handleEditChargePoint = (index) => {
    setEditingChargePointIndex(index);
    setNewChargePoint(chargePoints[index]);
  };

  const handleUpdateChargePoint = () => {
    const updatedChargePoints = [...chargePoints];
    updatedChargePoints[editingChargePointIndex] = newChargePoint;
    setChargePoints(updatedChargePoints);
    setEditingChargePointIndex(null);
    setNewChargePoint({
      name: "",
      address: "",
      phoneNumber: "",
      ocppServerAddress: "",
      authorizationKey: "",
    });
  };

  const handleDeleteChargePoint = (index) => {
    const updatedChargePoints = [...chargePoints];
    updatedChargePoints.splice(index, 1);
    setChargePoints(updatedChargePoints);
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

function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addUser = () => {
    setUsers((prev) => [...prev, newUser]);
    setNewUser({ name: "", email: "" });
  };

  const startEdit = (user) => {
    setEditingUser(user);
  };

  const updateUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user === editingUser ? updatedUser : user))
    );
    setEditingUser(null);
  };

  const deleteUser = (userToDelete) => {
    setUsers((prev) => prev.filter((user) => user !== userToDelete));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        User Management
      </h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Add New User
        </h3>
        <div className="flex flex-col gap-2">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <button
            onClick={addUser}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add User
          </button>
        </div>
      </div>

      {users.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Existing Users
          </h3>
          <ul>
            {users.map((user) => (
              <li key={user.name} className="border rounded p-4 mb-2 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {user.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => startEdit(user)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {editingUser === user && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Edit User
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                          Name:
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newUser.name}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                          Email:
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={newUser.email}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <button
                        onClick={() => updateUser(newUser)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("chargePoints");
  const [chargePoints, setChargePoints] = useState([]);

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
          <button
            onClick={() => setActiveTab("users")}
            className={`py-2 px-4 rounded focus:outline-none ${activeTab === "users"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            Users
          </button>
        </nav>

        {activeTab === "chargePoints" && (
          <ChargePointManagement
            chargePoints={chargePoints}
            setChargePoints={setChargePoints}
          />
        )}
        {activeTab === "logs" && <Logs />}
        {activeTab === "users" && <Users />}
      </div>
    </div>
  );
}
