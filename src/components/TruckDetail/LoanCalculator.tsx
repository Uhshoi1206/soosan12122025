import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from '@/lib/utils';

interface LoanCalculatorProps {
  truckPrice?: number;
}

interface ScheduleItem {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ truckPrice = 500000000 }) => {
  const [customTruckPrice, setCustomTruckPrice] = useState<number>(truckPrice);
  const [displayPrice, setDisplayPrice] = useState<string>(truckPrice.toLocaleString('vi-VN'));
  const [loanPercentage, setLoanPercentage] = useState<number>(70);
  const [loanTermYears, setLoanTermYears] = useState<number>(5);
  const [interestRatePercent, setInterestRatePercent] = useState<number>(9.5);
  const [showSchedule, setShowSchedule] = useState(false);

  // Cập nhật giá xe tùy chỉnh khi truck thay đổi
  React.useEffect(() => {
    setCustomTruckPrice(truckPrice);
    setDisplayPrice(truckPrice.toLocaleString('vi-VN'));
  }, [truckPrice]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Chỉ lấy số
    const numericValue = value === '' ? 0 : Number(value);
    setCustomTruckPrice(numericValue);
    setDisplayPrice(numericValue.toLocaleString('vi-VN'));
  };

  const loanAmount = useMemo(() => customTruckPrice * (loanPercentage / 100), [customTruckPrice, loanPercentage]);
  const downPayment = useMemo(() => customTruckPrice - loanAmount, [customTruckPrice, loanAmount]);

  const paymentDetails = useMemo(() => {
    const principal = loanAmount;
    const annualInterestRate = interestRatePercent / 100;
    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfMonths = loanTermYears * 12;
    
    let schedule: ScheduleItem[] = [];
    let remainingBalance = principal;
    let totalInterestPaid = 0;

    if (principal <= 0 || numberOfMonths <= 0) {
      return { schedule: [], monthlyPaymentFirstMonth: 0, totalInterest: 0, totalPayment: 0 };
    }

    const monthlyPrincipalPayment = principal / numberOfMonths;

    for (let i = 1; i <= numberOfMonths; i++) {
      const interestForMonth = remainingBalance * monthlyInterestRate;
      const totalPaymentForMonth = monthlyPrincipalPayment + interestForMonth;
      remainingBalance -= monthlyPrincipalPayment;
      totalInterestPaid += interestForMonth;

      schedule.push({
        month: i,
        principalPayment: monthlyPrincipalPayment,
        interestPayment: interestForMonth,
        totalPayment: totalPaymentForMonth,
        remainingBalance: Math.max(0, remainingBalance),
      });
    }
    
    const firstMonthPayment = schedule.length > 0 ? schedule[0].totalPayment : 0;

    return { schedule, monthlyPaymentFirstMonth: firstMonthPayment, totalInterest: totalInterestPaid, totalPayment: principal + totalInterestPaid };
  }, [loanAmount, loanTermYears, interestRatePercent]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Dự toán vay mua xe (Gốc trả đều, lãi theo dư nợ giảm dần)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <Label htmlFor="truckPriceLoanCalc" className="text-sm font-medium text-gray-700">Giá trị xe</Label>
          <Input 
            id="truckPriceLoanCalc" 
            type="text" 
            value={displayPrice} 
            onChange={handlePriceChange} 
            className="mt-1"
          />
        </div>
         <div>
          <Label htmlFor="downPaymentDisplayCalc" className="text-sm font-medium text-gray-700">Số tiền trả trước</Label>
          <Input id="downPaymentDisplayCalc" type="text" value={formatPrice(downPayment)} readOnly className="mt-1 bg-gray-100 cursor-not-allowed" />
        </div>
        <div>
          <Label htmlFor="loanAmountDisplayCalc" className="text-sm font-medium text-gray-700">Số tiền vay</Label>
          <Input id="loanAmountDisplayCalc" type="text" value={formatPrice(loanAmount)} readOnly className="mt-1 bg-gray-100 cursor-not-allowed" />
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <Label htmlFor="loanPercentageSlider" className="text-sm font-medium text-gray-700">
            Tỷ lệ vay: <span className="font-semibold text-primary">{loanPercentage}%</span> (Tối đa 85%)
          </Label>
          <Slider
            id="loanPercentageSlider"
            min={10} max={85} step={1}
            value={[loanPercentage]}
            onValueChange={(value) => setLoanPercentage(value[0])}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="loanTermYearsSlider" className="text-sm font-medium text-gray-700">
            Thời gian vay: <span className="font-semibold text-primary">{loanTermYears} năm</span> (Tối đa 7 năm)
          </Label>
          <Slider
            id="loanTermYearsSlider"
            min={1} max={7} step={1}
            value={[loanTermYears]}
            onValueChange={(value) => setLoanTermYears(value[0])}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="interestRatePercentSlider" className="text-sm font-medium text-gray-700">
            Lãi suất: <span className="font-semibold text-primary">{interestRatePercent.toFixed(1)}%/năm</span> (Ước tính)
          </Label>
          <Slider
            id="interestRatePercentSlider"
            min={5} max={15} step={0.1}
            value={[interestRatePercent]}
            onValueChange={(value) => setInterestRatePercent(value[0])}
            className="mt-2"
          />
        </div>
      </div>

      {loanAmount > 0 && (
        <div className="mt-6 bg-slate-50 p-4 sm:p-6 rounded-lg border border-slate-200">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Kết quả dự toán vay (tạm tính):</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-gray-600">Số tiền trả góp tháng đầu:</span>
              <span className="font-semibold text-gray-800">{formatPrice(paymentDetails.monthlyPaymentFirstMonth)}</span>
            </li>
             <li className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-gray-600">Tiền gốc trả hàng tháng:</span>
              <span className="font-semibold text-gray-800">{formatPrice(loanAmount / (loanTermYears * 12) )}</span>
            </li>
            <li className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-gray-600">Tổng số tiền lãi phải trả:</span>
              <span className="font-semibold text-gray-800">{formatPrice(paymentDetails.totalInterest)}</span>
            </li>
            <li className="flex justify-between text-lg font-bold pt-3 text-primary mt-2">
              <span>TỔNG TIỀN PHẢI TRẢ (GỐC + LÃI):</span>
              <span>{formatPrice(paymentDetails.totalPayment)}</span>
            </li>
          </ul>
           <div className="mt-4">
            <Button 
                variant="link"
                onClick={() => setShowSchedule(!showSchedule)}
                className="p-0 h-auto text-sm text-primary hover:underline"
            >
                {showSchedule ? "Ẩn bảng kế hoạch trả nợ" : "Xem bảng kế hoạch trả nợ chi tiết"}
            </Button>
           </div>
          <p className="text-xs text-gray-500 mt-3 italic">*Lưu ý: Kết quả trên chỉ là ước tính. Lãi suất thực tế và các điều khoản vay có thể thay đổi tùy thuộc vào ngân hàng và thời điểm vay. Vui lòng liên hệ trực tiếp để được tư vấn chi tiết.</p>
        </div>
      )}

      {showSchedule && paymentDetails.schedule.length > 0 && (
        <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-700">Bảng kế hoạch trả nợ chi tiết (Dư nợ giảm dần)</h4>
            <div className="max-h-96 overflow-y-auto border rounded-md">
                 <Table>
                    <TableHeader className="sticky top-0 bg-slate-100 z-10">
                        <TableRow>
                        <TableHead className="w-[60px] text-center text-xs sm:text-sm">Kỳ</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Gốc trả</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Lãi trả</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Tổng trả</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Dư nợ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentDetails.schedule.map((item) => (
                        <TableRow key={item.month}>
                            <TableCell className="text-center font-medium text-xs sm:text-sm">{item.month}</TableCell>
                            <TableCell className="text-right text-xs sm:text-sm">{formatPrice(item.principalPayment, false)}</TableCell>
                            <TableCell className="text-right text-xs sm:text-sm">{formatPrice(item.interestPayment, false)}</TableCell>
                            <TableCell className="text-right font-semibold text-xs sm:text-sm">{formatPrice(item.totalPayment, false)}</TableCell>
                            <TableCell className="text-right text-xs sm:text-sm">{formatPrice(item.remainingBalance, false)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
