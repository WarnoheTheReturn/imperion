import styles from "./Header.module.css"

function Header() {
    
    return (
        <header className={styles.header}>
            <h1>Impérion</h1>
            <h2>Une bot pour faire entrer l'empire francais dans une nouvelle dimension</h2>
        </header>
    );
}

export default Header;