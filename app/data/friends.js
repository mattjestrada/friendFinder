var mysql = require("mysql");

var connection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "friends_db"
});

function getFriends() {

    return query("SELECT * FROM friends")
        .then(function(results) {
            if (results) {
                return results;
            } else {
                return false;
            }
        });
}

function compareFriends(friend) {

    var bestMatch;
    var answers = friend.scores.split(",");

    var numAnswers = answers.length;

    return query("SELECT * FROM friends")
        .then(function(results) {

            if (results) {

                console.log("Compare Friends MySQL Results: ", results);
                var friends = results;

                var matchFound = false;

                var bestDifference = 0;

                bestMatch = friends[0];

                for (var i = 0; i < friends.length; i++) {

                    var difference = 0;

                    for (var j = 0; j < numAnswers; j++) {

                        difference += Math.abs(answers[j] - friends[i].friend_results.split(",")[j]);

                    }

                    if (!matchFound) {

                        bestDifference = difference;

                        bestMatch = friends[i];

                        matchFound = true;

                    } else {

                        if (difference < bestDifference) {

                            bestDifference = difference;

                            bestMatch = friends[i];
                        }
                    }
                }

                return query("INSERT INTO friends SET ?", [{
                        friend_name: friend.name,
                        friend_image: friend.photo,
                        friend_results: friend.scores
                    }])
                    .then(function() {

                        return bestMatch;

                    });

            } else {
                return false;
            }
        });
}

module.exports.getFriends = getFriends;
module.exports.compareFriends = compareFriends;