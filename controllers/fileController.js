const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require("express-validator");
const fs = require('fs');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const bcrypt = require('bcrypt');
const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

cloudinary.config({
    cloud_name: 'dmaipmbiv',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});





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
        if (user) {
            throw new Error('Username already in use');
        }
    })
]

exports.filesGet = async (req, res) => {
    const folders = await prisma.folder.findMany();
    res.render('index', { user: req.user, folder: folders, messages: req.session.messages });
    req.session.messages = [];
};

exports.membersSignUpGet = (req, res) => {
    res.render('sign-up-form');
};

exports.membersSignUpPost = [
    validatePassword,
    validateUsername,

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up-form", {
                title: "Create movie",
                errors: errors.array(),
            });
        }

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
            res.render("index");

        });
    }]



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

    const file = await prisma.file.findMany({
        where: {
            folderId: i
        }
    })
    res.render('folders', { folder, files: file, user: req.user });
};

exports.membersLogOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

exports.uploadFilePost = [
    upload.single('myfile'),
    async (req, res) => {
        const i = Number(req.params.i);

        (async function () {
            const results = await cloudinary.uploader.upload(`./uploads/${req.file.originalname}`).catch((error) => {
                console.log(error)
            });
            console.log(results)
            const url = cloudinary.url(results.public_id, {
                transformation: [
                    {
                        quality: 'auto',
                        fetch_format: 'auto'
                    },

                    {
                        width: 1200,
                        height: 1200,
                        crop: 'fill',
                        gravity: 'auto'
                    }
                ]
            })
            console.log(url)
            await prisma.file.create({
                data: {
                    fileString: results.url,
                    publicId: results.public_id,
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    folderId: i
                }
            })
        })();

        res.redirect(i)
    }
]


exports.foldersUpdateGet = async (req, res) => {
    const i = Number(req.params.i);

    const folder = await prisma.folder.findUnique({
        where: {
            id: i,
        }
    })
    res.render('updateFolders', { folder })
}

exports.foldersUpdatePost = async (req, res) => {
    const i = Number(req.params.i);

    await prisma.folder.update({
        where: {
            id: i,
        },
        data: {
            folderName: req.body.myfolder,
        }
    })
    res.redirect("/")
}

exports.folderDeletePost = async (req, res) => {
    const i = Number(req.params.i);

    const file = await prisma.file.findMany({
        where: {
            folderId: i,
        },
    })

    file.forEach((f) => {
        cloudinary.api.delete_resources(f.publicId)
    }
    );

    file.forEach((f) =>
        fs.unlink(`./uploads/${f.fileName}`, (err) => {
            if (err) {
                console.error(`Error removing file: ${err}`)
                return;
            }
        })
    )

    await prisma.file.deleteMany({
        where: {
            folderId: i,
        },
    })

    await prisma.folder.deleteMany({
        where: {
            id: i,
        },
    });

    res.redirect("/")
}


exports.fileGet = async (req, res) => {
    const i = Number(req.params.i);

    const files = await prisma.file.findUnique({
        where: {
            id: i,
        },
    })
    res.render('files', { files, user: req.user });
}

exports.fileDeleteGet = async (req, res) => {
    const i = Number(req.params.i);

    const file = await prisma.file.findUnique({
        where: {
            id: i,
        },
    })



    res.render('deleteFile', { files: file, user: req.user })
}

exports.fileDeletePost = async (req, res) => {
    const i = Number(req.params.i);

    const file = await prisma.file.findUnique({
        where: {
            id: i,
        },
    })

    cloudinary.uploader.destroy(file.publicId)

    await prisma.file.delete({
        where: {
            id: i,
        },
    })

    fs.unlink(`./uploads/${file.fileName}`, (err) => {
        if (err) {
            console.error(`Error removing file: ${err}`)
            return;
        }
    });

    res.redirect(`/folders/${file.folderId}`)
}

async function main() {


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
