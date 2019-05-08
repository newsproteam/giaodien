var express = require("express");
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/views'));
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "db4free.net",
    user: "thanhan1181999",
    password: "77621176211",
    database: "news_data",
    port: "3306"

});
/*

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "news",
    port: "3306"
});
*/
con.connect();
//---------------------------------------------------------
app.get("/", function(req, res) {
    var sql = "select * from bongda where hot='YY' " +
        "union select * from kinhdoanh where hot='YY' " +
        "union select * from thitruong where hot='YY' " +
        "union select * from suckhoe where hot='YY' " +
        "union select * from hitech where hot='YY' " +
        "union select * from showbiz where hot='YY' " +
        "union select * from thegioi where hot='YY' " +
        "union select * from thethao where hot='YY' " +
        "union select * from phaidep where hot='YY' " +
        "union select * from amthuc where hot='YY' ";
    con.query(sql, function(error, results, fields) {
        if (error) throw error;
        else {
            res.render('home', { results });
        }
    });
});
app.post('/', urlencodedParser, function(req, res) {
        var word = req.body.word;
        word = word.toLowerCase();
        var sql = "select * from bongda " +
            "union select * from kinhdoanh " +
            "union select * from thitruong " +
            "union select * from suckhoe " +
            "union select * from hitech " +
            "union select * from showbiz " +
            "union select * from thegioi " +
            "union select * from thethao " +
            "union select * from phaidep " +
            "union select * from amthuc ";
        var pos = [];
        con.query(sql, function(error, results, fields) {
            if (error) throw error;
            else {
                for (var i = 0; i < results.length; i++) {
                    if (results[i].name.toLowerCase().search(word) != -1) {
                        pos.push(results[i]);
                    }
                }
                res.render('ketquatimkiem', { pos });
            }
        })
    })
    //góp ý-------------------------------------------------------
app.get('/feedback', function(req, res) {
    res.render('feedback');
});
app.post('/feedback', urlencodedParser, function(req, res) {
    var name = req.body.name;
    var address = req.body.address;
    var feedback = req.body.feedback;
    //câu lệnh chèn
    var sql = "insert into gopy(name,address,feedback) values(N'" + name + "',N'" + address + "',N'" + feedback + "')";
    con.query(sql, function(error, results, fields) {
        if (error) throw error;
        else {
            res.render('return_result');
        }
    });
});
//trả về kết quả thao tác----
app.get('/return_result', function(req, res) {
    res.render('return_result');
});

//hiện theo chủ đề---------------------------------------------------
app.get('/:type', function(req, res) {
    var x = req.params.type;
    var sql = "auto";
    switch (x) {
        case "bongda":
            sql = "select * from bongda limit 5";
            break;
        case "kinhdoanh":
            sql = "select * from kinhdoanh limit 5";
            break;
        case "thitruong":
            sql = "select * from thitruong limit 5";
            break;
        case "suckhoe":
            sql = "select * from suckhoe limit 5";
            break;
        case "hitech":
            sql = "select * from hitech limit 5";
            break;
        case "showbiz":
            sql = "select * from showbiz limit 5";
            break;
        case "thegioi":
            sql = "select * from thegioi limit 5";
            break;
        case "thethao":
            sql = "select * from thethao limit 5";
            break;
        case "phaidep":
            sql = "select * from phaidep limit 5";
            break;
        case "amthuc":
            sql = "select * from amthuc limit 5";
            break;
    }
    if (sql == "auto") res.redirect('/')
    else
        con.query(sql, function(error, results, fields) {
            if (error) {
                throw error;
            } else {
                res.render('type', { results });
            }
        });
});
//doc bai bao--------------------------------------------------
app.get('/:type/:id', function(req, res) {
    var x = req.params.id;
    var y = req.params.type;
    var sql = "select * from " + y + " where id=" + x +
        " union select * from " + y + " where hot='Y'";

    con.query(sql, function(error, results, fields) {
        if (error) throw error;
        else {
            res.render('MotTrangTin', { results });
        }
    });
});

app.listen(process.env.PORT || 3000);

//-----------------------------------------



/**
 * {
    status: 'connected',
    authResponse: {
        accessToken: '...',
        expiresIn: '...',
        signedRequest: '...',
        userID: '...'
    }
}
 */