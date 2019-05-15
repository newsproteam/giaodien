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

    /* host: "localhost",
     user: "root",
     password: "",
     database: "news_data",
     port: "3307"*/
});

con.connect();
//---------------------------------------------------------
app.get("/", function(req, res) {
    var sql = "select * from bongda where hot='YY' " +
        "union select * from kinhdoanh where hot='YY' " +
        "union select * from hitech where hot='YY' " +
        "union select * from thitruong where hot='YY' " +
        "union select * from showbiz where hot='YY' " +
        "union select * from suckhoe where hot='YY' " +
        "union select * from phaidep where hot='YY'  " +
        "union select * from amthuc where hot='YY' " +
        "union select * from thegioi where hot='YY' ";
    con.query(sql, function(error, results, fields) {
        if (error) throw error;
        else {
            res.render('home2', { results }); //results la
        }
    });
});
app.post('/', urlencodedParser, function(req, res) {
    var word = req.body.word;
    word = word.toLowerCase();
    var sql = "select name,time,author,image1,image2,type1,type,id from bongda " +
        "union select name,time,author,image1,image2,type1,type,id from kinhdoanh " +
        "union select name,time,author,image1,image2,type1,type,id from thitruong " +
        "union select name,time,author,image1,image2,type1,type,id from suckhoe " +
        "union select name,time,author,image1,image2,type1,type,id from hitech " +
        "union select name,time,author,image1,image2,type1,type,id from showbiz " +
        "union select name,time,author,image1,image2,type1,type,id from thegioi " +
        "union select name,time,author,image1,image2,type1,type,id from thethao " +
        "union select name,time,author,image1,image2,type1,type,id from phaidep " +
        "union select name,time,author,image1,image2,type1,type,id from amthuc ";
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
    var phone = req.body.phone;
    var feedback = req.body.feedback;
    //câu lệnh chèn
    var sql = "insert into gopy(name,address,phone,feedback) values(N'" + name + "',N'" + address + "',N'" + phone + "',N'" + feedback + "')";
    con.query(sql, function(error, results, fields) {
        if (error) throw error;
        else {
            console.log(sql);
            res.render('feedback_result');
        }
    });
});

// Giao Diện giới thiệu
app.get('/gioithieu', function(req, res) {
    res.render('GiaoDienGioiThieu');
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
            sql = "select * from bongda where hot='YY' union select * from bongda where hot='Y' ";
            break;
        case "kinhdoanh":
            sql = "select * from kinhdoanh where hot='YY' union select * from kinhdoanh where hot='Y' ";
            break;
        case "thitruong":
            sql = "select * from thitruong where hot='YY' union select * from thitruong where hot='Y' ";
            break;
        case "suckhoe":
            sql = "select * from suckhoe where hot='YY' union select * from suckhoe where hot='Y' ";
            break;
        case "hitech":
            sql = "select * from hitech where hot='YY' union select * from hitech where hot='Y' ";
            break;
        case "showbiz":
            sql = "select * from showbiz where hot='YY' union select * from showbiz where hot='Y' ";
            break;
        case "thegioi":
            sql = "select * from thegioi where hot='YY' union select * from thegioi where hot='Y' ";
            break;
        case "thethao":
            sql = "select * from thethao where hot='YY' union select * from thethao where hot='Y' ";
            break;
        case "phaidep":
            sql = "select * from phaidep where hot='YY' union select * from phaidep where hot='Y' ";
            break;
        case "amthuc":
            sql = "select * from amthuc where hot='YY' union select * from amthuc where hot='Y' ";
            break;
    }
    if (sql == "auto") res.redirect('/')
    else
        con.query(sql, function(error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                res.render('GiaoDienChuDe', { results });
            }
        });
});
//doc bai bao--------------------------------------------------
app.get('/:type/:id', function(req, res) {
    var x = req.params.id;
    var y = req.params.type;
    if (y == "bongda" || y == "kinhdoanh" || y == "thitruong" || y == "suckhoe" || y == "hitech" ||
        y == "showbiz" || y == "thegioi" || y == "thethao" || y == "phaidep" || y == "amthuc") {
        var sql = "select * from " + y + " where id=" + x +
            " union select * from " + y + " where hot='YY' or hot='Y' ";

        con.query(sql, function(error, results, fields) {
            if (error) throw error;
            else {
                res.render('GiaoDienBaiViet', { results });
            }
        });
    } else res.redirect('/')
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