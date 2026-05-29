import styles from './Footer.module.css'

function Footer() {
    return (
        <>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerHeader}>
                    <div>
                        <p>Impérion</p>
                    </div>
                    <div >
                        <p>Légal</p>
                        <div className={styles.footerLinks}>
                            <a href="/tos">Terms of Service</a>
                            <a href="/pp">Privacy Policy</a>
                            <a href="#contact">Contact Us</a>
                        </div>
                    </div>
                </div>
                <div className={styles.footerButtom}>
                    <p>&copy; {new Date().getFullYear()} Impérion. All rights reserved.</p>
                    <p>Made with ❤️ by Warnohe</p>
                </div>
            </div>
        </footer>
        </>
    );
}

export default Footer;