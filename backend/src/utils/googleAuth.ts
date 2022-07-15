import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { config } from 'dotenv';

config();

passport.use(
    new GoogleStrategy.Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        (_accessToken:any, _refreshToken:any, profile:any, done:any) => {
            done(undefined, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done) => {
    done(null, obj);
});