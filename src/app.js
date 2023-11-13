const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();
const fs = require("fs")
const bcrypt = require("bcryptjs");
const session = require("express-session");
const multer = require("multer");
const port = process.env.PORT || 3000

require('dotenv').config();

require("./db/conn");
const Register = require("./models/adminReg");
const question = require("./models/adminQues");


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);
app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.get("/", async(req, res) => {

    const user = await question.find();
    req.session.user = user
    // console.log(user[1].title)
    res.render("index",{user:req.session.user});
})
app.get("/admin", (req, res) => {
    res.render("admin");
})

app.get("/login", (req, res) => {
    res.render("login");
})


// const upload = multer({dest:"uploads/"})  // middleware


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("ansImage"), async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.file);
        // return res.redirect("/")
        // console.log(path.join(__dirname,"../uploads");

        const registerQues = new question({
            title: req.body.title,
            ques: req.body.questionText,
            ans: req.body.answer,
            Image: {
                data: fs.readFileSync(path.join(__dirname , '../uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            url: req.body.url,
            subject: req.body.subject,
            topic: req.body.topic
        })

        await registerQues.save();
        res.status(201).render("index");
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post("/mylogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, useremail.password);
        // console.log(isMatch)
        if (isMatch) {
            req.session.user = useremail
            res.status(201).render("admin", { curr_user: req.session.user });
        }
        else {
            res.send("Invalid Credentials");
        }
    }
    catch (err) {
        res.status(400).send("Invalid Login Credentials");
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Listening to the Port ${process.env.PORT}`);
})

