const Beer = require("../models/Beer");
const fs = require("fs");

exports.create = async (req, res) => {
  const { filename } = req.file;
  const {
    beerName,
    beerPrice,
    beerAlcoholPercentage,
    beerColor,
    beerType,
    beerCompany,
  } = req.body;

  try {
    let beer = new Beer();

    beer.fileName = filename;
    beer.name = beerName;
    beer.price = beerPrice;
    beer.alcoholPercentage = beerAlcoholPercentage;
    beer.color = beerColor;
    beer.type = beerType;
    beer.company = beerCompany;

    await beer.save();

    res.json({
      successMessage: `${beerName} was created!`,
      beer,
    });
  } catch (err) {
    console.log(err, "beerController.create error");
    console.log(
      beerName,
      beerPrice,
      beerAlcoholPercentage,
      beerColor,
      beerType,
      beerCompany
    );
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.readAll = async (req, res) => {
  try {
    const beers = await Beer.find({});

    res.status(200).json({
      beers,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.read = async (req, res) => {
  try {
    const beerId = req.params.beerId;
    const beer = await Beer.findById(beerId);

    res.json(beer);
  } catch (err) {
    console.log(err, "beerController.read error");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.update = async (req, res) => {
  const beerId = req.params.beerId;

  const oldBeer = await Beer.findByIdAndUpdate(beerId, req.body);

  res.json({
    successMessage: "Beer successfully updated",
  });
};

exports.delete = async (req, res) => {
  try {
    const beerId = req.params.beerId;
    const deletedBeer = await Beer.findByIdAndDelete(beerId);

    fs.unlink(`uploads/${deletedBeer.fileName}`, (err) => {
      if (err) throw err;
      console.log(
        "Image successfully deleted from filesystem: ",
        deletedBeer.fileName
      );
    });

    res.json(deletedBeer);
  } catch (err) {
    console.log(err, "beerController.delete error");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};


// --------------------------------------------

exports.filterByCompany = async (req, res) => {
  try {
    const companyName = req.params.companyFilterName;
    console.log("dobia si ovo za companyName -> ", companyName);
    // const beers = await Beer.find({});
    const beers = await Beer.find({ "company": { _id: companyName } });
    const filteredBeers = [];

    beers.forEach(b => {
      if (b.company == companyName) {
        filteredBeers.push(b);
      }
    })

    console.log("Filtrirana piva su: ", filteredBeers);

    res.status(200).json({
      beers
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};