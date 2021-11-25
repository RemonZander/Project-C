# Project-C

Database
.env:
Een .env file is om ervoor te zorgen dat we daarin onze environment details kunnen meegeven (denk aan db wachtwoord etc).
Omdat de .env file vooral sensitive data bevat in meeste gevallen wordt er een .env.example meegegeven die je dan zelf kan kopieren en je eigen data erin kan invullen.

Om gebruik te maken van de test database verander de APP_ENV waarde naar local.
Om de productie script te draaien verander APP_ENV naar production. (Dit gaan we niet vaak gebruiken dus dit kan je voor nu vergeten)

Dit process geldt ook voor de client kant alleen zijn er andere properties en waardes.

Commands (Server):

- npm run db-test: Run de database script.
- npm run db-prod: Run de database script in een productie connectie (via een server).
- npm run start: Run de server die de http requests ontvangt voor de database.
