
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import styles from "./Home.module.css"

function Home() {
    const handleClick = () => {
    const discordLink = "https://discord.com/channels/@me";
    window.open(discordLink, "_blank");
  };


    return (<>
        <div className={styles.home} data-reveal>
            <Header />
            <Card title="In Build 🚧" description="lien vers le serveur Discord" children={<Button onClick={handleClick} name="discord"></Button>} />
        </div>
        </>
    );
}

export default Home