const connection = require('../../functions/database.js').connectDatabase();

function getAboutContent(req, res, next) {
  var aboutContent;
  var message;
  connection.query(
    "select * from view_aboutiaskf", (error, result) => {
      if (!error) {
        aboutContent = result[0];
      }
      else {
        message = error.sqlMessage;
      }

      res.status(200).json({
        error: !!error,
        message: message || 'About Content fetched successfully!',
        aboutContent: aboutContent
      });
    });
}

function updateAboutContent(req, res, next) {
  const aboutContent = req.body;
  var message;
  connection.query(
    "update aboutiaskf set abouttext = ?, address = ?, phonenumber = ?, faxnumber = ?, email = ?, longitude = ?, latitude = ?, updatedat = ?, updatedby = ?",
    [
      aboutContent.aboutText, 
      aboutContent.address, 
      aboutContent.phoneNumber, 
      aboutContent.faxNumber, 
      aboutContent.email, 
      aboutContent.longitude, 
      aboutContent.latitude,
      aboutContent.updatedAt,
      aboutContent.updatedBy
    ],
    (error, result) => {
      if (!error) {
        console.log(result);
      } else {
        message = error.sqlMessage;
      }
      res.status(200).json({
        error: !!error,
        message: message || 'About Content updated successfully!'
      });
  });

}

exports.getAboutContent = getAboutContent;
exports.updateAboutContent = updateAboutContent;
