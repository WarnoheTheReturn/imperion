
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'

function Home() {
    const handleClick = () => {
    const discordLink = "https://discord.com/channels/@me";
    window.open(discordLink, "_blank");
  };
    return (
        <div>
            <Header />
            <Card title="Bienvenue sur le site du bot Impérion" description="Ixaxa" />
            <Card title="discord" description="lien discord" children={<Button onClick={handleClick} name="discord"></Button>} />
            <Card />
        </div>
    );
}

export default Home