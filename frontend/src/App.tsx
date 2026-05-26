
import Footer from './components/Footer'
import Nav from './components/Nav'
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Callback from './pages/Callback';
import Home from './pages/Home';
import TOS from './pages/TOS';
import PP from './pages/PP';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <body className="App">
      <Router>
        <Nav isLoggedIn={isLoggedIn} />

      
    
        <Routes>
          <Route path="/callback" element={<Callback />} />
          <Route path="/tos" element={<TOS />} />
          <Route path="/pp" element={<PP />} />
          <Route path="/" element={<Home />} />
        </Routes>


        

        <Footer />
      </Router>

    </body>
  )
}

export default App