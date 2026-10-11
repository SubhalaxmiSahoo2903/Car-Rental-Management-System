import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Scanner;

public class CarRentalSystem {

    static ArrayList<Car> cars = new ArrayList<>();
    static ArrayList<Customer> customers = new ArrayList<>();
    static ArrayList<Rental> rentals = new ArrayList<>();
    static ArrayList<Payment> payments = new ArrayList<>();

    static Scanner sc = new Scanner(System.in);


    // =========================================================
    // LOAD CARS FROM ORACLE
    // =========================================================

    static void loadCars() {

        try {

            Connection con = DatabaseConnection.getConnection();

            Statement stmt = con.createStatement();

            ResultSet rs = stmt.executeQuery(
                    "SELECT registration, brand, model, type, rate, status FROM cars"
            );

            cars.clear();

            while (rs.next()) {

                String registration = rs.getString("registration");
                String brand = rs.getString("brand");
                String model = rs.getString("model");
                String type = rs.getString("type");
                double rate = rs.getDouble("rate");

                String status = rs.getString("status");

                boolean available =
                        status.equalsIgnoreCase("Available");

                Car car = new Car(
                        registration,
                        brand,
                        model,
                        type,
                        rate,
                        available
                );

                cars.add(car);
            }

            rs.close();
            stmt.close();
            con.close();

            System.out.println(
                    "Cars loaded from Oracle Database."
            );

        } catch (Exception e) {

            System.out.println(
                    "Error loading cars from Oracle Database."
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // LOAD CUSTOMERS FROM ORACLE
    
    // =========================================================

    static void loadCustomers() {

        try {

            Connection con =
                    DatabaseConnection.getConnection();

            Statement stmt =
                    con.createStatement();

            ResultSet rs =
                    stmt.executeQuery(
                            "SELECT customer_id, name, contact, license FROM customers"
                    );

            customers.clear();

            while (rs.next()) {

                Customer customer =
                        new Customer(
                                rs.getString("customer_id"),
                                rs.getString("name"),
                                rs.getString("contact"),
                                rs.getString("license")
                        );

                customers.add(customer);
            }

            rs.close();
            stmt.close();
            con.close();

            System.out.println(
                    "Customers loaded from Oracle Database."
            );

        } catch (Exception e) {

            System.out.println(
                    "Error loading customers from Oracle Database."
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // VIEW CARS
    // =========================================================

    static void viewCars() {

        System.out.println(
                "\n========== CAR LIST =========="
        );

        if (cars.isEmpty()) {

            System.out.println("No cars found.");

            return;
        }

        for (Car car : cars) {

            System.out.println(
                    "------------------------------"
            );

            car.displayCar();

            System.out.println(
                    "Status: "
                    + (car.available
                    ? "Available"
                    : "Rented")
            );
        }
    }


    // =========================================================
    // REGISTER CUSTOMER
    // =========================================================

    static void registerCustomer() {

        System.out.println(
                "\n========== REGISTER CUSTOMER =========="
        );

        System.out.print("Enter Customer ID: ");

        String id =
                sc.nextLine().trim();


        // Check duplicate ID in database

        try {

            Connection con =
                    DatabaseConnection.getConnection();

            String checkSql =
                    "SELECT customer_id FROM customers WHERE customer_id = ?";

            PreparedStatement checkPs =
                    con.prepareStatement(checkSql);

            checkPs.setString(1, id);

            ResultSet rs =
                    checkPs.executeQuery();

            if (rs.next()) {

                System.out.println(
                        "Customer ID already exists!"
                );

                rs.close();
                checkPs.close();
                con.close();

                return;
            }

            rs.close();
            checkPs.close();
            con.close();

        } catch (Exception e) {

            System.out.println(
                    "Error checking customer ID."
            );

            e.printStackTrace();

            return;
        }


        // Name

        System.out.print("Enter Name: ");

        String name =
                sc.nextLine().trim();

        if (name.isEmpty()) {

            System.out.println(
                    "Name cannot be empty."
            );

            return;
        }


        // Contact

        String contact;

        while (true) {

            System.out.print(
                    "Enter 10-digit Contact Number: "
            );

            contact =
                    sc.nextLine().trim();

            if (contact.matches("[0-9]{10}")) {

                break;
            }

            System.out.println(
                    "Invalid contact number!"
            );
        }


        // Driving License

        String license;

        while (true) {

            System.out.print(
                    "Enter Driving License Number "
                    + "(Ex: OD-02-2020-0012345): "
            );

            license =
                    sc.nextLine()
                      .trim()
                      .toUpperCase();

            if (license.matches(
                    "[A-Z]{2}-[0-9]{2}-[0-9]{4}-[0-9]{7}"
            )) {

                break;
            }

            System.out.println(
                    "Invalid driving license number!"
            );
        }


        // Save customer in Oracle

        try {

            Connection con =
                    DatabaseConnection.getConnection();

            String sql =
                    "INSERT INTO customers "
                    + "(customer_id, name, contact, license) "
                    + "VALUES (?, ?, ?, ?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setString(1, id);
            ps.setString(2, name);
            ps.setString(3, contact);
            ps.setString(4, license);

            ps.executeUpdate();

            ps.close();
            con.close();

            Customer customer =
                    new Customer(
                            id,
                            name,
                            contact,
                            license
                    );

            customers.add(customer);

            System.out.println(
                    "\nCustomer registered successfully!"
            );

            System.out.println(
                    "Customer saved in Oracle Database."
            );

        } catch (Exception e) {

            System.out.println(
                    "Error saving customer."
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // VIEW CUSTOMERS
    // =========================================================

    static void viewCustomers() {

        loadCustomers();

        System.out.println(
                "\n========== CUSTOMER LIST =========="
        );

        if (customers.isEmpty()) {

            System.out.println(
                    "No customers registered."
            );

            return;
        }

        for (Customer customer : customers) {

            System.out.println(
                    "------------------------------"
            );

            customer.displayCustomer();
        }
    }


    // =========================================================
    // SEARCH AVAILABLE CARS
    // =========================================================

    static void searchAvailableCars() {

        loadCars();

        System.out.println(
                "\n========== AVAILABLE CARS =========="
        );

        boolean found = false;

        for (Car car : cars) {

            if (car.available) {

                System.out.println(
                        "------------------------------"
                );

                car.displayCar();

                found = true;
            }
        }

        if (!found) {

            System.out.println(
                    "No cars are currently available."
            );
        }
    }


    // =========================================================
    // RENT / BOOK CAR
    // =========================================================

    static void rentCar() {

        System.out.println(
                "\n========== RENT / BOOK CAR =========="
        );

        loadCustomers();

        loadCars();


        if (customers.isEmpty()) {

            System.out.println(
                    "Please register a customer first."
            );

            return;
        }


        viewCustomers();

        System.out.print(
                "\nEnter Customer ID: "
        );

        String customerId =
                sc.nextLine().trim();

        Customer selectedCustomer =
                null;


        for (Customer customer : customers) {

            if (customer.customerId
                    .equalsIgnoreCase(customerId)) {

                selectedCustomer =
                        customer;

                break;
            }
        }


        if (selectedCustomer == null) {

            System.out.println(
                    "Customer not found."
            );

            return;
        }


        searchAvailableCars();


        System.out.print(
                "\nEnter Car Registration Number: "
        );

        String registration =
                sc.nextLine().trim();

        Car selectedCar =
                null;


        for (Car car : cars) {

            if (car.registration
                    .equalsIgnoreCase(registration)
                    && car.available) {

                selectedCar =
                        car;

                break;
            }
        }


        if (selectedCar == null) {

            System.out.println(
                    "Car not found or car is not available."
            );

            return;
        }


        System.out.print(
                "Enter Start Date (YYYY-MM-DD): "
        );

        String startDate =
                sc.nextLine().trim();


        System.out.print(
                "Enter Return Date (YYYY-MM-DD): "
        );

        String returnDate =
                sc.nextLine().trim();


        int days;

        while (true) {

            System.out.print(
                    "Enter Number of Days: "
            );

            if (sc.hasNextInt()) {

                days =
                        sc.nextInt();

                sc.nextLine();

                if (days > 0) {

                    break;
                }

                System.out.println(
                        "Number of days must be greater than 0."
                );

            } else {

                System.out.println(
                        "Please enter a valid number."
                );

                sc.nextLine();
            }
        }


        double totalCharge =
                selectedCar.rate * days;


        // Generate Rental ID

        String rentalId =
                generateRentalId();


        // Save rental in Oracle

        try {

            Connection con =
                    DatabaseConnection.getConnection();


            String sql =
                    "INSERT INTO rentals "
                    + "(rental_id, customer_id, registration, "
                    + "start_date, return_date, days, "
                    + "total_charge, status) "
                    + "VALUES (?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'), "
                    + "TO_DATE(?, 'YYYY-MM-DD'), ?, ?, ?)";


            PreparedStatement ps =
                    con.prepareStatement(sql);


            ps.setString(1, rentalId);
            ps.setString(2, selectedCustomer.customerId);
            ps.setString(3, selectedCar.registration);
            ps.setString(4, startDate);
            ps.setString(5, returnDate);
            ps.setInt(6, days);
            ps.setDouble(7, totalCharge);
            ps.setString(8, "Active");


            ps.executeUpdate();


            // Update car status

            String carSql =
                    "UPDATE cars "
                    + "SET status = 'Rented' "
                    + "WHERE registration = ?";


            PreparedStatement carPs =
                    con.prepareStatement(carSql);


            carPs.setString(
                    1,
                    selectedCar.registration
            );

            carPs.executeUpdate();


            con.commit();


            ps.close();
            carPs.close();
            con.close();


            selectedCar.available =
                    false;


            Rental rental =
                    new Rental(
                            rentalId,
                            selectedCustomer,
                            selectedCar,
                            startDate,
                            returnDate,
                            days,
                            totalCharge
                    );


            rentals.add(rental);


            System.out.println(
                    "\n========== BOOKING SUCCESSFUL =========="
            );

            System.out.println(
                    "Rental ID: " + rentalId
            );

            System.out.println(
                    "Customer: "
                    + selectedCustomer.name
            );

            System.out.println(
                    "Car: "
                    + selectedCar.brand
                    + " "
                    + selectedCar.model
            );

            System.out.println(
                    "Start Date: "
                    + startDate
            );

            System.out.println(
                    "Return Date: "
                    + returnDate
            );

            System.out.println(
                    "Number of Days: "
                    + days
            );

            System.out.println(
                    "Rental Rate: Rs."
                    + selectedCar.rate
            );

            System.out.println(
                    "Total Charge: Rs."
                    + totalCharge
            );

            System.out.println(
                    "Payment Status: Pending"
            );

        } catch (Exception e) {

            System.out.println(
                    "Error saving rental."
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // GENERATE RENTAL ID
    // =========================================================

    static String generateRentalId() {

        int nextId = 1;

        try {

            Connection con =
                    DatabaseConnection.getConnection();

            Statement stmt =
                    con.createStatement();

            ResultSet rs =
                    stmt.executeQuery(
                            "SELECT COUNT(*) FROM rentals"
                    );

            if (rs.next()) {

                nextId =
                        rs.getInt(1) + 1;
            }

            rs.close();
            stmt.close();
            con.close();

        } catch (Exception e) {

            System.out.println(
                    "Error generating rental ID."
            );
        }

        return "R"
                + String.format("%03d", nextId);
    }


    // =========================================================
    // RETURN CAR
    // =========================================================

    static void returnCar() {

        System.out.println(
                "\n========== RETURN CAR =========="
        );


        loadCars();


        try {

            Connection con =
                    DatabaseConnection.getConnection();

            Statement stmt =
                    con.createStatement();

            ResultSet rs =
                    stmt.executeQuery(
                            "SELECT rental_id, customer_id, "
                            + "registration, start_date, "
                            + "return_date, days, "
                            + "total_charge, status "
                            + "FROM rentals "
                            + "WHERE status = 'Active'"
                    );


            boolean found =
                    false;


            while (rs.next()) {

                found = true;

                System.out.println(
                        "------------------------------"
                );

                System.out.println(
                        "Rental ID: "
                        + rs.getString("rental_id")
                );

                System.out.println(
                        "Customer ID: "
                        + rs.getString("customer_id")
                );

                System.out.println(
                        "Car Registration: "
                        + rs.getString("registration")
                );

                System.out.println(
                        "Days: "
                        + rs.getInt("days")
                );

                System.out.println(
                        "Total Charge: Rs."
                        + rs.getDouble("total_charge")
                );

                System.out.println(
                        "Status: "
                        + rs.getString("status")
                );
            }


            rs.close();
            stmt.close();


            if (!found) {

                con.close();

                System.out.println(
                        "No active rentals."
                );

                return;
            }


            System.out.print(
                    "\nEnter Rental ID: "
            );

            String rentalId =
                    sc.nextLine().trim();


            String findSql =
                    "SELECT registration "
                    + "FROM rentals "
                    + "WHERE rental_id = ? "
                    + "AND status = 'Active'";


            PreparedStatement findPs =
                    con.prepareStatement(findSql);

            findPs.setString(1, rentalId);


            ResultSet findRs =
                    findPs.executeQuery();


            if (!findRs.next()) {

                System.out.println(
                        "Active rental not found."
                );

                findRs.close();
                findPs.close();
                con.close();

                return;
            }


            String registration =
                    findRs.getString("registration");


            findRs.close();
            findPs.close();


            // Update rental

            String rentalSql =
                    "UPDATE rentals "
                    + "SET status = 'Completed' "
                    + "WHERE rental_id = ?";


            PreparedStatement rentalPs =
                    con.prepareStatement(rentalSql);


            rentalPs.setString(1, rentalId);

            rentalPs.executeUpdate();


            // Update car

            String carSql =
                    "UPDATE cars "
                    + "SET status = 'Available' "
                    + "WHERE registration = ?";


            PreparedStatement carPs =
                    con.prepareStatement(carSql);


            carPs.setString(
                    1,
                    registration
            );

            carPs.executeUpdate();


            con.commit();


            rentalPs.close();
            carPs.close();
            con.close();


            System.out.println(
                    "\nCar returned successfully!"
            );

            System.out.println(
                    "Rental ID: "
                    + rentalId
            );

            System.out.println(
                    "Car Registration: "
                    + registration
            );


        } catch (Exception e) {

            System.out.println(
                    "Error returning car."
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // MAKE PAYMENT
    // =========================================================

    static void makePayment() {

        System.out.println(
                "\n========== PAYMENT =========="
        );


        try {

            Connection con =
                    DatabaseConnection.getConnection();


            Statement stmt =
                    con.createStatement();


            ResultSet rs =
                    stmt.executeQuery(
                            "SELECT r.rental_id, "
                            + "c.name, "
                            + "r.total_charge "
                            + "FROM rentals r "
                            + "JOIN customers c "
                            + "ON r.customer_id = c.customer_id "
                            + "WHERE r.status = 'Active' "
                            + "AND NOT EXISTS "
                            + "(SELECT 1 FROM payments p "
                            + "WHERE p.rental_id = r.rental_id)"
                    );


            boolean found =
                    false;


            while (rs.next()) {

                found = true;

                System.out.println(
                        "------------------------------"
                );

                System.out.println(
                        "Rental ID: "
                        + rs.getString("rental_id")
                );

                System.out.println(
                        "Customer: "
                        + rs.getString("name")
                );

                System.out.println(
                        "Amount: Rs."
                        + rs.getDouble("total_charge")
                );
            }


            rs.close();
            stmt.close();


            if (!found) {

                con.close();

                System.out.println(
                        "No pending payments available."
                );

                return;
            }


            System.out.print(
                    "\nEnter Rental ID: "
            );

            String rentalId =
                    sc.nextLine().trim();


            // Get rental details

            String rentalSql =
                    "SELECT r.rental_id, "
                    + "r.total_charge, "
                    + "c.customer_id, "
                    + "c.name "
                    + "FROM rentals r "
                    + "JOIN customers c "
                    + "ON r.customer_id = c.customer_id "
                    + "WHERE r.rental_id = ? "
                    + "AND r.status = 'Active'";


            PreparedStatement rentalPs =
                    con.prepareStatement(rentalSql);


            rentalPs.setString(
                    1,
                    rentalId
            );


            ResultSet rentalRs =
                    rentalPs.executeQuery();


            if (!rentalRs.next()) {

                System.out.println(
                        "Active rental not found."
                );

                rentalRs.close();
                rentalPs.close();
                con.close();

                return;
            }


            double amount =
                    rentalRs.getDouble(
                            "total_charge"
                    );


            String customerName =
                    rentalRs.getString("name");


            rentalRs.close();
            rentalPs.close();


            System.out.println(
                    "\nSelect Payment Method:"
            );

            System.out.println(
                    "1. Cash"
            );

            System.out.println(
                    "2. UPI"
            );

            System.out.println(
                    "3. Debit Card"
            );

            System.out.println(
                    "4. Credit Card"
            );

            System.out.println(
                    "5. Net Banking"
            );


            System.out.print(
                    "Enter choice: "
            );


            int choice;


            if (sc.hasNextInt()) {

                choice =
                        sc.nextInt();

                sc.nextLine();

            } else {

                System.out.println(
                        "Invalid choice."
                );

                sc.nextLine();

                con.close();

                return;
            }


            String method;


            switch (choice) {

                case 1:

                    method = "Cash";

                    break;

                case 2:

                    method = "UPI";

                    break;

                case 3:

                    method = "Debit Card";

                    break;

                case 4:

                    method = "Credit Card";

                    break;

                case 5:

                    method = "Net Banking";

                    break;

                default:

                    System.out.println(
                            "Invalid payment method."
                    );

                    con.close();

                    return;
            }


            String paymentId =
                    generatePaymentId();


            String paymentDate =
                    java.time.LocalDate
                    .now()
                    .toString();


            String paymentSql =
                    "INSERT INTO payments "
                    + "(payment_id, rental_id, amount, "
                    + "payment_method, payment_status, "
                    + "payment_date) "
                    + "VALUES (?, ?, ?, ?, ?, "
                    + "TO_DATE(?, 'YYYY-MM-DD'))";


            PreparedStatement paymentPs =
                    con.prepareStatement(paymentSql);


            paymentPs.setString(
                    1,
                    paymentId
            );

            paymentPs.setString(
                    2,
                    rentalId
            );

            paymentPs.setDouble(
                    3,
                    amount
            );

            paymentPs.setString(
                    4,
                    method
            );

            paymentPs.setString(
                    5,
                    "Paid"
            );

            paymentPs.setString(
                    6,
                    paymentDate
            );


            paymentPs.executeUpdate();


            con.commit();


            paymentPs.close();
            con.close();


            System.out.println(
                    "\n========== PAYMENT SUCCESSFUL =========="
            );

            System.out.println(
                    "Payment ID: "
                    + paymentId
            );

            System.out.println(
                    "Rental ID: "
                    + rentalId
            );

            System.out.println(
                    "Customer: "
                    + customerName
            );

            System.out.println(
                    "Amount: Rs."
                    + amount
            );

            System.out.println(
                    "Payment Method: "
                    + method
            );

            System.out.println(
                    "Payment Status: Paid"
            );

            System.out.println(
                    "Payment Date: "
                    + paymentDate
            );


        } catch (Exception e) {

            System.out.println(
                    "Error processing payment."
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // GENERATE PAYMENT ID
    // =========================================================

    static String generatePaymentId() {

        int nextId = 1;

        try {

            Connection con =
                    DatabaseConnection.getConnection();

            Statement stmt =
                    con.createStatement();

            ResultSet rs =
                    stmt.executeQuery(
                            "SELECT COUNT(*) FROM payments"
                    );


            if (rs.next()) {

                nextId =
                        rs.getInt(1) + 1;
            }


            rs.close();
            stmt.close();
            con.close();


        } catch (Exception e) {

            System.out.println(
                    "Error generating payment ID."
            );
        }


        return "P"
                + String.format(
                        "%03d",
                        nextId
                );
    }


    // =========================================================
    // RENTAL HISTORY
    // =========================================================

    static void rentalHistory() {

        System.out.println(
                "\n========== RENTAL HISTORY =========="
        );


        try {

            Connection con =
                    DatabaseConnection.getConnection();


            String sql =
                    "SELECT r.rental_id, "
                    + "c.name, "
                    + "r.registration, "
                    + "r.start_date, "
                    + "r.return_date, "
                    + "r.days, "
                    + "r.total_charge, "
                    + "r.status, "
                    + "p.payment_method, "
                    + "p.payment_status, "
                    + "p.payment_date "
                    + "FROM rentals r "
                    + "JOIN customers c "
                    + "ON r.customer_id = c.customer_id "
                    + "LEFT JOIN payments p "
                    + "ON r.rental_id = p.rental_id "
                    + "ORDER BY r.rental_id";


            Statement stmt =
                    con.createStatement();


            ResultSet rs =
                    stmt.executeQuery(sql);


            boolean found =
                    false;


            while (rs.next()) {

                found = true;


                System.out.println(
                        "------------------------------"
                );


                System.out.println(
                        "Rental ID: "
                        + rs.getString("rental_id")
                );


                System.out.println(
                        "Customer: "
                        + rs.getString("name")
                );


                System.out.println(
                        "Car Registration: "
                        + rs.getString("registration")
                );


                System.out.println(
                        "Start Date: "
                        + rs.getDate("start_date")
                );


                System.out.println(
                        "Return Date: "
                        + rs.getDate("return_date")
                );


                System.out.println(
                        "Number of Days: "
                        + rs.getInt("days")
                );


                System.out.println(
                        "Total Charge: Rs."
                        + rs.getDouble("total_charge")
                );


                System.out.println(
                        "Rental Status: "
                        + rs.getString("status")
                );


                String paymentStatus =
                        rs.getString("payment_status");


                if (paymentStatus != null) {

                    System.out.println(
                            "Payment Status: "
                            + paymentStatus
                    );

                    System.out.println(
                            "Payment Method: "
                            + rs.getString(
                                    "payment_method"
                            )
                    );

                    System.out.println(
                            "Payment Date: "
                            + rs.getDate(
                                    "payment_date"
                            )
                    );

                } else {

                    System.out.println(
                            "Payment Status: Pending"
                    );
                }
            }


            if (!found) {

                System.out.println(
                        "No rental records available."
                );
            }


            rs.close();
            stmt.close();
            con.close();


        } catch (Exception e) {

            System.out.println(
                    "Error loading rental history."
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // MAIN METHOD
    // =========================================================

    public static void main(String[] args) {

        // Load database data when program starts

        loadCars();

        loadCustomers();


        int choice;


        do {

            System.out.println("\n");

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "       CAR RENTAL MANAGEMENT SYSTEM"
            );

            System.out.println(
                    "======================================"
            );


            System.out.println(
                    "1. View Cars"
            );

            System.out.println(
                    "2. Register Customer"
            );

            System.out.println(
                    "3. View Customers"
            );

            System.out.println(
                    "4. Search Available Cars"
            );

            System.out.println(
                    "5. Rent / Book Car"
            );

            System.out.println(
                    "6. Return Car"
            );

            System.out.println(
                    "7. Make Payment"
            );

            System.out.println(
                    "8. View Rental History"
            );

            System.out.println(
                    "9. Exit"
            );


            System.out.print(
                    "\nEnter your choice: "
            );


            if (sc.hasNextInt()) {

                choice =
                        sc.nextInt();

                sc.nextLine();

            } else {

                System.out.println(
                        "Please enter a number from 1 to 9."
                );

                sc.nextLine();

                choice = 0;
            }


            switch (choice) {

                case 1:

                    viewCars();

                    break;


                case 2:

                    registerCustomer();

                    break;


                case 3:

                    viewCustomers();

                    break;


                case 4:

                    searchAvailableCars();

                    break;


                case 5:

                    rentCar();

                    break;


                case 6:

                    returnCar();

                    break;


                case 7:

                    makePayment();

                    break;


                case 8:

                    rentalHistory();

                    break;


                case 9:

                    System.out.println(
                            "\nThank you for using the Car Rental System!"
                    );

                    break;


                default:

                    System.out.println(
                            "\nInvalid choice. Please try again."
                    );
            }


        } while (choice != 9);


        sc.close();
    }
}