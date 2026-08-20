import { randomUUID } from 'crypto';
import passport from 'passport';
import { Strategy as GoogleStrategy, type Profile } from 'passport-google-oauth20';
import { createGoogleUser, getUserByEmail, getUserByGoogleId, linkGoogleAccount } from './users';

// Only register the strategy when credentials are configured, so the app
// still boots in dev without a Google Cloud project set up (§8).
export const googleAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

if (googleAuthEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            done(new Error('Google account has no email'));
            return;
          }

          let user = getUserByGoogleId(profile.id);
          if (!user) {
            user = getUserByEmail(email);
            if (user) {
              linkGoogleAccount(user.id, profile.id);
            } else {
              user = createGoogleUser({
                id: randomUUID(),
                email,
                googleId: profile.id,
                firstName: profile.name?.givenName || profile.displayName || 'there',
                lastName: profile.name?.familyName || '',
              });
            }
          }

          done(null, { id: user.id });
        } catch (err) {
          console.error('[google strategy] verify callback failed:', err);
          done(err as Error);
        }
      },
    ),
  );
}

export { passport };
