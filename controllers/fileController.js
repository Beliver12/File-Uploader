const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

exports.filesGet = async (req, res) => {

    const folders = await prisma.folder.findMany();
    res.render('index', { user: req.user, folder: folders });
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

exports.folderCreatePost = async (req, res) => {
    await prisma.folder.create({
        data: {
            folderName: req.body.myfolder
        }
    })
    const folders = await prisma.folder.findMany();
    res.render('index', { user: req.user, folder: folders });
}

exports.foldersGet = async (req, res) => {
    let i = Number(req.params.i);
    const folder = await prisma.folder.findUnique({
        where: {
            id: i
        }
    })
    res.render('folders', { folder: folder });
}

exports.membersLogOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
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
