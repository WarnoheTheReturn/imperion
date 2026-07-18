

import style from './TOS.module.css'
import {HTMLRegles,SummaryMenu} from './TOS.tsx'
import React from 'react'
function PP() {
    const lastUpdate = "29 Mai 2026";

    const description = `Ce document decrit quelles informations le service collecte, pourquoi il en a besoin, \
    combien de temps il les conserve, et ce que vous pouvez faire si vous souhaitez les modifier \
    ou les supprimer.\n\n Dernière mise à jour : ${lastUpdate}`;

    const enBref = 'Imperion collecte uniquement ce qui est nécessaire : \
    ID Discord, ID Roblox, date d\'enrôlement, ID du recruteur et statut de sanction.\n\
     Vos données ne sont ni vendues, ni partagées à des fins commerciales.\n\
     Les logs de modération sont conservés jusqu\'à 3 ans, même si une sanction est retirée.\n\
     Vous pouvez demander l\'accès, la correction ou la suppression de vos données à tout moment — sauf pour les logs de sanction.'


    const EnBrefWithBreaks = enBref.split('\n').map((line, index) => (
      <React.Fragment key={index}>

        <li>
          <span className={style.tosDot}></span>
          <span>{line}</span>
        </li>
        <br />
      </React.Fragment>  
    ));

    const descriptionWithBreak = description.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))

    const regle = {
    1 : {name : "Qui est responsable du traitement",
    description : "Le responsable du traitement des donnees collectees par MonBot est gigachad_11102 (Warnohe),\
     developpeur du bot, joignable a l'adresse indiquee a la fin de ce document.\n\
    Cela signifie que c'est cette personne qui decide pourquoi et comment vos donnees \
     sont traitees, et qui est legalement responsable de leur bonne gestion."
    },
    2 : {name : "Ce que le service collecte",
    description : "Lors de la liaison ou de l'utilisation du bot, les informations\
     suivantes sont collectees et stockees :",
     information : {
      1 : {
        type : 1,
        name : "Identifiant Discord (User ID)",
        description : "Collecte automatiquement via l'API Discord quand vous rejoinez le serveur\
         ou interagissez avec le bot. Il permet de vous identifier de maniere unique sans stocker votre nom\
         d'utilisateur, qui peut changer."
      },
      2 : {
        type : 1,
        name : "Identifiant Roblox (User ID)",
        description : "Fourni par vous lors de la liaison de votre compte via OAuth de Roblox.\
         Il sert a faire le lien entre votre identite Discord et votre identite Roblox.",
      },
      3 : {
        type : 1,
        name : "Photo de profil Roblox",
        description : "L'URL de votre avatar Roblox est recuperee via l'API publique de Roblox.\
         à chaque commande concernée. Elle est utilisee uniquement pour l'affichage dans les \
         commandes du bot —  n'est pas stockée en base de données."
      },
      4 : {
        type : 1,
        name : "Identifiant Discord du recruteur",
        description : "L'ID Discord du membre qui vous a recruté est enregistré au moment de \
        l'enrôlement. C'est la donnée personnelle d'un autre utilisateur, stockée en lien avec votre propre profil."
          
      },
      5 : {
        type : 1,
        name : "Date d'enrôlement",
        description : "La date à laquelle vous avez rejoint la faction est enregistrée.\
         C'est une donnée temporelle liée à votre identité."
      },
      6 : {
        type : 1,
        name : "Statut de sanction",
        description : "Si vous faites l'objet d'une sanction (blacklist, strike, verrouillage de grade),\
         un enregistrement est créé dans les logs de modération (logs_info). Ce log contient le type de sanction,\
          la raison fournie par le modérateur, la date, et l'identifiant du modérateur ayant agi. Cette donnée\
           est différente des données de profil : elle est conservée même si la sanction est ultérieurement retirée.",
      },
      7 : {
        type : 2,
        name : "",
        description : "Le service ne collecte pas de mot de passe, d'adresse e-mail, de numero\
         de telephone, de localisation ou de toute autre donnee sensible."
      }
     }
    },
    3 : {name : "Pourquoi ces donnees sont collectees",
    description : "Chaque donnee a une finalite precise et limitee :\
     \n\
     - Lier les comptes Discord et Roblox — c'est la fonction principale du bot ; sans ces\
     identifiants, elle est impossible.\
     \n\
     - Attribuer des roles ou verifier l'appartenance a un groupe Roblox sur un serveur Discord.\
     \n\
     - Afficher des informations de profil dans les reponses du bot (commandes de presentation, lookup, etc.).\
     \n\
     - Prevenir les abus et les tentatives de contournement des verifications.\
     \n\
     - Tracer le recrutement — ID discord du recruteur, date d'enrôlement, \
     et lien du ticket d'enrôlement permettent de savoir qui a rejoint la faction, quand, \
     et par quel biais, pour assurer la traçabilité des enrôlements.\n\
      \
     - Gérer les sanctions et la modération — les logs de modération permettent de justifier\
      toute décision disciplinaire, de traiter les contestations, et de prévenir les abus récurrents.\n\
     - Envoyer les notifications dans les bons salons — le service stocke les associations entre \
     types d'événements et salons Discord pour que le bot puisse poster les messages au bon endroit.\n\
     - Ces donnees ne sont pas utilisees a des fins publicitaires, analytiques de masse ou commerciales\
      d'aucune sorte.",
    
    },
    4 : {name : "Base legale du traitement",
    description : "Au sens du RGPD, le traitement de vos donnees repose sur les bases legales suivantes :\n\n\
    - Consentement (Art. 6.1.a) — vous initiez volontairement la liaison de votre compte et l'utilisation du bot.\n\
    - Execution d'un service (Art. 6.1.b) — le traitement est necessaire pour que le bot fonctionne comme prevu.\n\
    - Interet legitime (Art. 6.1.f) — pour certains traitements lies a la securite et a la prevention des abus.\n\
    - Les logs de modération reposent sur la base légale de l'intérêt légitime (Art. 6.1.f), et non\
     sur le consentement. Un utilisateur sanctionné ne consent pas à l'enregistrement de la sanction — celle-ci\
     est journalisée pour permettre la traçabilité, la prévention des abus, et le traitement des contestations.\
     Cet intérêt légitime prévaut sur le droit à l'effacement dans ce cas précis. \n\
    - La donnée du recruteur concerne un tiers. Elle est collectée sur la base de l'exécution du\
     service (Art. 6.1.b) : sans cette donnée, le suivi du recrutement est impossible. Le recruteur, en recrutant\
     un membre, accepte implicitement que son identifiant soit associé à ce membre.",
    },
    5 : {name : "Partage des donnees",
    description : "Vos donnees ne sont pas vendues et ne sont pas partagees avec des tiers a des\
     fins commerciales ou publicitaires.\n\
     Dans certains cas limites, des donnees peuvent etre accessibles a :\n\n\
     - Les administrateurs du serveur Discord ou le bot est actif, dans les limites prevues par la \
     configuration du bot.\n\
     - Les modérateurs du serveur ont accès aux logs de modération vous concernant , ce qui inclut\
     les raisons et types de sanctions.\n\
     - Les recruteurs sont associés à l'identifiant du membre qu'ils ont recruté —\
     leur ID est visible des administrateurs.\n\
     - Certaines actions du bot sont postées dans des salons Discord configurés via logs_log_channel.\
     Si votre grade ou statut change, cela peut être affiché dans un salon visible d'autres membres du serveur.\n\
     - Les APIs tiers (Discord, Roblox) sollicitees par le bot pour recuperer des informations — \
     ces services ont leurs propres politiques de confidentialite.\n\
     - Aiven.io — hébergement de la base de données (région EU)\n\
     - Render.com — hébergement et exécution du code du bot (serveurs USA, transfert couvert par \
     les clauses contractuelles types ou le Data Privacy Framework). Le recours à Render.com implique \
     un transfert de données vers les États-Unis. Ce transfert est encadré par les clauses contractuelles \
     types approuvées par la Commission européenne.",
    information : {
      1 : {
        type : 2,
        name : "Pas d'affiliation",
        description : "Le service n'est pas officiel et n'est affilie ni a Discord Inc.\
        , ni a Roblox Corporation."
      }

    }
    },
    6 : {name : "Duree de conservation",
      description : "Les donnees sont conservees aussi longtemps que votre liaison est active. En pratique :\n\n\
      - Données de profil : conservées tant que votre compte est actif dans la base de données.\
       Supprimées sur demande, sauf si des logs de sanction justifient leur maintien.\n\
      - Logs de modération : conservés plus longtemps que les données de profil,\
     y compris si la sanction a été retirée ou annulée. La raison : ils servent à justifier\
     les décisions passées et à prévenir les abus futurs. Les logs de modération sont conservés\
      jusqu'a 3 ans après la dernière action les concernant, puis supprimés sur demande\
      (automatiquement dans une prochaine version).\n\
      - Autres logs (XP, promotion, médaille, inactivité) : données internes au bot, sans valeur\
     identifiante directe. Conservées selon les besoins de fonctionnement du service."
    },
    7 : {name : "Securite des donnees", 
      description : "Des mesures techniques raisonnables sont mises en place pour proteger vos donnees contre\
      les acces non autorises, la perte ou la divulgation : acces restreint a la base de donnees, serveurs\
      securises, aucun stockage de donnees inutiles.\n\
      Aucun systeme n'est infaillible. En cas de violation susceptible d'affecter vos droits et libertes, \
      vous en serez informe dans les delais prevus par la reglementation.",
    },
    8 : {
      name : "Vos droits RGPD",
      description : "En tant que resident de l'Union europeenne, vous disposez des droits suivants. \
      Pour les exercer, contactez-nous via les moyens indiques a la section 11.",
      information : {
      1 : {
        type : 5,
        name : "Droit d'acces",
        description : "Obtenir une copie des donnees que nous detenons sur vous."
      },
      2 : {
        type : 5,
        name : "Droit de rectification",
        description : "Faire corriger des donnees inexactes ou incompletes."
      },
      3 : {
        type : 5,
        name : "Droit a l'effacement",
        description : "Demander la suppression de vos donnees (droit a l'oubli)"
      },
      4 : {
        type : 5,
        name : "Droit a la portabilite",
        description : "Recevoir vos donnees dans un format lisible et structure."
      },
      5 : {
        type : 5,
        name : "Droit d'opposition",
        description : "Vous opposer a un traitement base sur l'interet legitime."
      },
      6 : {
        type : 5,
        name : "Droit a la limitation",
        description : "Demander que le traitement soit suspendu dans certains cas."
      },
      7 : {
        type : 2,
        name : "",
        description : "Le droit à l'effacement peut être limité pour les logs de modération.\
         Si vous avez fait l'objet d'une sanction, nous pouvons refuser de supprimer le log \
         correspondant si sa conservation est nécessaire pour prévenir un abus futur ou pour justifier\
         une décision passée. Dans ce cas, nous vous informerons du refus et de sa justification.\
         Pour toute autre donnée, le droit à l'effacement s'applique sans restriction."
      },
      8 : {
        type : 4,
        name : "",
        description : "Vous avez egalement le droit de deposer une reclamation aupres de la \
        CNIL si vous estimez que vos donnees ne sont pas traitees correctement — cnil.fr."
      }

    }
    },
    9 : {name : "Mineurs",
      description : "MonBot n'est pas destine aux enfants de moins de 13 ans.\
       Si vous avez connaissance d'un enfant de moins de 13 ans utilisant le service,\
       contactez-nous afin que nous puissions supprimer ses donnees.\n\n\
       Pour les utilisateurs entre 13 et 16 ans, le consentement d'un parent ou tuteur\
       peut etre requis selon la legislation nationale applicable."
    },
    10 : {
      name : "Mises a jour de cette politique",
      description : "Cette politique peut evoluer si le bot gagne de nouvelles fonctionnalites,\
      si la legislation change, ou si notre facon de traiter les donnees evolue. La date en haut\
      du document indique toujours la version en vigueur.\n\
      En cas de modification significative, nous l'annoncerons sur le serveur Discord de support."
    },
    11 : {
      name : "Contact & reclamation",
      description : "Pour toute demande liee a vos donnees personnelles — acces, correction, suppression\
       ou simple question — contactez-nous ici :",
      information : {
        1 : {
            type : 3,
            name : "Contact",
            description : "Responsable : gigachad_11102 (Warnohe)\n\
            E-mail : imperion.bot@gmail.com\n\
            Serveur Discord : https://discord.gg/c5eAtFyuQP"
        },
        2 : {
            type : 4,
            name : "",
            description : "Si vous n'obtenez pas de reponse satisfaisante,\
            vous pouvez adresser une reclamation a la CNIL : cnil.fr/fr/plaintes."
        }
       }
      }
    };
    
    

  



    return (
    <div className={style.tosContainer}>
      <h1>Privacy Policy</h1>
      <main>
        <section className={style.tosTopSection}>
          <div className={style.tosDescription}>
            <h2>Vos donnees, expliques simplement</h2>
            <p>{descriptionWithBreak}</p>
          </div>
          <div className={style.tosSummary}>
            <h2>En bref</h2>
            <ul >
              {EnBrefWithBreaks}
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


export default PP;