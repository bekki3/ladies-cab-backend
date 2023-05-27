const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to the server");
})
.catch((err)=>{
    console.log("Error while connecting to the server: ", err);
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
    },
    imageBuf: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
});

const userData = mongoose.model("userData", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server responding to get");
});

app.post("/user", (req, res) => {
    const newUser = req.body;
    userData.findOne({ phoneNumber: newUser.phoneNumber }).then((data) => {
        if (data) {
            console.log("User exists in DB");
            res.send("Phone number is already in use");
        } else {
            new userData(newUser)
                .save()
                .then(() => {
                    console.log("Data saved on DB successfully");
                })
                .catch((err) => {
                    console.log("Error while sending to DB");
                });
            console.log("New user added to DB");
            res.send("Successfully signed in.");
        }
    });
});

app.put("/user", (req, res) => {
    const newUser = req.body;
    userData.updateOne({ phoneNumber: newUser.phoneNumber }, newUser).then(()=>{
        res.send("Updated user data");
    });    
});


let PORT = process.env.PORT;

if (PORT===undefined) {
    PORT = 3000;
}

app.listen(PORT, () => {
    console.log("Server started on port: ", PORT);
});
