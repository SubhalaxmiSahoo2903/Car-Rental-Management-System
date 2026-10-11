public class Car {

    String registration;
    String brand;
    String model;
    String type;
    double rate;
    boolean available;

    // Constructor
    Car(String registration, String brand, String model,
        String type, double rate, boolean available) {

        this.registration = registration;
        this.brand = brand;
        this.model = model;
        this.type = type;
        this.rate = rate;
        this.available = available;
    }

    // Display car details
    void displayCar() {

        System.out.println("Registration No: " + registration);
        System.out.println("Brand: " + brand);
        System.out.println("Model: " + model);
        System.out.println("Type: " + type);
        System.out.println("Rental Rate: Rs." + rate);
        System.out.println("Available: " + available);
    }
}