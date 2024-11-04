import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import LoginWithEmail from './Pages/LoginWithEmail';
import LoginWithGoogle from './Pages/LoginWithGoogle';
import Register from './Pages/Register';
import Navbar from './Components/Navbar';
import Orders from './Components/Orders';

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/signupwithcredential" element={<LoginWithEmail/>}></Route>
          <Route path="/signupwithgoogle" element={<LoginWithGoogle/>}></Route>
          <Route path="/createaccount" element={<Register/>}></Route>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/orders" element={<Orders/>}></Route>
          
        </Routes>
      </div>  
    </Router>
  );
}

export default App;
