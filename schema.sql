-- Optional schema for future WeWine persistence. Run manually in your own database.
-- The current demo does not read or write these tables.
IF OBJECT_ID(N'dbo.SanPham', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.SanPham (
    MaSanPham INT NOT NULL PRIMARY KEY CHECK (MaSanPham > 0),
    TenSanPham NVARCHAR(150) NOT NULL,
    XuatXu NVARCHAR(100) NOT NULL,
    Loai VARCHAR(20) NOT NULL CHECK (Loai IN ('red', 'white', 'champagne', 'whisky')),
    DonGia DECIMAL(14,2) NOT NULL CHECK (DonGia >= 0),
    TonKho INT NOT NULL DEFAULT 0 CHECK (TonKho >= 0),
    BieuTuong NVARCHAR(10) NULL,
    MoTa NVARCHAR(1000) NULL
  );
END;
IF OBJECT_ID(N'dbo.DonHang', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.DonHang (
    MaDonHang NVARCHAR(30) NOT NULL PRIMARY KEY,
    TenKhachHang NVARCHAR(150) NOT NULL,
    SoDienThoai NVARCHAR(30) NOT NULL,
    DiaChi NVARCHAR(500) NOT NULL,
    PhuongThucThanhToan NVARCHAR(100) NOT NULL,
    GhiChu NVARCHAR(1000) NULL,
    NgayDat DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    PhiGiaoHang DECIMAL(14,2) NOT NULL DEFAULT 30000 CHECK (PhiGiaoHang >= 0),
    TongTien DECIMAL(18,2) NOT NULL CHECK (TongTien >= 0),
    TrangThai VARCHAR(20) NOT NULL DEFAULT 'pending'
      CHECK (TrangThai IN ('pending', 'shipping', 'done', 'cancelled'))
  );
END;
IF OBJECT_ID(N'dbo.ChiTietDonHang', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ChiTietDonHang (
    MaDonHang NVARCHAR(30) NOT NULL REFERENCES dbo.DonHang(MaDonHang),
    MaSanPham INT NOT NULL REFERENCES dbo.SanPham(MaSanPham),
    SoLuong INT NOT NULL CHECK (SoLuong > 0),
    DonGia DECIMAL(14,2) NOT NULL CHECK (DonGia >= 0),
    PRIMARY KEY (MaDonHang, MaSanPham)
  );
END;