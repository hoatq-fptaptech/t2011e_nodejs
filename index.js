const express = require("express");// goi module express de su dung
const app = express(); // xay nha - tao dich vu host
const port = process.env.PORT || 5000; // bao rang dich vu se su dung port 5000

// tao web
app.listen(port,function () {
    console.log("Server running...");
});
app.use(express.static("public")); // cho phep cac file tinh (css, img, js frontend)
// tim 1 nhan vien de hoi cai minh can -- routing

// tao routing cho trang chu
app.get("/",function (req,res) {
    res.send("<h1>Xin chao cac ban</h1>");
});

// them 1 routing moi
app.get("/bong-da",function (req,res) {
    res.sendFile(__dirname+"/public/demo_layout.html");
})
// __dirname -> tim ra duong dan tuyet doi den ma nguon trong may chu
app.get("/bong-da/ronaldo",function (req,res) {
    res.sendFile(__dirname+"/public/demo_layout.html");
})