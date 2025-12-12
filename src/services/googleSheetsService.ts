
// Cấu hình Google Sheets - thay đổi URL này theo sheet của bạn
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxfsILcpeYwjC85Y3rJHOWo6-kXplkn2WSJ4RJmNt_42797ZnVXpY9xL5MnFkgJ0SJK/exec';

export interface ContactData {
  timestamp: string;
  source: string; // Nguồn form (trang chủ, footer, chi tiết sản phẩm, blog, bài viết, liên hệ)
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  company?: string;
  product?: string;
  message?: string;
}

export const submitToGoogleSheets = async (data: ContactData): Promise<boolean> => {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    // Do fetch với mode 'no-cors', chúng ta không thể kiểm tra response
    // Nhưng nếu không có lỗi thì coi như thành công
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi dữ liệu đến Google Sheets:', error);
    return false;
  }
};
