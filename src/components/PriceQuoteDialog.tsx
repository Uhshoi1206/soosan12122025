
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { submitToGoogleSheets, ContactData } from '@/services/googleSheetsService';

interface PriceQuoteDialogProps {
  productName: string;
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

const PriceQuoteDialog: React.FC<PriceQuoteDialogProps> = ({
  productName,
  trigger,
  onOpenChange
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const contactData: ContactData = {
        timestamp: new Date().toLocaleString('vi-VN'),
        source: 'chi-tiet-san-pham',
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        company: formData.company,
        product: productName,
        message: formData.message
      };

      const success = await submitToGoogleSheets(contactData);
      
      if (success) {
        setIsOpen(false);
        
        toast({
          title: "Gửi yêu cầu thành công!",
          description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
        });
        
        // Reset form
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          company: '',
          message: '',
        });
      } else {
        throw new Error('Gửi thất bại');
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra!",
        description: "Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        setIsOpen(open);
        if (onOpenChange) onOpenChange(open);
        
        // Reset lỗi khi đóng form
        if (!open) {
          setErrors({});
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || <Button>Nhận báo giá</Button>}
      </DialogTrigger>
      <DialogContent 
        className={`sm:max-w-[500px] max-h-[95vh] ${isMobile ? 'p-3' : 'p-6'}`}
        style={{ 
          overflowY: isMobile ? 'auto' : 'visible',
          height: isMobile ? 'auto' : undefined,
          maxHeight: isMobile ? '95vh' : '90vh'
        }}
      >
        <DialogHeader className={isMobile ? 'mb-2 pb-0' : ''}>
          <DialogTitle className={`text-xl font-bold text-center ${isMobile ? 'mb-0' : 'mb-2'}`}>Yêu cầu báo giá</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className={`space-y-2 ${isMobile ? 'py-0' : 'py-1'}`}>
          <div className={`${isMobile ? 'p-2' : 'p-3'} bg-gray-50 rounded-md mb-2`}>
            <div className="text-sm text-gray-700 mb-0">Sản phẩm quan tâm:</div>
            <div className="font-semibold text-primary">{productName}</div>
          </div>
          
          <div className="space-y-0">
            <Label htmlFor="fullName" className="text-sm">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`${errors.fullName ? "border-red-500" : ""} h-9 mt-1`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>
            
          <div className="space-y-0">
            <Label htmlFor="phone" className="text-sm">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={`${errors.phone ? "border-red-500" : ""} h-9 mt-1`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div className="space-y-0">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${errors.email ? "border-red-500" : ""} h-9 mt-1`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
            
          <div className="space-y-0">
            <Label htmlFor="company" className="text-sm">Công ty</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="h-9 mt-1"
            />
          </div>
          
          <div className="space-y-0">
            <Label htmlFor="message" className="text-sm">Nội dung</Label>
            <Textarea
              id="message"
              name="message"
              rows={1}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Nhu cầu của bạn, thời gian cần báo giá..."
              className="resize-none min-h-[50px] mt-1"
            />
          </div>
          
          <DialogFooter className={`mt-3 ${isMobile ? 'pt-1' : 'pt-2'} ${isMobile ? 'border-t-0' : 'border-t'}`}>
            <div className="w-full flex flex-row sm:justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="h-8 text-sm">
                  Hủy
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 h-8 text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PriceQuoteDialog;
