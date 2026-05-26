import styles from './Footer.module.css'

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <p>&copy; {new Date().getFullYear()} Impérion. All rights reserved.</p>
                <div className={styles.footerLinks}>
                    <a href="/tos">Terms of Service · </a>
                    <a href="/pp">Privacy Policy · </a>
                    <a href="#contact">Contact Us</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;