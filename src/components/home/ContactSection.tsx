
import React from 'react';
import ContactForm from '@/components/ContactForm';
import SectionTitle from '@/components/SectionTitle';

const ContactSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Liên Hệ Tư Vấn"
          description="Để được tư vấn chi tiết về các dòng xe tải, xe cẩu, sơ mi rơ mooc, xe đầu kéo cùng chương trình khuyến mãi, vui lòng để lại thông tin liên hệ."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="text-gray-600 mb-6">
              Để được tư vấn chi tiết về các dòng xe tải, xe cẩu, sơ mi rơ mooc, xe đầu kéo cùng 
              chương trình khuyến mãi, vui lòng để lại thông tin liên hệ. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
            </p>
            
            <ContactForm source="trang-chu" />
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold mb-4">Tại sao chọn chúng tôi?</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">1</div>
                  <div>
                    <h4 className="font-bold mb-1">Đa dạng sản phẩm</h4>
                    <p className="text-gray-600">Cung cấp đầy đủ các loại xe thương mại từ xe tải, xe cẩu, mooc đến xe đầu kéo của nhiều thương hiệu.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">2</div>
                  <div>
                    <h4 className="font-bold mb-1">Giá cả cạnh tranh</h4>
                    <p className="text-gray-600">Cam kết mức giá tốt nhất thị trường và nhiều chương trình ưu đãi.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">3</div>
                  <div>
                    <h4 className="font-bold mb-1">Hỗ trợ tài chính</h4>
                    <p className="text-gray-600">Hỗ trợ vay ngân hàng lên đến 70% giá trị xe với thủ tục đơn giản.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">4</div>
                  <div>
                    <h4 className="font-bold mb-1">Dịch vụ sau bán hàng</h4>
                    <p className="text-gray-600">Hỗ trợ kỹ thuật 24/7 và mạng lưới dịch vụ rộng khắp trên toàn quốc.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
