const express = require("express");
const app = express();

// start hosting nodejs port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT,function () {
    console.log("server is running....");
});
// ket noi db de lam viec voi du lieu
const mssql = require("mssql");
const config = {
    server:"118.70.125.210",
    user:"sa",
    password:"z@GH7ytQ",
    database:"QuangHoa"
};
mssql.connect(config,function (err) {
    if(err) console.log(err);
    else console.log("ket noi DB thanh cong!");
});
// tao 1 bien de lam viec voi db
const sql = new mssql.Request();
// tao 1 routing
app.get("/",function (req,res) {
    var txt_sql = "select * from KhachHang;" +
        "select * from DonHang;select * from HangHoa;";
    sql.query(txt_sql,function (err,rows) {
        if(err){
            res.render("home",{
               dskh:[],
               dsdh:[],
               dshh:[]
            })
        }else{
            res.render("home",{
                dskh:rows.recordsets[0],
                dsdh:rows.recordsets[1],
                dshh:rows.recordsets[2],
            })
        }
    })
    //res.send("xin chao");
});
// khai bao web se dung view engine la ejs
app.set("view engine","ejs");
// cap quyen truy cap cac file static trong public
app.use(express.static("public"));
// tao 1 routing chuyen dua ra danh sach khach hang
app.get("/danh-sach-khach-hang",function (req,res) {
   var ds = [];
   var txt_sql = "select * from KhachHang";
   sql.query(txt_sql,function (err,rows) {
        if(err) ds = ["Khong co khach hang nao ca"];
        else ds = rows.recordset;
        res.render("danhsachkhachhang",{
            ds:ds
        });
   });
   // res.send(ds);
});
// tao 1 routing chuyen dua ra danh sach hang hoa
app.get("/danh-sach-hang-hoa",function (req,res) {
    var ds = [];
    var txt_sql = "select * from HangHoa";
    sql.query(txt_sql,function (err,rows) {
        if(err) ds = ["Khong co hang hoa nao ca"];
        else ds = rows.recordset;
        res.send(ds);
    });
    // res.send(ds);
});
// tao 1 routing chuyen dua ra danh sach hang hoa
app.get("/tim-kiem-hang-hoa",function (req,res) {
    var thamsoxyz = req.query.tentimkiem;
    if(thamsoxyz == undefined){
        res.render("timkiem",{ds:[]});
    }else{
        var ds = [];
        var txt_sql = "select * from HangHoa where Ten like N'%"+
            thamsoxyz+"%' OR MoTa like N'%"+thamsoxyz+"%'";
        sql.query(txt_sql,function (err,rows) {
            if(err) ds = ["Khong co hang hoa nao ca"];
            else ds = rows.recordset;
            res.render("timkiem",{
                ds:ds
            });
        });
    }
});
