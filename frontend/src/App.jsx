import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';
import { UserContext } from "src/user-context";
import { useState, useEffect } from "react";

import HomePage from "src/pages/home";
import DashboardPage from "src/pages/dashboard";
import LoginPage from "src/pages/login";
import RegisterPage from "src/pages/register";

import theme from "src/themes";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/userdata');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <ChakraProvider theme={theme} resetCss={false}>
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path={`/home`} element={<HomePage />} />
            <Route path={`/dashboard`} element={<DashboardPage />} />
            <Route path={`/login`} element={<LoginPage />} />
            <Route path={`/register`} element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </ChakraProvider>
  )
};

export default App;
