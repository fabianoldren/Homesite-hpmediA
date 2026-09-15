// HP Media — portefølje-data
//
// Legg til et nytt prosjekt ved å legge til et nytt objekt i arrayet under.
// Kortet, filtreringen og modal-visningen genereres automatisk av
// js/main.js — du trenger ikke røre HTML eller CSS for å legge inn nye
// case-studies.
//
// Felter:
//   id            unik streng, brukes internt
//   title         prosjekttittel
//   category      en av: "bedrift" | "bilshow" | "drifting" | "festival"
//   categoryLabel norsk visningsnavn for kategorien
//   summary       kort tekst vist på kortet i grid-visningen
//   description   lengre tekst vist i modal/detaljvisning
//   type          "video" eller "galleri" — styrer hva som vises i modalen
//   embedUrl      (kun type "video") full embed-URL fra YouTube/Vimeo, f.eks.
//                 "https://www.youtube.com/embed/VIDEO_ID" eller en
//                 Vimeo/Instagram Reels embed-URL. Sett til null inntil
//                 ekte opptak er klippet og lastet opp — da vises en
//                 plassholder i stedet for en tom spiller.
//   images        (kun type "galleri") liste med bildestier, f.eks.
//                 ["images/portfolio/bedrift-1/01.jpg", ...]. Tom liste
//                 viser plassholder-ruter i riktig antall/oppsett.

window.HP_PORTFOLIO = [
  {
    id: "bedrift-produktlansering",
    title: "Produktlansering — Bedriftsfilm",
    category: "bedrift",
    categoryLabel: "Bedriftskunde",
    summary: "Konsept og produksjon av lanseringsfilm for en bedriftskunde.",
    description:
      "Full produksjon av en kort merkevare-/lanseringsfilm: forarbeid, filming over to dager og ferdig klipp tilpasset både nettside og sosiale medier.",
    type: "video",
    embedUrl: null // TODO: sett inn YouTube/Vimeo-embed når filmen er klar
  },
  {
    id: "bilshow-helg-recap",
    title: "Bilshow-helg — Recap",
    category: "bilshow",
    categoryLabel: "Bilshow",
    summary: "Highlight-video fra en helg med bilshow og utstillere.",
    description:
      "Sammendragsfilm fra en bilshow-helg — stemning, biler og publikum klippet til et tempofylt recap for arrangørens sosiale medier.",
    type: "video",
    embedUrl: null // TODO: sett inn YouTube/Vimeo-embed når filmen er klar
  },
  {
    id: "drift-days-banefilm",
    title: "Drift Days — Banefilm",
    category: "drifting",
    categoryLabel: "Drifting",
    summary: "Actionfylt banefilm fra en drifting-treningsdag.",
    description:
      "Filming fra bane og pit under en drifting-treningsdag, med fokus på fart, røyk og lyd — klippet til en kort actionfilm.",
    type: "video",
    embedUrl: null // TODO: sett inn YouTube/Vimeo-embed når filmen er klar
  },
  {
    id: "sommerfestival-aftermovie",
    title: "Sommerfestival — Aftermovie",
    category: "festival",
    categoryLabel: "Festival",
    summary: "Offisiell aftermovie fra en flerdagers sommerfestival.",
    description:
      "Aftermovie som oppsummerer en flerdagers festival — scene, publikum og stemning satt til musikk, laget for gjenbruk i markedsføring neste sesong.",
    type: "video",
    embedUrl: null // TODO: sett inn YouTube/Vimeo-embed når filmen er klar
  },
  {
    id: "bedrift-sosiale-medier-kampanje",
    title: "Kundecase — Sosiale medier-kampanje",
    category: "bedrift",
    categoryLabel: "Bedriftskunde",
    summary: "Bildeserie og korte klipp produsert for en løpende kampanje.",
    description:
      "Løpende leveranse av foto og korte videoklipp til en bedriftskundes sosiale medier-kanaler, tilpasset et fast innholdshjul gjennom sesongen.",
    type: "galleri",
    images: [] // TODO: legg til bildestier når ekte bilder er klare
  },
  {
    id: "bilshow-custom-car-meet",
    title: "Custom Car Meet — Fotoserie",
    category: "bilshow",
    categoryLabel: "Bilshow",
    summary: "Fotoserie fra et custom car-treff med detaljbilder av bilene.",
    description:
      "Fotoserie fra et custom car-treff — detaljbilder, hel-bilder og stemningsbilder fra utstillingsområdet, levert som galleri til arrangøren.",
    type: "galleri",
    images: [] // TODO: legg til bildestier når ekte bilder er klare
  }
];
