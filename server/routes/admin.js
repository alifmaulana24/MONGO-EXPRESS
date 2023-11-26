const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

const adminLayouts = "../views/layouts/admin";
const jwtsecret = process.env.JWT_SECRET;

const authMiddle = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.json({ message: "unauthorize" });
  }
  try {
    const decoded = jwt.verify(token, jwtsecret);
    next();
  } catch (error) {
    res.status(500).json({ message: "unauthorize" });
  }
};

// GET method

router.get("/admin", async (req, res) => {
  try {
    res.render("admin/index", { layout: adminLayouts });
  } catch (error) {
    console.log(error);
  }
});

// POST method

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const isPassValid = bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return res.status(402).json({ message: "invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtsecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/dashboard", authMiddle, async (req, res) => {
  try {
    const data = await Post.find();
    res.render("admin/dashboard", { data, layout: adminLayouts });
  } catch (error) {
    console.log(error);
  }
});

router.get("/add-post", authMiddle, async (req, res) => {
  try {
    res.render("admin/add-post", { layout: adminLayouts });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-post", authMiddle, async (req, res) => {
  try {
    try {
      const { title, body } = req.body;

      const newPost = new Post({
        title: title,
        body: body,
      });
      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});


router.get("/edit-post/:id", authMiddle, async (req, res) => {
  try {
    const post = await Post.findOne({_id : req.params.id})
    res.render("admin/edit-post", { layout: adminLayouts, post });
    
  } catch (error) {
    console.log(error);
  }
});


router.put("/edit-post/:id", authMiddle, async (req, res) => {
  try {
    const {title, body} = req.body
    
    await Post.findByIdAndUpdate(req.params.id, {
      title : title,
      body : body,
      updatedAt : Date.now()
    })

    res.redirect(`/edit-post/${req.params.id}`)


  } catch (error) {
    console.log(error);
  }
});


router.delete("/delete-post/:id", authMiddle, async (req, res) => {
  try {
    await Post.deleteOne({_id : req.params.id})
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error)
  }
})

// router.post("/admin", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (username === "alif" && password === "ganteng") {
//       res.send("selamat datang tuan");
//     } else {
//       res.send("kesalahan username or password");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPass });
      res.status(202).json("user created", user);
    } catch (error) {
      if (error.code === 11000) {
        res.status(404).json({ message: "user already in use" });
      }
      res.status(500).json({ message: "internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});


router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin')
})

module.exports = router;
