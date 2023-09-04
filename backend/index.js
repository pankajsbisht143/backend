const express = require("express");
require("dotenv").config();

const { connection } = require("./config/db");
const { UserModel } = require("./models/User.model")
const {authentication}=require("./middlewares/middleware")
const {blogRouter}=require("./routes/blog.Routes")

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors=require("cors")

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).send("base api route");
})

app.post("/signup", (req, res) => {
    let { name, email, password } = req.body;
    bcrypt.hash(password, 3, async function (err, hash) {
        const new_user = new UserModel({
            name,
            email,
            password: hash
        })
        try {
            await new_user.save();
            res.send({ message: "signUp sucessfully" });
        } catch (err) {
            console.log(err);
            res.status(500).send({ msg: "something went wrong" });
        }
    });
})

app.post("/login", async (req, res) => {
    let { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        res.send({ mesaage: "login first" });
    } else {
        const hash_pass = user.password
        bcrypt.compare(password, hash_pass, function (err, result) {
            if (!result) {
                res.send({ message: "login failed, invalid credentails" });
            } else {
                var token = jwt.sign({ }, process.env.SECRET_KEY);
                res.send({ message: "login sucessfull", token: token });
            }
        });
    }

})

app.use("/blogs",authentication,blogRouter);

app.listen(2000, async () => {
    try {
        await connection;
        console.log("connected to db sucessfully");
    } catch (err) {
        console.log(err);
        console.log("error while connecting to db")
    }
})
