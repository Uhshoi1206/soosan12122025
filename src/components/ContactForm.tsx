
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { submitToGoogleSheets, ContactData } from '@/services/googleSheetsService';

interface ContactFormProps {
  productName?: string;
  source?: string; // Để xác định nguồn form
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  productName = '', 
  source = 'trang-chu'
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    product: productName,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const contactData: ContactData = {
        timestamp: new Date().toLocaleString('vi-VN'),
        source: source,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        product: formData.product,
        message: formData.message
      };

      const success = await submitToGoogleSheets(contactData);
      
      if (success) {
        toast({
          title: "Gửi thành công!",
          description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
        });
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          product: productName,
          message: ''
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-base">Họ và tên <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nhập họ và tên của bạn"
          required
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-base">Số điện thoại <span className="text-red-500">*</span></Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nhập số điện thoại của bạn"
          required
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="text-base">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập địa chỉ email của bạn"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="address" className="text-base">Địa chỉ</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Nhập địa chỉ của bạn"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="product" className="text-base">Sản phẩm quan tâm</Label>
        <Input
          id="product"
          name="product"
          value={formData.product}
          onChange={handleChange}
          placeholder="Nhập tên sản phẩm bạn quan tâm"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="message" className="text-base">Nội dung</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Nhập nội dung bạn muốn tư vấn"
          rows={4}
          className="mt-1"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
      </Button>
    </form>
  );
};

export default ContactForm;
