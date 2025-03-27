import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/admin/LoginForm";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Mock login function - in a real app, this would connect to your authentication service
  const handleLogin = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, accept any non-empty credentials
        const isValid = username.trim() !== "" && password.trim() !== "";

        if (isValid) {
          // In a real app, you would store auth token in localStorage or a state management solution
          localStorage.setItem("adminAuthenticated", "true");
          navigate("/admin/dashboard");
        }

        setIsLoading(false);
        resolve(isValid);
      }, 1500); // Simulate network delay
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-blue-800">
              AC Home Jaya Teknik
            </h1>
            <p className="text-gray-600 mt-2">Admin Portal</p>
          </motion.div>
        </div>

        <LoginForm onLogin={handleLogin} />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} AC Home Jaya Teknik. All rights
            reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
