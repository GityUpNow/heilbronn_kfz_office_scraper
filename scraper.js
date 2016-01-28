var request = require('request');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('data.sqlite');
db.exec("CREATE TABLE IF NOT EXISTS KFZ(visitors INT, wait INT, nextcall INT, lastupdate DATE PRIMARY KEY)");

request('http://www.landkreis-heilbronn.de/zulassung/kfz.json', function (error, response, html) {
    if (!error && response.statusCode == 200) {

        var data;

        async.series([function (callback) {
            data = JSON.parse(html);
            callback();
        }], function (err) {
            var statement = db.prepare("INSERT INTO KFZ VALUES (?, ?, ?, ?)");
            statement.run(data[0].visitors, data[0].wait, data[0].nextcall, data[0].lastupdate);
        });
    }

})