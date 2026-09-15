# HP Media — nettside

Statisk portefølje-/markedsføringsnettside for HP Media (video, foto,
sosiale medier og markedsføring for arrangementer, bilshow og
bedriftskunder). Bygget som ren HTML/CSS/JS — ingen build-steg, rask å
laste, enkel å hoste hvor som helst (GitHub Pages, Netlify, Vercel osv.).

## Struktur

```
index.html            Alt markup, seksjon for seksjon
css/style.css          Alle stiler (design-tokens øverst i filen)
js/main.js             Nav, scroll-header, scroll-reveal, portefølje-rendering
js/portfolio-data.js   Data for portefølje-seksjonen — legg nye prosjekter her
images/placeholder     Plassholder-mapper for bilder/video — se README der
```

### Legge til et nytt porteføljeprosjekt

Åpne `js/portfolio-data.js` og legg til et nytt objekt i `HP_PORTFOLIO`-
arrayet. Kort, filter og detaljvisning genereres automatisk — ingen behov
for å røre HTML eller CSS. Se kommentarene øverst i filen for feltene.

## Utvikling

Ingen avhengigheter. Åpne `index.html` direkte i nettleseren, eller kjør
en enkel lokal server, f.eks.:

```
python3 -m http.server 8000
```

## Status

Bygges seksjon for seksjon:

- [x] Prosjektstruktur + hero
- [x] Om HP Media
- [x] Tjenester
- [x] Portefølje / case-studies
- [x] Kunder / samarbeidspartnere
- [x] Kontakt
- [x] Footer

Alle seksjoner fra oppdraget er på plass. Gjenstående arbeid er å bytte
plassholder-innhold (bilder, video, klientlogoer, kontaktinfo, sosiale
lenker) med ekte materiale — se `TODO`-kommentarer i `index.html`,
`js/main.js` og `js/portfolio-data.js`.
