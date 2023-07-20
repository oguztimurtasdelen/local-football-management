const connection = require('../../functions/database').connectDatabase();

function getWeeklyMatchProgram(req, res, next) {
  var weeklyMatchProgramList;
  var message;
  var seasonId = req.params.seasonid;

  connection.query(
    "select * from view_admin_weeklymatchprogram where seasonid = ?",
    [
      seasonId
    ],
    (error, result) => {
      if (!error) {
        weeklyMatchProgramList = result;
      } else {
        message = error.sqlMessage;
        weeklyMatchProgramList = [];
      }

      res.status(200).json({
        error: !!error,
        message: message || 'Weekly Match Program fetched successfully!',
        weeklyMatchProgramList: weeklyMatchProgramList
      });
    });
}


function createWeeklyMatchProgram(req, res, next) {
  const weeklyMatchProgramInfo = req.body;
  var message;
  var weeklyMatchProgramId;

  connection.query(
    "insert into weeklymatchprogram(createdat, createdby, updatedat, updatedby, seasonid, begindate, enddate, isactive) values (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      weeklyMatchProgramInfo.createdAt,
      weeklyMatchProgramInfo.createdBy,
      weeklyMatchProgramInfo.updatedAt,
      weeklyMatchProgramInfo.updatedBy,
      weeklyMatchProgramInfo.seasonId,
      weeklyMatchProgramInfo.beginDate,
      weeklyMatchProgramInfo.endDate,
      weeklyMatchProgramInfo.isActive,
    ],
    (error, result) => {
      if (!error) {
        weeklyMatchProgramId = result.insertId;
      } else {
        message = error.sqlMessage;
      }

      res.status(200).json({
        error: !!error,
        message: message || 'Weekly Match Program added successfully!',
        weeklyMatchProgramId: weeklyMatchProgramId
      });
    });
}


function updateWeeklyMatchProgram(req, res, next) {
  const weeklyMatchProgramInfo = req.body;
  var message;
  var seasonId = req.params.seasonid;
  var weeklyMatchProgramId = req.params.id;

  connection.query(
    "update weeklymatchprogram set createdat = ?, createdby = ?, updatedat = ?, updatedby = ?, seasonid = ?, begindate = ?, enddate = ?, isactive = ?  where id = ? and seasonid = ?",
    [
      weeklyMatchProgramInfo.createdAt,
      weeklyMatchProgramInfo.createdBy,
      weeklyMatchProgramInfo.updatedAt,
      weeklyMatchProgramInfo.updatedBy,
      weeklyMatchProgramInfo.seasonId,
      weeklyMatchProgramInfo.beginDate,
      weeklyMatchProgramInfo.endDate,
      weeklyMatchProgramInfo.isActive,
      weeklyMatchProgramId || weeklyMatchProgramInfo.id,
      seasonId ||weeklyMatchProgramInfo.seasonId
    ],
    (error, result) => {
      if (!error) {

      } else {
        message = error.sqlMessage;
      }

      res.status(200).json({
        error: !!error,
        message: message || 'Weekly Match Program updated successfully!',
      });
    });
}


function deleteWeeklyMatchProgram(req, res, next) {
  var seasonId = req.params.seasonid;
  var weeklyMatchProgramId = req.params.id;
  var message;

  connection.query(
    "delete from weeklymatchprogram where id = ? and seasonid = ?",
    [
      weeklyMatchProgramId,
      seasonId
    ],
    (error, result) => {
      if (!error) {

      } else {
        message = error.sqlMessage;
      }
      res.status(200).json({
        error: !!error,
        message: message || 'Weekly Match Program deleted successfully!',
      });
  });
}


exports.getWeeklyMatchProgram = getWeeklyMatchProgram;
exports.createWeeklyMatchProgram = createWeeklyMatchProgram;
exports.updateWeeklyMatchProgram = updateWeeklyMatchProgram;
exports.deleteWeeklyMatchProgram = deleteWeeklyMatchProgram;
