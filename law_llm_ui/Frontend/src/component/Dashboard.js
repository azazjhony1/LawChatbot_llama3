import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus } from 'react-icons/fa';


const Dashboard = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No token found in local storage");
        return;
      }

      try {
        const response = await fetch("http://192.168.0.114:8000/api/users/documents/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();
        console.log(data);
        setDocuments(data);
      } catch (error) {
        console.error("An error occurred while fetching documents:", error);
        setError("Failed to fetch documents. Please try again later.");
      }
    };

    fetchDocuments();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    try {
      const response = await fetch("http://192.168.0.114:8000/auth/token/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
      });

      if (response.status === 204) {
        // Successfully logged out
        localStorage.removeItem("auth_token");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const handleCreateDocument = () => {
    // Logic to handle document creation using the message
    console.log("Document created with message:", message);
    // Hide the modal after creating the document
    setShowModal(false);
  };

  // Group documents by status
  const groupedDocuments = documents.reduce((acc, document) => {
    acc[document.status] = [...(acc[document.status] || []), document];
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
      }}
    >
      {/* Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-10"
      >
        <div className="flex items-center">
          <img
            src={logo} // Replace with your logo URL
            alt="Logo"
            className="h-10 w-20 mr-3"
          />
          <span className="text-2xl font-bold text-black">Dashboard</span>
        </div>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-700 mr-4">
            Username
          </span>{" "}
          {/* Replace 'Username' with actual username */}
          <button
            className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </motion.div>
            {/* Plus sign icon */}
            <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-16 right-6"
      >
        <button
          className="mt-5 text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full h-10 w-10 flex items-center justify-center shadow-lg"
          onClick={() => setShowModal(true)}
        >
<FaPlus className="h-5 w-5" />


        </button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-20 flex flex-col items-center justify-center flex-1"
      >
        {Object.entries(groupedDocuments).map(([status, docs]) => (
          <div key={status} className="w-full px-6 mb-8">
            <h2 className="mb-3 mt-3 text-3xl font-bold text-black capitalize">{status} documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {docs.map((document, index) => (
                <motion.div
                  key={document.id}
                  onClick={() => navigate(`/Editor/${document.id}`, { state: { documentData: document } })}
                  className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden h-48"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-gray-800">
                        Document {index + 1}
                      </div>
                      <div className="text-3xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="34"
                          height="44"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-file"
                          style={{ color: document.status === "draft" ? "#1E40AF" : "#16A34A" }} // Blue for draft, green for finalized
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                      </div>
                    </div>
                    <div className="text-sm mt-2">
                      Status: {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </div>
                  </div>
                  <div className={document.status === "draft" ? "mt-12 bg-blue-500 py-4" : "mt-12 bg-green-500 py-4"}></div>
   
                </motion.div>
              ))}
              
            </div>
          </div>
        ))}

        {/* Create Button */}
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-lg px-8 py-3 mt-8 mb-5"
          onClick={() => setShowModal(true)}
        >
          Create Document
        </motion.button>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Create Document</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title of document
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                onClick={handleCreateDocument}
              >
                Create
              </button>
              <button
                className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
