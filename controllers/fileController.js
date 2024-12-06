const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

exports.filesGet = async (req, res) => {
    res.render('index', { user: req.user });
};

exports.membersSignUpGet = (req, res) => {
    res.render('sign-up-form');
};


exports.membersSignUpPost = (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
            return next(err);
        }
        currentUser = req.body.username;
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: hashedPassword,
            }
        })
        res.render('index');
    });
}




async function main() {
    // const result = await prisma.$queryRaw`SELECT * FROM User`
    /* const user = await prisma.user.create({
        data: {
          email: 'jj@gmail.com',
        },
      }); */

}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
