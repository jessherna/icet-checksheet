import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './partials/Header';
import Footer from './partials/Footer';

import ChecksheetPage from './pages/ChecksheetPage';
import Schedule from './pages/SchedulePage';
//import History from './pages/History';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ChecksheetPage />} />
          <Route path="/schedule" element={<Schedule />} />
          {/*<Route path="/history" element={<History />} />*/}
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
