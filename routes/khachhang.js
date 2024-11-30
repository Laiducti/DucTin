const express = require("express");
const router = express.Router();
const khachhang = require("../model/khachhang"); // Model của bảng `khachhang`
const dotenv = require('dotenv');
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConFig");





// 1 Lấy danh sách tất cả khách hàng
router.get("/all", async (req, res) => {
  try {
//token
    const token = req.header("Authorization").split(' ')[1];
    if(token){
      JWT.verify(token, config.SECRETKEY, async function (err, id){
        if(err){
          res.status(403).json({"status": false, message: "Có lỗi xảy ra"});
        }else{
            //xu li api
            const customers = await khachhang.find(); // Lấy tất cả bản ghi trong bảng `khachhang`
            res.json(customers);
        }
      });
    }else{
      res.status(401).json({status: false, message: "Không xác thực"});
    }


  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});

// 2 Lấy thông tin khách hàng theo ID
router.get("/:id", async (req, res) => {
  try {

//token
const token = req.header("Authorization").split(' ')[1];
if(token){
  JWT.verify(token, config.SECRETKEY, async function (err, id){
    if(err){
      res.status(403).json({"status": false, message: "Có lỗi xảy ra"});
    }else{
        //xu li api
        const customer = await khachhang.findById(req.params.id); // Tìm theo ID
        if (customer) {
          res.json(customer);
        } else {
          res.status(404).json({ status: false, message: "Không tìm thấy khách hàng" });
        }
    }
  });
}else{
  res.status(401).json({status: false, message: "Không xác thực"});
}

  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});

// 3 Thêm một khách hàng mới
router.post("/add", async (req, res) => {
  try {

    const token = req.header("Authorization").split(' ')[1];
    if(token){
      JWT.verify(token, config.SECRETKEY, async function (err, id){
        if(err){
          res.status(403).json({"status": false, message: "Có lỗi xảy ra"});
        }else{
            const { TenKhachHang, Email, SoDienThoai, DiaChi } = req.body; // Lấy dữ liệu từ body
            const newCustomer = new khachhang({ TenKhachHang, Email, SoDienThoai, DiaChi });
            await newCustomer.save(); // Lưu khách hàng mới vào database
            res.status(201).json({ status: true, message: "Thêm khách hàng thành công" });
        }
      });
  }} catch (error) {
    res.status(400).json({ status: false, message: "Lỗi khi thêm khách hàng" });
  }
});

//4 Cập nhật thông tin khách hàng theo ID
router.put("/update/:id", async (req, res) => {
  try {
    const { TenKhachHang, Email, SoDienThoai, DiaChi } = req.body; // Dữ liệu cập nhật
    const customer = await KhachHang.findById(req.params.id); // Tìm khách hàng cần cập nhật
    if (customer) {
      customer.TenKhachHang = TenKhachHang || customer.TenKhachHang;
      customer.Email = Email || customer.Email;
      customer.SoDienThoai = SoDienThoai || customer.SoDienThoai;
      customer.DiaChi = DiaChi || customer.DiaChi;
      await customer.save(); // Lưu thay đổi
      res.status(200).json({ status: true, message: "Cập nhật thành công" });
    } else {
      res.status(404).json({ status: false, message: "Không tìm thấy khách hàng" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "Lỗi khi cập nhật khách hàng" });
  }
});

// 5 Xóa một khách hàng theo ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const customer = await khachhang.findByIdAndDelete(req.params.id); // Xóa theo ID
    if (customer) {
      res.status(200).json({ status:true,message:"Xóa khách hàng thành công"});
    } else {
      res.status(404).json({ status:false,message:"Không tìm thấy khách hàng"});
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});

// 6 Lấy danh sách khách hàng có số điện thoại được truyền qua query
router.get("/phone", async (req, res) => {
  try {
    const { SoDienThoai } = req.query; // Lấy số điện thoại từ query
    const customers = await khachhang.find({ SoDienThoai });
    if (customers.length > 0) {
      res.json(customers);
    } else {
      res.status(404).json({ status: false, message: "Không tìm thấy khách hàng" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});

// 7 Lấy danh sách khách hàng không có emasil
router.get("/no-email", async function (req, res) {
    try {
      const list = await khachhang.find({ Email: null });
      res.json(list);
    } catch (error) {
      res.status(500).json({ status: false, message: "Lỗi server" });
    }
  });

// 8 Tìm khách hàng có số điện thoại giống nhau
router.get("/phone/equals", async function (req, res) {
    try {
      const { SoDienThoai } = req.query;
      const list = await khachhang.find({ SoDienThoai });
      if (list.length > 0) {
        res.json(list);
      } else {
        res.status(404).json({ status: false, message: "Không tìm thấy khách hàng" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Lỗi server" });
    }
  });
   // 9 Tìm khách hàng theo tên
router.get("/search-by-name", async (req, res) => {
  try {
    const { TenKhachHang } = req.query; // Lấy tên khách hàng từ query string
    if (!TenKhachHang) {
      return res.status(400).json({ status: false, message: "Tên khách hàng là bắt buộc" });
    }

    const customers = await khachhang.find({ 
      TenKhachHang: { $regex: TenKhachHang, $options: "i" } // Tìm kiếm không phân biệt chữ hoa/thường
    });

    if (customers.length > 0) {
      res.json(customers);
    } else {
      res.status(404).json({ status: false, message: "Không tìm thấy khách hàng" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});
// 10 Đếm số lượng khách hàng không có số điện thoại
router.get("/count-no-phone", async (req, res) => {
  try {
    const count = await khachhang.countDocuments({ SoDienThoai: { $exists: false } }); // Đếm khách hàng không có số điện thoại
    res.json({ status: true, total: count });
  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});


module.exports = router;
