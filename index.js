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
app.get("/chi-tiet-khach-hang",function (req,res) {
    var dienthoai = req.query.dienthoai;
    var txt_sql = "select * from KhachHang where DienThoai like '"+dienthoai+"'";
    sql.query(txt_sql,function (err,rows) {
        if(err) res.send("Khong co khach hang nao ca");
        else{
            if(rows.recordset.length > 0){
                var kh = rows.recordset[0];
                var txt_sql2 = "select * from DonHang where DienThoai like '"+dienthoai+"'";
                sql.query(txt_sql2,function (err2,rows2) {
                    if(err2) res.send("Khong co khach hang nao ca");
                    else {
                        res.render("chitietkhachhang",{
                            kh:kh,
                            dsdh:rows2.recordset
                        })
                    }
                })
            }else {
                res.send("Khong co khach hang nao ca");
            }
        }
    })
});
// chi tiet don hang
app.get("/chi-tiet-don-hang-old",function (req,res) {
    var ms = req.query.maso;
    var txt_sql = "select A.*,B.Ten,B.DiaChi from DonHang A left join KhachHang B on" +
        " B.DienThoai = A.DienThoai where A.MaSo = "+ms;
    sql.query(txt_sql,function (err,rows) {
       if(err) res.send("KHong co don hang nao ca");
       else{
           var ds = rows.recordset;
           if(ds.length>0){
               var dh = ds[0];
               var txt_sql2 = "select B.Ten,B.MoTa,B.DonVi,B.Gia,A.SoLuong,A.ThanhTien" +
                   " from DonHangHangHoa A " +
                   "inner join HangHoa B on A.HHId = B.Id where A.MaSoDH = "+ms;
               sql.query(txt_sql2,function (err2,rows2) {
                    if(err2)   res.send("KHong co don hang nao ca");
                    else{
                        res.render("chitietdonhang",{
                            dh:dh,
                            ds:rows2.recordset
                        })
                    }
               })  ;
           }else{
               res.send("KHong co don hang nao ca");
           }
       }
    });
});

// lam theo async await
app.get("/chi-tiet-don-hang",async function (req,res) {
    var ms = req.query.maso;
    var txt_sql = "select A.*,B.Ten,B.DiaChi from DonHang A left join KhachHang B on" +
        " B.DienThoai = A.DienThoai where A.MaSo = "+ms;
    try {
        var kq1 = await sql.query(txt_sql);
        var dh = kq1.recordset[0];
        var txt_sql2 = "select B.Ten,B.MoTa,B.DonVi,B.Gia,A.SoLuong,A.ThanhTien" +
            " from DonHangHangHoa A " +
            "inner join HangHoa B on A.HHId = B.Id where A.MaSoDH = "+ms;
        var kq2 = await sql.query(txt_sql2);
        res.render("chitietdonhang",{
            dh:dh,
            ds:kq2.recordset
        })
    }catch (e) {
        res.send("KHong co don hang nao ca");
    }

})