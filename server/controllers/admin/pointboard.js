const connection = require('../../functions/database').connectDatabase();

function getPointBoard(req, res, next) {
  const groupstageId = req.params.groupstageid;
  const matchWeek = req.params.matchweek;
  var pointBoard;
  var message;

  connection.query(
    "SELECT t.id as teamId, t.officialname AS teamName, t.logoimage AS teamLogo, coalesce(sum(case when f.matchstatus in ('PLAYED', 'BYFORFEIT') then 1 else 0 end), 0) as matchPlayed, coalesce(sum(CASE WHEN f.hometeamid = t.id THEN CASE WHEN f.hometeamscore > f.awayteamscore THEN 1 END ELSE CASE WHEN f.hometeamscore < f.awayteamscore THEN 1 END END), 0) AS matchWin, coalesce(sum(CASE WHEN f.hometeamid = t.id THEN CASE WHEN f.hometeamscore = f.awayteamscore THEN 1 END ELSE CASE WHEN f.hometeamscore = f.awayteamscore THEN 1 END END), 0) AS matchDraw, coalesce(sum(CASE WHEN f.hometeamid = t.id THEN CASE WHEN f.hometeamscore < f.awayteamscore THEN 1 END ELSE CASE WHEN f.hometeamscore > f.awayteamscore THEN 1 END END), 0) AS matchLose, coalesce(sum(CASE WHEN f.hometeamid = t.id THEN f.hometeamscore ELSE f.awayteamscore END), 0) AS goalScored, coalesce(sum(CASE WHEN f.hometeamid = t.id THEN f.awayteamscore ELSE f.hometeamscore END), 0) AS goalConceded, coalesce(sum(CASE WHEN f.hometeamid = t.id THEN f.hometeamscore ELSE f.awayteamscore END) - sum(CASE WHEN f.hometeamid = t.id THEN f.awayteamscore ELSE f.hometeamscore END), 0) as goalAverage, coalesce(sum(CASE WHEN f.hometeamid = t.id THEN f.hometeampoint ELSE f.awayteampoint END), 0) AS pointTotal FROM fixtures f JOIN teams t ON t.id = f.hometeamid OR t.id = f.awayteamid WHERE f.groupstageid = ? AND f.matchweek <= ? GROUP BY t.id ORDER BY pointTotal DESC, goalAverage DESC, goalScored DESC, teamName",
    [
      groupstageId,
      matchWeek
    ],
    (error, result) => {
      if (!error) {
        pointBoard = result;
      } else {
        message = error.sqlMessage;
        pointBoard = [];
      }

      res.status(200).json({
        error: !!error,
        message: message || 'Point Board fetched successfully!',
        pointBoard: pointBoard
      });
    }
  );
}

function getLastMatchWeek(req, res, next) {
  const groupstageId = req.params.groupstageid;
  var matchWeek;
  var message;

  connection.query(
    "select max(matchweek) as matchWeek from view_fixtures where groupstageid = ? and matchstatus = 'PLAYED'",
    [groupstageId],
    (error, result) => {
      if (!error) {
        matchWeek = result[0].matchWeek;
      } else {
        message = error.sqlMessage;
        matchWeek = null;
      }

      res.status(200).json({
        error: !!error,
        message: message || 'Last Match Week fetched successfully!',
        matchWeek: matchWeek
      });
    }

  );
}


exports.getPointBoard = getPointBoard;
