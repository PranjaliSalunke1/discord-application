const { scores } = require("../dummy_data/scores");

async function addPoints(score) {
  const data = scores.map((_sc) => {
    if (_sc.name === score.name) {
      _sc.score += score.score;
      if (score.late_streak) {
        _sc.late_streak = score.late_streak;
      }
      if (score.punctuality_streak) {
        _sc.punctuality_streak = score.punctuality_streak;
      }
    }
    return _sc;
  });

  return "SUCCESS";
}

module.exports = { addPoints };
