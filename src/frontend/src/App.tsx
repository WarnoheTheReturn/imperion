
import Footer from './components/Footer'
import Nav from './components/Nav'
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TOS from './pages/TOS';
import PP from './pages/PP';
import CallbackDiscord from './pages/CallbackDiscord';
import CallbackRoblox from './pages/CallbackRoblox';


function App() {
  const [isLoggedIn, _setIsLoggedIn] = useState(false);

    useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    });

    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((el) => observer.observe(el));


    
  }, []);
  
  return (
      <Router>
        <Nav isLoggedIn={isLoggedIn} />

      
    
        <Routes>
          <Route path="/callback/roblox" element={<CallbackRoblox />} />
          <Route path="/callback/discord" element={<CallbackDiscord />} />
          <Route path="/tos" element={<TOS />} />
          <Route path="/pp" element={<PP />} />
          <Route path="/" element={<Home />} />
        </Routes>


        

        <Footer />
      </Router>

  )
}

export default App