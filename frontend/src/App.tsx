
import Footer from './components/Footer'
import Nav from './components/Nav'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import TOS from './pages/TOS';
import PP from './pages/PP';
import CallbackDiscord from './pages/CallbackDiscord';
import CallbackRoblox from './pages/CallbackRoblox';

export interface User {
    id: string;
    username: string;
    avatar?: string;
}



function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

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

      return () => {
        elements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      };
    
  }, [location.pathname]);

    useEffect(() => {
      const fetchSession = async () => {
        try {
          const response = await fetch('/api/me');
          const userData = await response.json();
          if (userData.user) {
            setUser(userData.user);
          }
        } catch (error) {
          console.error('Error fetching session:', error);
        }
        setLoading(false);
      };

      fetchSession();
    }, []);

    return (
    <>

    <Nav user={user} loading={loading} />

    <Routes>
      <Route path="/callback/roblox" element={<CallbackRoblox />} />
      <Route path="/callback/discord" element={<CallbackDiscord setUser={setUser} />} />
      <Route path="/tos" element={<TOS />} />
      <Route path="/pp" element={<PP />} />
      <Route path="/" element={<Home />} />
    </Routes>


    

    <Footer />
  </>
  )
}

export default App