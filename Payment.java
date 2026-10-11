public class Payment {

    String paymentId;
    Rental rental;
    double amount;
    String paymentMethod;
    String paymentStatus;
    String paymentDate;

    // Constructor
    Payment(String paymentId, Rental rental,
            double amount, String paymentMethod,
            String paymentDate) {

        this.paymentId = paymentId;
        this.rental = rental;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentDate = paymentDate;
        this.paymentStatus = "Paid";
    }

    // Display payment details
    void displayPayment() {

        System.out.println("Payment ID: " + paymentId);
        System.out.println("Rental ID: " + rental.rentalId);
        System.out.println("Customer: " + rental.customer.name);
        System.out.println("Amount: Rs." + amount);
        System.out.println("Payment Method: " + paymentMethod);
        System.out.println("Payment Status: " + paymentStatus);
        System.out.println("Payment Date: " + paymentDate);
    }
}