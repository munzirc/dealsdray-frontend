import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ProtectedRoutes from "./components/ProtectedRoutes";
import EmployeeDetails from "./pages/EmployeeDetails";

function App() {
  return (
    <>
      <NavBar />
      <div className="mt-16">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/employee-details" element={<EmployeeDetails />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
