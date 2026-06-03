import styles from './Nav.module.css';
import { useEffect, useState } from 'react';

function Nav({isLoggedIn} : {isLoggedIn: boolean})  {

    const [isScrolled, setIsScrolled] = useState(false);
    let loged = isLoggedIn ? "Dashboard" : "Login";
    const logedClass = isLoggedIn ? styles.navDashboard : styles.navLogin;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleClick = () => {
        if (isLoggedIn) {
            const dashboardLink = "http://localhost:5173/dashboard";
            window.location.href = dashboardLink;
            return;
        }
        else {
            const discordLink = "https://discord.com/oauth2/authorize?client_id=1506356153536479282&response_type=code&redirect_uri=https%3A%2F%2Fimperion.onrender.com%2Fcallback%2Fdiscord&scope=guilds+openid+identify";
            window.location.href = discordLink;
        }
    };

    
    return (
        <>
            <nav className={`${isScrolled ? styles.navScrolled : ""} ${styles.navContainer}`}>
                <img 
                    src="/bot_logo.png"
                    alt="Bot Logo"
                    className={styles.navLogo}
                />

                <div className={styles.navMenu}>
                    <a href="/">Home</a>
                    <a href="#faq">FAQ</a>
                    <a href="#wiki">Wiki</a>
                    <a href="#forum">Forum</a>
                    <a href="#contact">Contact</a>
                </div>

                <button className={logedClass} onClick={handleClick}>{loged}</button>

            </nav>
        
        </> 
    );
}

export default Nav;