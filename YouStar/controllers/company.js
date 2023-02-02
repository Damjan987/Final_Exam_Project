const Company = require("../models/Company");
const Beer = require("../models/Beer");

exports.create = async (req, res) => {
  const {
    companyName,
    companyCountry,
    companyDescription,
    companyYearOfCreation,
  } = req.body;

  try {
    // const companyExist = await Company.findOne({ company });

    // console.log(companyExist);

    // if (companyExist) {
    //   return res.status(400).json({
    //     errorMessage: `${company} aready exists`,
    //   });
    // }

    let newcompany = new Company();
    newcompany.name = companyName;
    newcompany.country = companyCountry;
    newcompany.description = companyDescription;
    newcompany.yearOfCreation = companyYearOfCreation;

    newcompany = await newcompany.save();

    res.status(200).json({
      successMessage: `${newcompany.name} was created!`,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.readAll = async (req, res) => {
  try {
    const companies = await Company.find({});

    res.status(200).json({
      companies,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.read = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const company = await Company.findById(companyId);

    res.json(company);
  } catch (err) {
    console.log(err, "companyController.read error");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.update = async (req, res) => {
  const companyId = req.params.companyId;

  console.log(req.body);

  const oldCompany = await Company.findByIdAndUpdate(companyId, req.body);

  res.json({
    successMessage: "Company successfully updated",
  });
};

exports.delete = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const beers = await Beer.find({});

    let doesHaveBeerDependency = false;

    beers.forEach((b) => {
      if (b.company == companyId) {
        doesHaveBeerDependency = true;
      }
    });

    if (doesHaveBeerDependency == false) {
      const deletedCompany = await Company.findByIdAndDelete(companyId);
  
      res.json(deletedCompany);
    } else {
      res.json({ successMessage: "Company successfully deleted" });
    }
  } catch (err) {
    console.log(err, "companyController.delete error");
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};
