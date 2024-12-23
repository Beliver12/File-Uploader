const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require("express-validator");

const bcrypt = require('bcrypt');
const multer = require("multer")
const upload = multer({ dest: 'uploads/' })
const prisma = new PrismaClient();

const passwordErr = "Passwords dont match!"

const validatePassword = [
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage(`${passwordErr}`)
]

const validateUsername = [
    body('username').custom(async value => {
        const user = await prisma.user.findUnique({
            where: {
                username: value,
            }
        })
        if (user.rows.length > 0) {
            throw new Error('Username already in use');
        }
    })
]

exports.filesGet = async (req, res) => {
    const folders = await prisma.folder.findMany();
    res.render('index', { user: req.user, folder: folders, messages: req.session.messages });
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
            },
        });
        res.render('index');
    });
};

exports.folderCreatePost = async (req, res) => {
    await prisma.folder.create({
        data: {
            folderName: req.body.myfolder,
            userId: req.user.id
        }
    });
    const folders = await prisma.folder.findMany();
    res.render('index', { user: req.user, folder: folders });
};

exports.foldersGet = async (req, res) => {
    const i = Number(req.params.i);
    const folder = await prisma.folder.findUnique({
        where: {
            id: i,
        },
    });
    res.render('folders', { folder });
};

exports.membersLogOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

exports.uploadFilePost = async (req, res) => {
    upload.single('myfile')
    await prisma.file.create({
        data: {
            fileName: req.file
        }
    })
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
