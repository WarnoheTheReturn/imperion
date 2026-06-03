import styles from './Nav.module.css';

function Nav({isLoggedIn} : {isLoggedIn: boolean})  {
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

    let loged = isLoggedIn ? "Dashboard" : "Login";
    const logedClass = isLoggedIn ? styles.navDashboard : styles.navLogin;

    return (
        <>
        <nav className={styles.navbar}>   
            <div className={styles.navContainer}>
                <img 
                    src="../src/assets/bot_logo.png"
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

            </div>
        </nav>
        
        </> 
    );
}

export default Nav;