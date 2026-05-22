const initialData = {
  "curriculum": {
    "LA1003": {
      "name": "Anh văn 1",
      "credits": 2,
      "required": true,
      "semester_plan": "1",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "PE1003": {
      "name": "Giáo dục thể chất 1",
      "credits": 0,
      "required": true,
      "semester_plan": "1",
      "type": "Chứng chỉ"
    },
    "MT1003": {
      "name": "Giải tích 1",
      "credits": 4,
      "required": true,
      "semester_plan": "1",
      "type": "Kiến thức GD đại cương - Toán"
    },
    "PH1003": {
      "name": "Vật lý 1",
      "credits": 4,
      "required": true,
      "semester_plan": "1",
      "type": "Kiến thức GD đại cương - Khoa học tự nhiên"
    },
    "CO1005": {
      "name": "Nhập môn điện toán",
      "credits": 3,
      "required": true,
      "semester_plan": "1",
      "type": "Kiến thức GD đại cương - Giáo dục chung khác (Nhập môn)"
    },
    "CO1023": {
      "name": "Hệ thống số",
      "credits": 3,
      "required": true,
      "semester_plan": "1",
      "type": "Kiến thức GD chuyên nghiệp - Cơ sở ngành"
    },
    "LA1045": {
      "name": "Tiếng Nhật 1",
      "credits": 0,
      "required": true,
      "semester_plan": "1",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "SP1041": {
      "name": "Kỹ năng mềm",
      "credits": 0,
      "required": true,
      "semester_plan": "1",
      "type": "Kỹ năng xã hội"
    },
    "SP1013": {
      "name": "Kỹ năng xã hội A (báo chí)",
      "credits": 0,
      "required": false,
      "semester_plan": "1",
      "type": "Kỹ năng xã hội"
    },
    "SP1015": {
      "name": "Kỹ năng xã hội B (sân khấu)",
      "credits": 0,
      "required": false,
      "semester_plan": "1",
      "type": "Kỹ năng xã hội"
    },
    "SP1017": {
      "name": "Kỹ năng xã hội C (Thanh nhạc)",
      "credits": 0,
      "required": false,
      "semester_plan": "1",
      "type": "Kỹ năng xã hội"
    },
    "SP1019": {
      "name": "Kỹ năng xã hội D (Nhiếp ảnh)",
      "credits": 0,
      "required": false,
      "semester_plan": "1",
      "type": "Kỹ năng xã hội"
    },
    "SP1021": {
      "name": "Kỹ năng xã hội E (dẫn chương trình)",
      "credits": 0,
      "required": false,
      "semester_plan": "1",
      "type": "Kỹ năng xã hội"
    },
    "SP1023": {
      "name": "Kỹ năng xã hội F (nhảy hiện đại)",
      "credits": 0,
      "required": false,
      "semester_plan": "1",
      "type": "Kỹ năng xã hội"
    },
    "SP1025": {
      "name": "Kỹ năng xã hội G (nhảy đường phố)",
      "credits": 0,
      "required": false,
      "semester_plan": "1",
      "type": "Kỹ năng xã hội"
    },
    "SP1027": {
      "name": "Kỹ năng xã hội H (tư duy phản biện)",
      "credits": 0,
      "required": false,
      "semester_plan": "1",
      "type": "Kỹ năng xã hội"
    },
    "LA1005": {
      "name": "Anh văn 2",
      "credits": 2,
      "required": true,
      "semester_plan": "2",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "PE1005": {
      "name": "Giáo dục thể chất 2",
      "credits": 0,
      "required": true,
      "semester_plan": "2",
      "type": "Chứng chỉ"
    },
    "MT1005": {
      "name": "Giải tích 2",
      "credits": 4,
      "required": true,
      "semester_plan": "2",
      "type": "Kiến thức GD đại cương - Toán"
    },
    "MT1007": {
      "name": "Đại số tuyến tính",
      "credits": 3,
      "required": true,
      "semester_plan": "2",
      "type": "Kiến thức GD đại cương - Toán"
    },
    "CO1007": {
      "name": "Cấu trúc rời rạc cho khoa học máy tính",
      "credits": 4,
      "required": true,
      "semester_plan": "2",
      "type": "Kiến thức GD đại cương - Toán và Khoa học tự nhiên"
    },
    "CO1027": {
      "name": "Kỹ thuật lập trình",
      "credits": 3,
      "required": true,
      "semester_plan": "2",
      "type": "Kiến thức GD chuyên nghiệp - Cơ sở ngành"
    },
    "PH1007": {
      "name": "Thí nghiệm vật lý",
      "credits": 1,
      "required": true,
      "semester_plan": "2",
      "type": "Kiến thức GD đại cương - Khoa học tự nhiên"
    },
    "LA1047": {
      "name": "Tiếng Nhật 2",
      "credits": 0,
      "required": true,
      "semester_plan": "2",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "LA1007": {
      "name": "Anh văn 3",
      "credits": 2,
      "required": true,
      "semester_plan": "3",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "SP1031": {
      "name": "Triết học Mác - Lênin",
      "credits": 3,
      "required": true,
      "semester_plan": "3",
      "type": "Kiến thức GD đại cương - Kinh tế-Chính trị-Xã hội-Luật"
    },
    "CO2007": {
      "name": "Kiến trúc máy tính",
      "credits": 4,
      "required": true,
      "semester_plan": "3",
      "type": "Kiến thức GD chuyên nghiệp - Cơ sở ngành"
    },
    "CO2011": {
      "name": "Mô hình hóa toán học",
      "credits": 3,
      "required": true,
      "semester_plan": "3",
      "type": "Kiến thức GD đại cương - Toán và Khoa học tự nhiên"
    },
    "CO2003": {
      "name": "Cấu trúc dữ liệu và giải thuật",
      "credits": 4,
      "required": true,
      "semester_plan": "3",
      "type": "Kiến thức GD chuyên nghiệp - Cơ sở ngành"
    },
    "PE1007": {
      "name": "Giáo dục thể chất 3",
      "credits": 0,
      "required": true,
      "semester_plan": "3",
      "type": "Chứng chỉ"
    },
    "LA2017": {
      "name": "Tiếng Nhật 3",
      "credits": 0,
      "required": true,
      "semester_plan": "3",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "MI1003": {
      "name": "Giáo dục quốc phòng",
      "credits": 0,
      "required": true,
      "semester_plan": "3",
      "type": "Chứng chỉ"
    },
    "LA1009": {
      "name": "Anh văn 4",
      "credits": 2,
      "required": true,
      "semester_plan": "4",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "SP1033": {
      "name": "Kinh tế chính trị Mác - Lênin",
      "credits": 2,
      "required": true,
      "semester_plan": "4",
      "type": "Kiến thức GD đại cương - Kinh tế-Chính trị-Xã hội-Luật"
    },
    "CO2017": {
      "name": "Hệ điều hành",
      "credits": 3,
      "required": true,
      "semester_plan": "4",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành"
    },
    "CO2039": {
      "name": "Lập trình nâng cao",
      "credits": 3,
      "required": true,
      "semester_plan": "4",
      "type": "Kiến thức GD chuyên nghiệp - Cơ sở ngành"
    },
    "MT2013": {
      "name": "Xác suất và thống kê",
      "credits": 4,
      "required": true,
      "semester_plan": "4",
      "type": "Kiến thức GD đại cương - Toán"
    },
    "LA2019": {
      "name": "Tiếng Nhật 4",
      "credits": 0,
      "required": true,
      "semester_plan": "4",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "SP1035": {
      "name": "Chủ nghĩa xã hội khoa học",
      "credits": 2,
      "required": true,
      "semester_plan": "5",
      "type": "Kiến thức GD đại cương - Kinh tế-Chính trị-Xã hội-Luật"
    },
    "CO3093": {
      "name": "Mạng máy tính",
      "credits": 3,
      "required": true,
      "semester_plan": "5",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành"
    },
    "CO2013": {
      "name": "Hệ cơ sở dữ liệu",
      "credits": 4,
      "required": true,
      "semester_plan": "5",
      "type": "Kiến thức GD chuyên nghiệp - Cơ sở ngành"
    },
    "CO3001": {
      "name": "Công nghệ phần mềm",
      "credits": 3,
      "required": true,
      "semester_plan": "5",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành"
    },
    "CH1003": {
      "name": "Hóa đại cương",
      "credits": 3,
      "required": true,
      "semester_plan": "5",
      "type": "Kiến thức GD đại cương - Khoa học tự nhiên"
    },
    "LA3025": {
      "name": "Tiếng Nhật 5",
      "credits": 0,
      "required": true,
      "semester_plan": "5",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "SP1043": {
      "name": "Văn hoá Nhật",
      "credits": 0,
      "required": true,
      "semester_plan": "5",
      "type": "Kỹ năng xã hội"
    },
    "CO3101": {
      "name": "Đồ án tổng hợp - hướng trí tuệ nhân tạo",
      "credits": 1,
      "required": false,
      "semester_plan": "5",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành (nhóm tự chọn A)"
    },
    "CO3103": {
      "name": "Đồ án tổng hợp - hướng công nghệ phần mềm",
      "credits": 1,
      "required": false,
      "semester_plan": "5",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành (nhóm tự chọn A)"
    },
    "CO3105": {
      "name": "Đồ án tổng hợp - hướng hệ thống thông tin",
      "credits": 1,
      "required": false,
      "semester_plan": "5",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành (nhóm tự chọn A)"
    },
    "SP1039": {
      "name": "Lịch sử Đảng Cộng sản Việt Nam",
      "credits": 2,
      "required": true,
      "semester_plan": "6",
      "type": "Kiến thức GD đại cương - Kinh tế-Chính trị-Xã hội-Luật"
    },
    "CO3029": {
      "name": "Khai phá dữ liệu",
      "credits": 3,
      "required": true,
      "semester_plan": "6",
      "type": ""
    },
    "CO3089": {
      "name": "Những chủ đề nâng cao trong khoa học máy tính",
      "credits": 3,
      "required": true,
      "semester_plan": "6",
      "type": ""
    },
    "CO3061": {
      "name": "Nhập môn trí tuệ nhân tạo",
      "credits": 3,
      "required": true,
      "semester_plan": "6",
      "type": ""
    },
    "LA3027": {
      "name": "Tiếng Nhật 6",
      "credits": 0,
      "required": true,
      "semester_plan": "6",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "CO3107": {
      "name": "Thực tập đồ án môn học đa ngành - hướng trí tuệ nhân tạo",
      "credits": 1,
      "required": false,
      "semester_plan": "6",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành (nhóm tự chọn B)"
    },
    "CO3109": {
      "name": "Thực tập đồ án môn học đa ngành - hướng công nghệ phần mềm",
      "credits": 1,
      "required": false,
      "semester_plan": "6",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành (nhóm tự chọn B)"
    },
    "CO3111": {
      "name": "Thực tập đồ án môn học đa ngành - hướng hệ thống thông tin",
      "credits": 1,
      "required": false,
      "semester_plan": "6",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành (nhóm tự chọn B)"
    },
    "CO3335": {
      "name": "Thực tập ngoài trường",
      "credits": 2,
      "required": true,
      "semester_plan": "6-hè",
      "type": "Tốt nghiệp"
    },
    "SP1037": {
      "name": "Tư tưởng Hồ Chí Minh",
      "credits": 2,
      "required": true,
      "semester_plan": "7",
      "type": "Kiến thức GD đại cương - Kinh tế-Chính trị-Xã hội-Luật"
    },
    "CO4029": {
      "name": "Đồ án chuyên ngành",
      "credits": 2,
      "required": true,
      "semester_plan": "7",
      "type": "Tốt nghiệp"
    },
    "CO2001": {
      "name": "Kỹ năng chuyên nghiệp cho kỹ sư",
      "credits": 3,
      "required": true,
      "semester_plan": "7",
      "type": "Kiến thức GD đại cương - Giáo dục chung khác (Con người và môi trường)"
    },
    "CO3005": {
      "name": "Nguyên lý ngôn ngữ lập trình",
      "credits": 4,
      "required": true,
      "semester_plan": "7",
      "type": "Kiến thức GD chuyên nghiệp - Chuyên ngành"
    },
    "LA4007": {
      "name": "Tiếng Nhật 7",
      "credits": 0,
      "required": true,
      "semester_plan": "7",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    },
    "IM1013": {
      "name": "Kinh tế học đại cương",
      "credits": 3,
      "required": false,
      "semester_plan": "7",
      "type": "Kiến thức GD đại cương - Giáo dục chung khác (Quản lý)"
    },
    "IM3001": {
      "name": "Quản trị kinh doanh cho kỹ sư",
      "credits": 3,
      "required": false,
      "semester_plan": "7",
      "type": "Kiến thức GD đại cương - Giáo dục chung khác (Quản lý)"
    },
    "IM1027": {
      "name": "Kinh tế kỹ thuật",
      "credits": 3,
      "required": false,
      "semester_plan": "7",
      "type": "Kiến thức GD đại cương - Giáo dục chung khác (Quản lý)"
    },
    "IM1023": {
      "name": "Quản lý sản xuất cho kỹ sư",
      "credits": 3,
      "required": false,
      "semester_plan": "7",
      "type": "Kiến thức GD đại cương - Giáo dục chung khác (Quản lý)"
    },
    "IM1025": {
      "name": "Quản lý dự án cho kỹ sư",
      "credits": 3,
      "required": false,
      "semester_plan": "7",
      "type": "Kiến thức GD đại cương - Giáo dục chung khác (Quản lý)"
    },
    "SP1007": {
      "name": "Pháp luật Việt Nam đại cương",
      "credits": 2,
      "required": true,
      "semester_plan": "8",
      "type": "Kiến thức GD đại cương - Kinh tế-Chính trị-Xã hội-Luật"
    },
    "CO4337": {
      "name": "Đồ án tốt nghiệp (Khoa học Máy tính)",
      "credits": 4,
      "required": true,
      "semester_plan": "8",
      "type": "Tốt nghiệp"
    },
    "LA4009": {
      "name": "Tiếng Nhật 8",
      "credits": 0,
      "required": true,
      "semester_plan": "8",
      "type": "Kiến thức GD đại cương - Ngoại ngữ"
    }
  },
  "history": [
    {
      "name": "Học kỳ 1 Năm học 2025 - 2026",
      "courses": []
    }
  ]
};
