import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {AdminApp, AdminInfo, AdminOffices, AdminUsers, AuthPage, MainPage, UserApp, UserInfo, UserLike} from "../pages"

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const handleLogin = (role) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage onLogin={handleLogin}/>}/>
        <Route path="/main" element={<MainPage userRole={userRole}/>}/>
        <Route path="/user-info" element={<UserInfo onLogout={handleLogout}/>}/>
        <Route path="/user-like" element={<UserLike onLogout={handleLogout}/>}/>
        <Route path="/user-app" element={<UserApp onLogout={handleLogout}/>}/>
        <Route path="/admin-info" element={<AdminInfo onLogout={handleLogout}/>}/>
        <Route path="/admin-offices" element={<AdminOffices onLogout={handleLogout}/>}/>
        <Route path="/admin-app" element={<AdminApp onLogout={handleLogout}/>}/>
        <Route path="/admin-users" element={<AdminUsers onLogout={handleLogout}/>}/>
      </Routes>
    </Router>
  );
};

export default App;
