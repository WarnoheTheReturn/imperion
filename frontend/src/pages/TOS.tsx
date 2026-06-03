
import style from './TOS.module.css'
import React from 'react'

function Tos() {
  const lastUpdate = "26 Mai 2026";
  const description = `Ce document explique ce que fait le bot,\
   ce qu'il attend de ses utilisateurs, quelles données il manipule, \
   et quelles sont les limites de responsabilité. \n En utilisant MonBot,\
   vous acceptez ces conditions. Si vous n'êtes pas d'accord avec elles, \
   n'utilisez pas le service. \n\nDernière mise à jour : ${lastUpdate}`;
  
  const descriptionWithDateWithBreaks = description.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>  
  ));

    const descriptionEnBref = "Imperium collecte uniquement ce qui est necessaire a \
      son fonctionnement.\n Vos donnees ne sont ni vendues, ni transmises a des tiers \
      a des fins commerciales.\n Vous pouvez demander l'acces, la correction ou la \
      suppression de vos donnees a tout moment.\n La base legale principale est votre \
      consentement lors de la liaison de vos comptes."

    const descriptionEnBrefWithBreaks = descriptionEnBref.split('\n').map((line, index) => (
      <React.Fragment key={index}>

        <li>
          <span className={style.tosDot}></span>
          <span>{line}</span>
        </li>
        <br />
      </React.Fragment>  
    ));


  return (
    <div className={style.tosContainer}>
      <h1>Terms of Service</h1>
      <main>
        <section className={style.tosTopSection}>
          <div className={style.tosDescription}>
            <h2>Un cadre simple pour utiliser imperium</h2>
            <p>{descriptionWithDateWithBreaks}</p>
          </div>
          <div className={style.tosSummary}>
            <h2>En bref</h2>
            <ul >
              {descriptionEnBrefWithBreaks}
            </ul>
          </div>
        </section>
        <section className={style.tosSection}>
        </section>
      </main>
      
    </div>
  );
}

export default Tos;