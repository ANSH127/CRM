import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import LoginPage from "./pages/LoginPage";
function App() {

  return (
    <>
      <Router>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
