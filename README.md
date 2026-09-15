# HP Media — nettside

Statisk portefølje-/markedsføringsnettside for HP Media (video, foto,
sosiale medier og markedsføring for arrangementer, bilshow og
bedriftskunder). Bygget som ren HTML/CSS/JS — ingen build-steg, rask å
laste, enkel å hoste hvor som helst (GitHub Pages, Netlify, Vercel osv.).

## Struktur

```
index.html        Alt markup, seksjon for seksjon
css/style.css      Alle stiler (design-tokens øverst i filen)
js/main.js         Nav, scroll-header, scroll-reveal-animasjoner
images/placeholder Plassholder-mapper for bilder/video — se README der
```

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
- [ ] Tjenester
- [ ] Portefølje / case-studies
- [ ] Kunder / samarbeidspartnere
- [ ] Kontakt
- [ ] Footer
