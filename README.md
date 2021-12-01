# Project-C

## IMPORTANT
Voor de backend is node versie 16.10.0 minimaal nodig.
Het beste is om 16.10.0 te installeren sinds dat al is getest.

Om je versie te bekijken open een cmd en type in "node -v"

Je kan de bijbehorende node versie vinden in de link hieronder.
https://nodejs.org/de/blog/release/v16.10.0/

## Stap voor stap opzet van omgeving.
De applicatie is ingedeeld in de client (frontend) en de server (backend).
Je moet de 2 folders als aparte applicaties zien. Dit betekent dat beide folders een package.json bevat met de bijbehorende packages die elk folder gebruikt.

Deze stap voor stap opzet geldt voor beide folders.

1. Open je cmd in de folder waar je in wilt werken
2. Type in "npm ci" om de bijbehorende node_modules te installeren
3. Kopieer de .env.example en hernoem het naar .env (Als het nodig is verander de waardes naar de juiste waardes, dit weet je zelf al of heb je afgesproken met een collega)
4. (Deze stap geldt alleen voor de server folder) Type in je cmd "npm run db-test" om de test database op te zetten. 
5. Type in je cmd "npm run start" om de applicatie te starten

## Database
.env:
Een .env file is om ervoor te zorgen dat we daarin onze environment details kunnen meegeven (denk aan db wachtwoord etc).
Omdat de .env file vooral sensitive data bevat in meeste gevallen wordt er een .env.example meegegeven die je dan zelf kan kopieren en je eigen data erin kan invullen.

Om gebruik te maken van de test database verander de APP_ENV waarde naar local.
Om de productie script te draaien verander APP_ENV naar production. (Dit gaan we niet vaak gebruiken dus dit kan je voor nu vergeten)

Dit process geldt ook voor de client kant alleen zijn er andere properties en waardes.

## Commands (Server):

- npm run db-test: Run de database script.
- npm run db-prod: Run de database script in een productie connectie (via een server).
- npm run start: Run de server die de http requests ontvangt voor de database.
