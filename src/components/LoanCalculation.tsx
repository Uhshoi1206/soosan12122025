import React, { useState } from 'react';
import { Calculator, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const LoanCalculation: React.FC = () => {
  const [vehiclePrice, setVehiclePrice] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const formatCurrencyInput = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseCurrencyInput = (value: string) => {
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  };

  const handleVehiclePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setVehiclePrice(formatted);
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setDownPayment(formatted);
  };

  const calculateLoan = () => {
    if (!vehiclePrice || !downPayment || !interestRate || !loanTerm || !paymentMethod) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const price = parseCurrencyInput(vehiclePrice);
    const downPaymentAmount = parseCurrencyInput(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanTerm) * 12;

    const loanAmount = price - downPaymentAmount;

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;
    let schedule: any[] = [];

    if (paymentMethod === 'equal_principal_interest') {
      monthlyPayment = (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - loanAmount;

      let remainingBalance = loanAmount;
      for (let i = 1; i <= months; i++) {
        const interestForMonth = remainingBalance * rate;
        const principalForMonth = monthlyPayment - interestForMonth;
        remainingBalance -= principalForMonth;

        schedule.push({
          month: i,
          principalPayment: principalForMonth,
          interestPayment: interestForMonth,
          totalPayment: monthlyPayment,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }
    } else if (paymentMethod === 'decreasing_principal') {
      const principalPayment = loanAmount / months;
      let remainingBalance = loanAmount;
      totalInterest = 0;

      for (let i = 1; i <= months; i++) {
        const interestForMonth = remainingBalance * rate;
        const totalPaymentForMonth = principalPayment + interestForMonth;
        remainingBalance -= principalPayment;
        totalInterest += interestForMonth;

        schedule.push({
          month: i,
          principalPayment: principalPayment,
          interestPayment: interestForMonth,
          totalPayment: totalPaymentForMonth,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }

      totalPayment = loanAmount + totalInterest;
      monthlyPayment = schedule[0]?.totalPayment || 0;
    }

    setResults({
      vehiclePrice: price,
      downPayment: downPaymentAmount,
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
      paymentMethod,
      loanTerm: parseInt(loanTerm),
      schedule
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Thông Tin Vay</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="vehiclePrice">Giá xe (đã bao gồm VAT)</Label>
            <Input
              id="vehiclePrice"
              placeholder="Nhập giá xe (VNĐ)"
              value={vehiclePrice}
              onChange={handleVehiclePriceChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="downPayment">Số tiền trả trước</Label>
            <Input
              id="downPayment"
              placeholder="Nhập số tiền trả trước (VNĐ)"
              value={downPayment}
              onChange={handleDownPaymentChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Lãi suất (%/năm)</Label>
            <Input
              id="interestRate"
              placeholder="Nhập lãi suất (ví dụ: 10.5)"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanTerm">Thời gian vay (năm)</Label>
            <Select value={loanTerm} onValueChange={setLoanTerm}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thời gian vay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 năm</SelectItem>
                <SelectItem value="2">2 năm</SelectItem>
                <SelectItem value="3">3 năm</SelectItem>
                <SelectItem value="4">4 năm</SelectItem>
                <SelectItem value="5">5 năm</SelectItem>
                <SelectItem value="6">6 năm</SelectItem>
                <SelectItem value="7">7 năm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="paymentMethod">Phương thức trả</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phương thức trả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal_principal_interest">Gốc + lãi cố định</SelectItem>
                <SelectItem value="decreasing_principal">Gốc giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={calculateLoan} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Tính Toán Lãi Suất Vay
          </Button>
        </div>
      </div>

      {results && (
        <div className="bg-green-50 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Kết Quả Tính Toán</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Giá trị xe:</span>
                <span className="font-semibold">{formatCurrency(results.vehiclePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Số tiền trả trước:</span>
                <span className="font-semibold">{formatCurrency(results.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Số tiền vay:</span>
                <span className="font-semibold">{formatCurrency(results.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Thời gian vay:</span>
                <span className="font-semibold">{results.loanTerm} năm</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">
                  {results.paymentMethod === 'decreasing_principal' ? 'Trả hàng tháng (tháng đầu):' : 'Trả hàng tháng:'}
                </span>
                <span className="font-semibold text-blue-600">{formatCurrency(results.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tổng tiền lãi:</span>
                <span className="font-semibold text-orange-600">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-lg font-bold text-green-800">Tổng tiền phải trả:</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(results.totalPayment)}</span>
              </div>
              {results.paymentMethod === 'decreasing_principal' && (
                <div className="text-sm text-gray-600 mt-2">
                  * Gốc giảm dần: Khoản thanh toán hàng tháng sẽ giảm dần theo thời gian
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full"
            >
              {showSchedule ? 'Ẩn bảng kế hoạch trả nợ chi tiết' : 'Xem bảng kế hoạch trả nợ chi tiết'}
            </Button>
          </div>
        </div>
      )}

      {showSchedule && results && results.schedule && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Bảng kế hoạch trả nợ chi tiết (Dư nợ giảm dần)</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Kỳ</TableHead>
                  <TableHead className="text-right">Gốc trả</TableHead>
                  <TableHead className="text-right">Lãi trả</TableHead>
                  <TableHead className="text-right">Tổng trả</TableHead>
                  <TableHead className="text-right">Dư nợ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.schedule.map((item: any) => (
                  <TableRow key={item.month}>
                    <TableCell className="text-center font-medium">{item.month}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.principalPayment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.interestPayment)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.totalPayment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.remainingBalance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="italic">*Lưu ý: Kết quả trên chỉ là ước tính. Lãi suất thực tế và các điều khoản vay có thể thay đổi tùy thuộc vào ngân hàng và thời điểm vay. Vui lòng liên hệ trực tiếp để được tư vấn chi tiết.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculation;
