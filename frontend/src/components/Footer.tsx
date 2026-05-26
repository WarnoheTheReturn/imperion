function Footer() {
    return (
        <footer>
            <li><a href="/tos">Terms of Service</a></li>
            <li><a href="/pp">Privacy Policy</a></li>
            <p>&copy; {new Date().getFullYear()} JSP</p>
        </footer>
    );
}

export default Footer;