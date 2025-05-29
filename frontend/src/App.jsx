import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import ViewDataPage from "./pages/ViewDataPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import CampaignHistoryPage from "./pages/CampaignHistoryPage";
import CampaignDetailPage from "./pages/CampaignDetailPage";
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <Router>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/view-data" element={<ViewDataPage />} />
          <Route path="/create-campaign" element={<CreateCampaignPage />} />
          <Route path="/campaign-history" element={<CampaignHistoryPage />} />
          <Route path="/campaign-detail/:id" element={<CampaignDetailPage />} />
      
        </Routes>
        <ToastContainer/>
      </Router>
    </>
  );
}

export default App;
