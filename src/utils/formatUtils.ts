
export const formatCurrencyInput = (value: string): string => {
  // Loại bỏ tất cả ký tự không phải số
  const numbers = value.replace(/[^\d]/g, '');
  
  // Nếu không có số nào thì trả về chuỗi rỗng
  if (!numbers) return '';
  
  // Format với phân cách hàng nghìn
  return new Intl.NumberFormat('vi-VN').format(parseInt(numbers));
};

export const parseCurrencyInput = (value: string): number => {
  // Loại bỏ tất cả ký tự không phải số và chuyển về number
  const numbers = value.replace(/[^\d]/g, '');
  return numbers ? parseInt(numbers) : 0;
};
