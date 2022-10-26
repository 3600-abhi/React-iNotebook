const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// jb ek step back krna ho to double dot lgate hain ("../middleware/fetchuser")
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "@abhi";

// ROUTE-1 Create a user using : POST "/api/auth/createuser". (NO Login required)
// ----> This endpoint will return the authToken if user try to create account with valid details
router.post(
  "/createuser",

  // validation ke liye jo bhi likhna hai usko hum es array me likh denge
  // ye validation hmne (Express-validator) ka use krke kiya h

  [
    body("name", "Please enter your name").isLength({ min: 1 }),
    body("email", "Email is Invalid").isEmail(),
    body("password", "Password should be minimum of 6 characters").isLength({
      min: 5,
    })
  ],

  async (req, res) => {
    // If there are errors, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false,  errors: errors.array() });
    }

    // Find the user in the database with the entered email of the client
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({success: false, error: "sorry, user with same email already exists" });
    }

    try {

      // encrypting the password using (bcrypt.js) module
      let salt = await bcrypt.genSalt(10);
      let encryptedPassword = await bcrypt.hash(req.body.password, salt);

      // The create() function is a thin wrapper around the save() function. The above create() call is equivalent to:
      // Line-1 -----> const doc = new User({ email: 'bill@microsoft.com' });
      // Line-2----> await doc.save();
      // Jo uper likhe dono lines krte hain wo akele create() function kr deta hai
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword,
      });


      // hum yahan pr (jwt nodejs) web token ka use kr rhe hain auth token generate krne ke liye
      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({success: true, authToken });


    } catch (error) {
      res.status(500).send({success: true, message: "Internal server occur !!!"});
    }
  }
);

// ROUTE-2 : Authenticate the user : POST "/api/auth/login". (NO Login required)
// -----> This endpoint will return the authToken if login credentials is valid
router.post(
  "/login",

  // validation ke liye jo bhi likhna hai usko hum es array me likh denge ........
  // ye validation hmne (Express-validator) ka use krke kiya h .............

  [
    body("email", "Email is invalid").isEmail(),

    // exists() function btayega ki password blank hai ya nhi
    body("password", "Please enter the password").exists(),
  ],

  async (req, res) => {
    // if there are errors, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, errors: errors.array() });
    }

    // ise (destructuring) bolte hain mtlb (req.body) ke andar jo email aur password naam ke properties hain unke corresponding values aa jayegi
    const { email, password } = req.body;

    try {

      // destructuring
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({success: false, error: "please try to login with correct credentials" });
      }

      // jo password db me pada hua hai wo hashed password hai to us hashed password ko
      // agr uset dwara entered password se compare krna hai to (bcrypt.compare()) fn ka use krte hain
      const comparePassword = await bcrypt.compare(password, user.password);


      // agr password mismatch hota hai to yhin terminate kr denge
      if (!comparePassword) {
        return res
          .status(400)
          .json({success: false, error: "Incorrect Password !!" });
      }

      // email aur password dono shi hain to (payload) send kro
      const data = { user: { id: user.id } };

      // hum yahan pr (jwt nodejs) web token ka use kr rhe hain auth token generate krne ke liye
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({success: true, authToken });
    } catch (error) {
      res.status(500).send({success: false, message: "Internal server error !!"});
    }
  }
);

// ROUTE-3 : Get Loggedin user details using Post "api/auth/getuser". (Login required)
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server occur !!!");
  }
});

module.exports = router;
