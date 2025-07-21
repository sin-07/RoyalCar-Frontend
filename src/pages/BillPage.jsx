import React from 'react';
import RoyalCarBill from '../components/RoyalCarBill';

const BillPage = () => {
  // Sample booking data
  const sampleBooking = {
    invoiceNumber: "RC-2025-001",
    invoiceDate: "January 22, 2025",
    customerName: "John Doe",
    customerEmail: "john.doe@email.com",
    customerPhone: "+1 (555) 123-4567",
    customerAddress: "123 Main Street, New York, NY 10001",
    
    carDetails: {
      brand: "Rolls Royce",
      model: "Phantom",
      year: "2024",
      licensePlate: "RR-2024-PHT",
      category: "Ultra Luxury"
    },
    
    rentalPeriod: {
      pickupDate: "January 25, 2025",
      pickupTime: "10:00 AM",
      returnDate: "January 28, 2025", 
      returnTime: "10:00 AM",
      duration: "3 days",
      pickupLocation: "Airport Parking"
    },
    
    pricing: {
      baseRate: 1200.00,
      days: 3,
      subtotal: 3600.00,
      insurance: 180.00,
      serviceFee: 120.00,
      tax: 380.00,
      total: 4280.00,
      currency: "$"
    },
    
    paymentMethod: "Credit Card ****1234",
    transactionId: "TXN-RC-789654123",
    status: "Confirmed"
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implementation for PDF download
    console.log('Downloading PDF...');
    // You can integrate with libraries like jsPDF or html2pdf here
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <RoyalCarBill 
          bookingData={sampleBooking}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

export default BillPage;
