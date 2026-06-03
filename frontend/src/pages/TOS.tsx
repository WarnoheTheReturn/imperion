
import style from './TOS.module.css'
import React from 'react'


export type Rule = {
    name: string;
    description: string;
    information?: {
    [key: number]: {
      type: number;
      name: string;
      description: string;
    };
  };
};


function FormatDescription(description: string) {
  return description.split('\n').map((line, index) => {
    const isBullet = line.trimStart().startsWith('-');
    const content = isBullet ? line.trimStart().slice(1) : line;

    return (
      <React.Fragment key={index}>
        {isBullet
          ? <ul>
              <li className={style.tosBullet}>
                <span className={style.tosDot}></span>
                {content}
              </li>
            </ul>
          : <>{content}<br /></>
        }
      </React.Fragment>
    );
  });
}





export function HTMLRegles(regle : {[key: number] : Rule} ) : any { return Object.values(regle).map((regle , id) => {
  const infos = regle.information ? Object.values(regle.information) : [];
  const gridItems = infos.filter(info => info.type === 5);
  const normalItems = infos.filter(info => info.type !== 5);
    return (
      <section key={id} id={`regle-${id}`} className={style.tosSection}>
        <div className={style.tosSectionNumber}>{id + 1}</div>
        <h3 className={style.tosSectionTitle}>{regle.name}</h3>
        <p className={style.tosSectionDescription}>{FormatDescription(regle.description)}</p>
        {gridItems.length > 0 && (
          <div className={style.tosSectionInformationGrid}>
            {Object.values(gridItems).map((info, index) => (
              <div key={index} className={style.tosSectionInformationGray}>
                <h4>{info.name}</h4>
                <p>{FormatDescription(info.description)}</p>
              </div>
            ))
        }
          </div>
        )}

        {normalItems.length > 0 && (
          <div className={style.tosSectionInformation}>
            {Object.values(normalItems).map((info, index) => (
              <div key={index} className={
                info.type === 1 ? style.tosSectionInformationGray :
                info.type === 2 ? style.tosSectionInformationRed : 
                info.type === 3 ? style.tosSectionInformationBlue :
                info.type === 4 ? style.tosSectionInformationGreen :
                ''
                }>
                <h4>{info.name}</h4>
                <p>{FormatDescription(info.description)}</p>
              </div>)
            )}
          </div>
        )}
        
      </section>
    );
})}


export function SummaryMenu(regle : {[key: number] : Rule} ) { const SummaryMenu = Object.entries(regle).map(([key, rule]) => (    
        <a href={`#regle-${Number(key) - 1}`}
        onClick={(e) => 
        {
          e.preventDefault();
          const element = document.getElementById(`regle-${Number(key) - 1}`);
          if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
        }>
            {rule.name}</a>
        ))

      return ( SummaryMenu.map((item, index) => (
        <li key={index}>
          {index+1}. {item}
        </li>
       ))
      
      )
    

}


function Tos() {
  const lastUpdate = "29 Mai 2026";
  const description = `Ce document explique ce que fait le bot,\
   ce qu'il attend de ses utilisateurs, quelles données il manipule, \
   et quelles sont les limites de ces responsabilites. \n En utilisant le service,\
   vous acceptez ces conditions. Si vous n'êtes pas d'accord avec elles, \
   n'utilisez pas le service. \n\nDernière mise à jour : ${lastUpdate}`;
  
  const descriptionWithDateWithBreaks = description.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>  
  ));

    const descriptionEnBref = "Imperion gère une faction Discord liée à Roblox : grades, XP,\n\
     médailles, sanctions et enrôlement.\n\
     Vous devez avoir un compte Discord et Roblox valides pour utiliser le service.\n\
     Un usage abusif (manipulation d'XP, usurpation, contournement de sanction) peut entraîner une exclusion.\n\
     Les sanctions (blacklist, strike, verrouillage) sont journalisées même si elles sont retirées.\n\
     Le service dépend de Discord, Roblox, Aiven.io et Render.com — des interruptions peuvent survenir."

    const descriptionEnBrefWithBreaks = descriptionEnBref.split('\n').map((line, index) => (
      <React.Fragment key={index}>

        <li>
          <span className={style.tosDot}></span>
          <span>{line}</span>
        </li>
        <br />
      </React.Fragment>  
    ));

  


  const regle : { [key: number]: Rule } = {
    1 : {name : "Le Service",
    description : "Imperion est un bot Discord conçu pour gérer une communauté organisée en faction.\n\
     Il permet de lier un compte Discord à un compte Roblox, mais aussi de gérer un système interne\
     de grades (basés sur des rôles Discord), d'XP, de médailles, d'enrôlement et de sanctions.\n\
     Concrètement, le bot peut : attribuer ou retirer des rôles Discord selon la progression\
     d'un membre, enregistrer des promotions et démotions, gérer des périodes d'inactivité,\
     appliquer des blacklists ou des verrouillages de grade, et journaliser toutes ces actions\
     à des fins de traçabilité et de modération.\n\n\
     Quand le mot service est utilisé dans ce document, il désigne l'ensemble de ces\
     fonctionnalités, la base de données associée, et toute interface éventuelle liée au bot."
    },
    2 : {name : "Qui peut l'utiliser",
    description : "Vous devez disposer d'un compte Discord valide et, lorsque le bot le demande, \
    d'un compte Roblox réellement associé à vous.\n Si vous êtes trop jeune pour accepter seul \
    ce type de conditions selon la loi de votre pays, vous devez utiliser le service avec l'accord d'un \
    parent ou d'un représentant légal."
    },
    3 : {name : "Quelles données sont utilisées",
    description : "Pour fonctionner, le service a besoin de quelques informations techniques et \
     d'identification. Il ne collecte que ce qui est utile à la liaison entre Discord et \
     Roblox ou à l'affichage correct de certaines commandes.",
    information : {
      1 : {
        type : 1,
        name : "Identifiant Discord",
        description : "Utilisé pour reconnaître l'utilisateur, lier son profil, \
        gérer certains rôles comme les grades ou pouvoir utiliser les dashboards (En developpement)."
      },
      2 : {
        type : 1,
        name : "Identifiant Roblox",
        description : "Utilisé pour faire la correspondance entre le compte Discord et le \
       compte Roblox indiqué.\n Il est recupere via l'API Roblox apres une verification.",
      },
      3 : {
        type : 1,
        name : "Photo de profil Roblox",
        description : "Utilisée pour afficher visuellement le compte Roblox concerné \
        dans certaines réponses du bot notamment le profil de l'utilisateur."
      },
      4 : {
        type : 2,
        name : "Important",
        description : "Ces conditions expliquent le cadre d'utilisation du service. \
        Les détails plus complets sur la base légale, la durée de conservation exacte, \
        vos droits RGPD et les demandes d'effacement doivent figurer aussi \
        dans une politique de confidentialité séparée."
      }
    }
    },
    4 : {name : "Ce que vous pouvez faire",
    description : "Vous pouvez utiliser le service dans le cadre prévu par les\
     règles de la faction et les commandes disponibles :\n\
      \n\
    - lier votre compte Discord à votre compte Roblox \n\
    - consulter votre progression, vos grades et vos médailles via les commandes du bot \n\
    - soumettre une demande d'enrôlement ou de départ dans les formes prévues \n\
    - demander la mise à jour ou la suppression de vos données quand cela est possible.\n\
    Toute utilisation reste soumise aux règles internes de la faction et aux décisions des modérateurs.",
    },
    5 : {name : "Ce qui est interdit",
    description : "Les comportements suivants sont interdits :\n\n\
      - fournir de fausses informations lors de la liaison de vos comptes ou d'une demande d'enrôlement\n\
      - tenter de manipuler le système d'XP, de grades ou de médailles de quelque manière que ce soit\n\
      - usurper l'identité d'un autre membre pour obtenir un rôle, une médaille ou éviter une sanction\n\
      - essayer de contourner une blacklist, un verrouillage de grade ou toute autre mesure de modération\n\
      - utiliser le bot pour spammer, perturber un serveur, ou extraire massivement des données\n\
      - exploiter le service d'une façon qui viole les règles de Discord, de Roblox, ou la loi applicable.\n\
      En clair : si l'utilisation nuit au service, à ses membres ou à l'intégrité du système, elle peut être sanctionnée.",
    },
    6 : {name : "Conservation et suppression",
      description : "Les données sont conservées aussi longtemps que cela est nécessaire au fonctionnement du bot\
      , à la gestion des liaisons entre comptes, à la sécurité, ou à la prévention des abus.\n\n\
    Vous pouvez demander la suppression de vos données via les moyens de contact prévus à la fin du document.\
    Nous ferons le nécessaire dans un délai raisonnable, sauf obligation légale contraire ou besoin \
    légitime de conservation limité."
    },
    7 : {name : "Services tiers", 
      description : "Le service dépend de services externes pour fonctionner, notamment :\n\n\
      - Discord et Roblox pour les APIs utilisées par le bot\n\
      - Aiven.io pour l'hébergement de la base de données\n\
      - Render.com pour l'exécution du code du bot\n\
      Si l'un de ces services tombe en panne, change ses conditions, ou coupe l'accès,\n\
       le service peut être affecté ou interrompu sans préavis. Nous ne sommes pas responsables\
      des interruptions causées par ces prestataires.",
    information : {
      1 : {
        type : 2,
        name : "Important",
        description : "Le service n'est en aucun cas affilié à Discord ou Roblox"
      }
    }
    },
    8 : {
      name : "Disponibilité et évolution",
      description : "Le service peut évoluer à tout moment : nouvelles commandes, changement de fonctionnement,\
       retrait de fonctionnalités, maintenance, ou arrêt partiel ou complet.\n\
      Nous essayons de garder le service fiable, mais nous ne garantissons pas une \
      disponibilité continue, sans erreur ni interruption.\n\
      La disponibilité du service dépend également des infrastructures tierces (Aiven.io, Render.com),\
      sur lesquelles nous n'avons pas de contrôle total."
    },
    9 : {name : "Suspension et fin d'accès",
      description : "Le service dispose d'un système de sanctions intégré. Les modérateurs\
      peuvent appliquer les mesures suivantes :\n\n\
      - Blacklist : exclusion totale du service et de la faction, avec conservation d'un log\
       justificatif\n\
      - Verrouillage de grade : blocage temporaire ou permanent de la progression d'un membre\n\
      - Strike / avertissement : sanction enregistrée dans les logs de modération avec une raison\
       et une date.\n\
      Toute sanction est journalisée (type, raison, modérateur, date) et conservée à des\
       fins de traçabilité, même si elle est ultérieurement retirée. Cette conservation\
       repose sur notre intérêt légitime à prévenir les abus.\n\
      Si vous estimez qu'une sanction vous a été appliquée de façon injustifiée,\
     vous pouvez en faire la demande de révision via le système de tickets ou les moyens\
     de contact indiqués au §12.\n\
     Vous pouvez aussi cesser d'utiliser Imperion à tout moment. Les logs vous concernant\
     resteront cependant conservés pour les raisons indiquées ci-dessus."
    },
    10 : {
      name : "Responsabilité et garanties",
      description : "Le service est fourni tel quel. Cela signifie que nous ne promettons \
      pas qu'il sera toujours disponible, toujours exact, ou parfaitement adapté à \
      tous les usages imaginables.\n\
      Dans la mesure autorisée par la loi, nous ne pourrons pas être tenus responsables des \
      dommages indirects, pertes de données, pertes de profits, ou conséquences liées à une \
      indisponibilité du service, à une erreur technique, ou à une dépendance envers un service tiers."
    },
    11 : {
      name : "Droit applicable",
      description : "Sauf règle impérative contraire, ces conditions sont régies par le droit français. \
       En cas de litige, les juridictions françaises compétentes pourront être saisies."},
    12 : {
      name : "Contact",
      description : "Pour toute question sur ces conditions, une demande de suppression, \
      ou une réclamation liée à vos données, vous pouvez nous contacter ici :",
      information : {
      1 : {
        type : 3,
        name : "Contact principal",
        description : "Pseudo ou nom : gigachad_11102 (Warnohe)\n\
        E-mail : imperion.bot@gmail.com\n\
        Serveur Discord de support : https://discord.gg/c5eAtFyuQP"
      }
      }

    }
  }

  
  ; 


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
        <section className={style.tosButSection}>
          <div className={style.tosSummaryMenu}>
               <h3>Sommaire</h3>
               <div className={style.tosSummaryMenuList}>{SummaryMenu(regle)}</div>
          </div>
          <div className={style.tosContent}>
            <>{HTMLRegles(regle)}</>
            <p className={style.tosFooter}>Et surtout, merci de nous soutenir !</p>
          </div>
        </section>
      </main>
      
    </div>
  );
}

export default Tos;