const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const khachhangSchema = new Schema({
    id: { type: ObjectId },
    TenKhachHang: { type: String, required: true },
    Email: { type: String },
    SoDienThoai: { type: String },
    DiaChi: { type: String }
});

module.exports = mongoose.models.khachhang || mongoose.model('khachhang', khachhangSchema);
