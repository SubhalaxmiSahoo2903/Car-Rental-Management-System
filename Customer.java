public class Customer {

    String customerId;
    String name;
    String contact;
    String license;

    // Constructor
    Customer(String customerId, String name,
             String contact, String license) {

        this.customerId = customerId;
        this.name = name;
        this.contact = contact;
        this.license = license;
    }

    // Display customer details
    void displayCustomer() {

        System.out.println("Customer ID: " + customerId);
        System.out.println("Name: " + name);
        System.out.println("Contact: " + contact);
        System.out.println("Driving License: " + license);
    }
}