const expressSession = require('express-session');
const path = require("node:path");
const bcrypt = require('bcrypt');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const { Pool } = require("pg");
const membersRouter = require("./routes/fileRouter")
const bodyParser = require('body-parser');
const assetsPath = path.join(__dirname, "public");
const app = express();
const prisma = new PrismaClient()
// Middleware to parse JSON bodies  
app.use(bodyParser.json());
app.use(express.static(assetsPath));

// Middleware to parse URL-encoded bodies  
app.use(bodyParser.urlencoded({ extended: true }));


const connectionString = process.env.CONNECTION_STRING
const pool = new Pool({
    connectionString,
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(
    expressSession({
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        },
        secret: 'a santa at nasa',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000, // ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            },
        ),
    }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use("/", membersRouter);

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const rows = await prisma.user.findUnique({
                where: {
                    username: username
                }
            })
            const user = rows;
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" })
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const rows = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        const user = rows;
        done(null, user);
    } catch (err) {
        done(err);
    }
});
app.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureMessage: "Incorrect password or username"
    })
);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));