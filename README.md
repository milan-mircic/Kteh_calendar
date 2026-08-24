# Activity Planner


## Pokretanje

```bash
# server
cd server
cp .env.example .env   # popuniti kljucevima za googleoauth i za slanje mejlova
npm install
npm run dev             # http://localhost:3000

# client 
cd client
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Structure



```
/client                     # Vite + React + TS
  /public
    /backgrounds            # zamagljena pozadinska slika, po jedna za svaki ekran
    favicon.svg
  /src
    App.tsx                 # tabela ruta
    main.tsx
    api.ts                  # fetch wrapper (kredencijali, ApiError)
    types.ts                # deljeni API tipovi (User, Activity)
    index.css
    /styles
      tokens.css            # boje, tipografska skala, razmaci
    /context
      AuthContext.tsx       # stanje sesije: user, login, logout
    /components
      AppShell.tsx
      ProtectedRoute.tsx
      PageBackground.tsx / PageBackground.module.css
      Button.tsx / Button.module.css
      Input.tsx / Input.module.css
      IconButton.tsx / IconButton.module.css
      BackButton.tsx / BackButton.module.css
      HomeButton.tsx / HomeButton.module.css
      TopBar.tsx / TopBar.module.css             # pozdrav + sat 
      AccountDropdown.tsx / AccountDropdown.module.css
      DateHeading.tsx / DateHeading.module.css
      Quote.tsx / Quote.module.css
      Calendar.tsx / Calendar.module.css         
      ActivitiesList.tsx / ActivitiesList.module.css  # aktivnosti za danas
      GoogleIcon.tsx
      PersonIcon.tsx
      SaveIcon.tsx
    /pages
      OpeningPage.tsx / OpeningPage.module.css
      LoginPage.tsx / LoginPage.module.css
      RegisterPage.tsx / RegisterPage.module.css
      ForgotPasswordPage.tsx / ForgotPasswordPage.module.css
      ResetPasswordPage.tsx / ResetPasswordPage.module.css
      HomePage.tsx / HomePage.module.css
      ActivityDetailPage.tsx / ActivityDetailPage.module.css
      ActivityFormPage.tsx / ActivityFormPage.module.css    # dodavanje + izmena
      AccountPage.tsx / AccountPage.module.css
      AccountEditPage.tsx / AccountEditPage.module.css
      AccountAvatarPage.tsx / AccountAvatarPage.module.css
    /lib
      calendar.ts            
      date.ts                # formatiranje datuma/vremena
      quote.ts               # preuzimanje citata, kesirano po sesiji
      avatar.ts              # resava URL otpremljene profilne slike

/server                     # Express + TS
  /data                     # app.db + /uploads (u .gitignore)
  /src
    index.ts                # pokrece server
    app.ts                  # CORS, staticki /uploads, ruteri, middleware
    schema.sql              # users, activities, password_resets
    types.ts                # deljeni API tipovi (User, Activity)
    /lib
      db.ts                 # konekcija ka SQLite bazi
      auth.ts                # JWT potpisivanje/verifikacija + cookie helper
      googleAuth.ts           # Passport Google strategija
      email.ts                # nodemailer wrapper za mejlove o resetovanju lozinke
      passwordResets.ts       # kreiranje/validacija/trosenje tokena za reset lozinke
      users.ts
      activities.ts
      avatarUpload.ts         # multer - cuvanje profilnih slika na disku
    /routes
      health.ts
      auth.ts                 # registracija, prijava, google oauth, reset lozinke
      activities.ts           # CRUD rute za aktivnosti
      account.ts              # azuriranje naloga + avatar
      quote.ts                # prosledjuje ZenQuotes API
    /middleware
      auth.ts                 # authMiddleware - postavlja req.user
      errorHandler.ts
```
