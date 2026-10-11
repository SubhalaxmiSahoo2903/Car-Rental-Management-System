public class Rental {

    String rentalId;
    Customer customer;
    Car car;
    String startDate;
    String returnDate;
    int days;
    double totalCharge;
    String status;

    // Constructor
    Rental(String rentalId, Customer customer, Car car,
           String startDate, String returnDate,
           int days, double totalCharge) {

        this.rentalId = rentalId;
        this.customer = customer;
        this.car = car;
        this.startDate = startDate;
        this.returnDate = returnDate;
        this.days = days;
        this.totalCharge = totalCharge;
        this.status = "Active";
    }

    // Constructor with status
    Rental(String rentalId, Customer customer, Car car,
           String startDate, String returnDate,
           int days, double totalCharge, String status) {

        this.rentalId = rentalId;
        this.customer = customer;
        this.car = car;
        this.startDate = startDate;
        this.returnDate = returnDate;
        this.days = days;
        this.totalCharge = totalCharge;
        this.status = status;
    }

    // Calculate rental charge
    double calculateCharge() {

        return car.rate * days;
    }

    // Display rental details
    void displayRental() {

        System.out.println("Rental ID: " + rentalId);
        System.out.println("Customer: " + customer.name);
        System.out.println("Car: " + car.brand + " " + car.model);
        System.out.println("Start Date: " + startDate);
        System.out.println("Return Date: " + returnDate);
        System.out.println("Number of Days: " + days);
        System.out.println("Total Charge: Rs." + totalCharge);
        System.out.println("Status: " + status);
    }
}