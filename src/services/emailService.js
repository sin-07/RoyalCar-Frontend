// Email service for sending invoices
import axios from 'axios';

class EmailService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  // Send invoice email to customer
  async sendInvoiceEmail(bookingData, customerEmail) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/email/send-invoice`, {
        bookingData,
        customerEmail,
        emailType: 'invoice'
      });

      return {
        success: true,
        message: 'Invoice sent successfully!',
        data: response.data
      };
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send invoice email',
        error: error
      };
    }
  }

  // Send booking confirmation email
  async sendBookingConfirmation(bookingData, customerEmail) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/email/send-confirmation`, {
        bookingData,
        customerEmail,
        emailType: 'confirmation'
      });

      return {
        success: true,
        message: 'Booking confirmation sent successfully!',
        data: response.data
      };
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send confirmation email',
        error: error
      };
    }
  }

  // Send payment receipt email
  async sendPaymentReceipt(paymentData, customerEmail) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/email/send-receipt`, {
        paymentData,
        customerEmail,
        emailType: 'receipt'
      });

      return {
        success: true,
        message: 'Payment receipt sent successfully!',
        data: response.data
      };
    } catch (error) {
      console.error('Error sending receipt email:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send receipt email',
        error: error
      };
    }
  }
}

export default new EmailService();
