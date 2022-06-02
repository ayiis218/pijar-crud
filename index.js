var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 8080;

var mysql = require('mysql');
var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database:"pijarcamp"
});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(bodyParser.json());
var server =  app.listen(port, () => {
  console.info('listening on %d', port);
})

app.use(bodyParser.urlencoded({
  extended: true
}))

app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.get('/', function (req, res) {
	let s = "SELECT * FROM produk";
	let query = db.query(s, (err, results)=>{
		var data = {
			data:results
		}
		res.render(__dirname+"/public/read.html", data);
	});
});

app.get('/insert', function (req, res) {
	res.render(__dirname+"/public/insert.html");
});

app.get('/update', function (req, res) {
	let s = "SELECT * FROM produk WHERE nama_produk='"+req.query.i+"'";
	let query = db.query(s, (err, results)=>{
		var data = {
			data:results[0]
		}
		res.render(__dirname+"/public/update.html", data);
	});

});

app.post("/tambah", function (req, res) {
    let data = {nama_produk: req.body.nama_produk, keterangan: req.body.keterangan, harga:req.body.harga, jumlah:req.body.jumlah};
    let sql = "INSERT INTO produk SET ?";
    let query = db.query(sql, data,(err, results) => {
       if (err) {
       		res.send({result:"error"});
       }else{
       		res.redirect("/");
       }
    });
});

app.get("/hapus", function (req, res) {
	 let sql = "DELETE FROM produk WHERE nama_produk='"+req.query.i+"'";
    let query = db.query(sql, (err, results) => {
       if (err) {
       		res.send({result:"error"});
       }else{
       		res.redirect("/");
       }
    });
});

app.post("/update", function (req, res) {
	let data = {nama_produk: req.body.nama_produk, keterangan: req.body.keterangan, harga:req.body.harga, jumlah:req.body.jumlah};
    let sql = "UPDATE produk SET ? WHERE nama_produk='"+req.query.i+"'";
    let query = db.query(sql, data,(err, results) => {
       if (err) {
       		console.log("error");
       		res.send({result:"error"});
       }else{
       		console.log("success");
       		res.redirect("/");
       }
    });
})