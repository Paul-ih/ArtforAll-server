const express = require("express");
const router = express.Router();
const Art = require("../models/Art");
const uploadToCloudinaryMiddleware = require("../config/cloudinaryConfig");
//créer config cloudinary

router.get("/", (req, res, next) => {
    console.log("from react");
  
    Art.find()
      .then((ADocuments) => {
        res.json(ADocuments);
      })
      .catch((error) => {
        console.log(error);
      });
  });


// PREFIX FROM APP.JS
// app.use("/api/artworks", artRouter);

router.get("/:id", (req, res, next) => {
  // console.log(req.params)
  Art.findById(req.params.id)
    .then((ArtDocument) => {
      res.status(200).json(ArtDocument)
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/", uploadToCloudinaryMiddleware.single("pictureUrl"), (req, res, next) => {
  let { price, description,title,lng,larg } = req.body;
   let pictureUrl = req.file.path;
  

  let creator = req.session.currentUser 
  console.log(creator)
  //populate?Visit.find({_user:user.toString()}).populate("_streetArt _user")


  const newArt = {
      dimensions: [lng,larg],
      pictureUrl: pictureUrl,
      creator: creator,
      price,
      description,
      title,

  }

  // if (req.file) {
  //   newStreetArt.pictureUrl = req.file.path;
  // }
  Art.create(newArt)
  .then((createdArt) => {
    console.log(createdArt)
    res.status(201).json({ message: "Art created" });
  })
  .catch((error) => {
    next(error);
  });
});

router.patch("/:id", uploadToCloudinaryMiddleware.single("pictureUrl"), (req, res, next) => {
  console.log(req.params);
  console.log(req.body);
  let { price, description,title,lng,larg } = req.body;
  let pictureUrl = req.file.path;
  const updatedArt = {
    dimensions: [lng,larg],
    pictureUrl: pictureUrl,
    price,
    description,
    title,

}
  // if (req.body.name === "" || req.body.brand === "") {
  //   res.status(400).json({ message: "Name or Brand should not be empty" });
  // } else {
    Art.findByIdAndUpdate(req.params.id, updatedArt, { new: true })
      .then((updatedDocument) => {
        
        res.status(200).json(updatedDocument);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  //}
});

router.delete("/:id", (req, res, next) => {
  // let user = req.session.currentUser;
  //  if (req.params.id._user === user) {

  Art.findByIdAndDelete(req.params.id)
  .then((createdArt) => {
    res.status(204).json({ message: "Art deleted" });
  })
  .catch((error) => {
    next(error);
  });

// }
});





module.exports = router;

