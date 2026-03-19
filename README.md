# Frontend – Bokinformation och användarrecensioner (React + JWT)

Detta projekt är frontend-delen av en applikation som hanterar bokinformation och tillhörande anvndarrecensioner. 
Applikationen är byggd med React och kommunicerar med ett separat backend-API samt Google Books API. 
Alla besökare kan läsa information om alla böcker, men endast en inloggade användare kan skapa, uppdatera och ta bort sina egna recensioner.

Frontend-applikationen använder JWT för autentisering och skyddar administrativa vyer genom att kontrollera om en giltig token finns lagrad.

---

## Funktionalitet

Applikationen innehåller följande funktioner:

- Publik startsida som beskriver vad sidan är till för
- Dynamsiak routes för sökresultat av böcker utifrån sökord
- Dynamiska routes för enskild information om utvald bok
- Inloggningssystem med JWT-token
- Skyddad administrationssida
- Möjlighet att:
  - Skapa nya recensioner
  - Redigera befintliga recensioner
  - Ta bort recensioner

---

## Teknikstack

- **React**
- **TypeScript**
- **React Router**
- **Fetch API**
- **JWT (hantering via localStorage)**

---

## Installation

Installera beroenden:
```bash
npm install
```

Starta utvecklingsservern:
```bash
npm run dev
```

Frontend körs som standard på:
```
http://localhost:5173
```

Backend-API måste vara igång på:
```
http://localhost:3000
```

## Routing

Applikationen använder React Router och innehåller minst följande sidor:

/search – Lista över alla böcker som hämtas från Google Books API utifrån sökord (publik, dynamisk route)

/book/:id – Enskild information om utvald bok (publik, dynamisk route)

/login – Inloggningssida (publik)

/register - Formulär för att skapa ny användare (publik)

/admin – Administrationssida (skyddad)

## Autentisering

Vid inloggning skickas användarnamn och lösenord till backend:
```json
{
  "username": "anglajuliusson",
  "password": "password"
}
```

Vid korrekt inloggning returneras en JWT-token som sparas i:
```
localStorage
```

Token skickas sedan med i skyddade anrop via header:
```
Authorization: Bearer <token>
```

Om ingen giltig token finns omdirigeras användaren från /admin till /login.

## Skyddade vyer

Administrationssidan är skyddad och kräver giltig JWT-token. Där kan administratören:

Redigera befintliga recensioner

Ta bort recensioner

Under /books/:id - Lägga till nya recensioner

Logga ut (token tas bort från localStorage)
