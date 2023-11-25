import Dashboard from "./components/Dashboard.jsx";
import { Route, Routes } from "react-router";
import Login from "./components/Login.jsx";
import AddUser from "./components/AddUser.jsx";
import ListUsers from "./components/ListUsers.jsx";

export const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/addUser" element={<AddUser></AddUser>} />
        <Route path="/listUsers" element={<ListUsers></ListUsers>} />
      </Routes>
    </div>
  );
};
