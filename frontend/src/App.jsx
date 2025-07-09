import { Toaster } from "react-hot-toast";
import { Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import  UpdateUser from "./pages/UpdateUser.jsx"
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";



function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="update-user/:slug" element={<UpdateUser/>} />
        <Route path="register" element={<Register/>} />
        <Route path="login" element={<Login/>} />

      </Routes>
    </>
  );
}

export default App;
