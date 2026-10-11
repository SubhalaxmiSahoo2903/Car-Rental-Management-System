// ======================================================
// CAR RENTAL SYSTEM - COMPLETE JAVASCRIPT
// ======================================================


// ======================================================
// 1. FIXED CAR INVENTORY
// ======================================================

const defaultCars = [

    {
        registration: "OD02AB1234",
        brand: "Maruti",
        model: "Swift",
        type: "Hatchback",
        rate: 1500,
        status: "Available",
        image: "images/swift.jpg"
    },

    {
        registration: "OD02CD5678",
        brand: "Hyundai",
        model: "Creta",
        type: "SUV",
        rate: 2500,
        status: "Available",
        image: "images/creta.jpg"
    },

    {
        registration: "OD02EF9012",
        brand: "Honda",
        model: "City",
        type: "Sedan",
        rate: 2200,
        status: "Rented",
        image: "images/city.jpg"
    },

    {
        registration: "OD02GH3456",
        brand: "Toyota",
        model: "Innova",
        type: "MUV",
        rate: 3000,
        status: "Available",
        image: "images/innova.jpg"
    },

    {
        registration: "OD02IJ7890",
        brand: "Tata",
        model: "Nexon",
        type: "SUV",
        rate: 2000,
        status: "Available",
        image: "images/nexon.jpg"
    },

    {
        registration: "OD02KL2468",
        brand: "Mahindra",
        model: "Thar",
        type: "SUV",
        rate: 2800,
        status: "Rented",
        image: "images/thar.jpg"
    },

    {
        registration: "OD02MN1357",
        brand: "Maruti",
        model: "Baleno",
        type: "Hatchback",
        rate: 1700,
        status: "Available",
        image: "images/baleno.jpg"
    },

    {
        registration: "OD02PQ8024",
        brand: "Hyundai",
        model: "Verna",
        type: "Sedan",
        rate: 2300,
        status: "Available",
        image: "images/verna.jpg"
    },

    {
        registration: "OD02RS4680",
        brand: "Kia",
        model: "Carens",
        type: "MUV",
        rate: 2700,
        status: "Available",
        image: "images/carens.jpg"
    },

    {
        registration: "OD02TU9753",
        brand: "Tata",
        model: "Punch",
        type: "Compact SUV",
        rate: 1800,
        status: "Available",
        image: "images/punch.jpg"
    }

];


// ======================================================
// 2. CUSTOMER STORAGE
// ======================================================

function getCustomers() {

    const customers =
        localStorage.getItem("customers");

    if (customers) {

        return JSON.parse(customers);

    }

    return [];

}


function saveCustomers(customers) {

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

}


// ======================================================
// 3. REGISTER CUSTOMER
// ======================================================

function registerCustomer(event) {

    event.preventDefault();

    const customerId =
        document.getElementById("customerId").value.trim();

    const customerName =
        document.getElementById("customerName").value.trim();

    const contactNumber =
        document.getElementById("contactNumber").value.trim();

    const licenseNumber =
        document.getElementById("licenseNumber").value.trim();


    if (
        customerId === "" ||
        customerName === "" ||
        contactNumber === "" ||
        licenseNumber === ""
    ) {

        alert("Please fill all customer details.");

        return;

    }


    const customers = getCustomers();


    // Check duplicate Customer ID

    const existingCustomer = customers.find(
        customer =>
            customer.id.toLowerCase() ===
            customerId.toLowerCase()
    );


    if (existingCustomer) {

        alert("Customer ID already exists.");

        return;

    }


    // Check contact number

    if (!/^\d{10}$/.test(contactNumber)) {

        alert(
            "Please enter a valid 10-digit contact number."
        );

        return;

    }


    const newCustomer = {

        id: customerId,

        name: customerName,

        contact: contactNumber,

        license: licenseNumber,

        status: "Registered"

    };


    customers.push(newCustomer);

    saveCustomers(customers);


    alert("Customer registered successfully!");


    document.getElementById("customerForm").reset();


    displayCustomers();

    loadBookingCustomers();

}


// ======================================================
// 4. DISPLAY CUSTOMERS
// ======================================================

function displayCustomers() {

    const tableBody =
        document.getElementById("customerTableBody");


    if (!tableBody) {

        return;

    }


    const customers = getCustomers();


    tableBody.innerHTML = "";


    if (customers.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No customers registered yet.
                </td>
            </tr>
        `;

        return;

    }


    customers.forEach((customer, index) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${customer.id}</td>

            <td>${customer.name}</td>

            <td>${customer.contact}</td>

            <td>${customer.license}</td>

            <td>
                <span class="registered-status">
                    ${customer.status}
                </span>
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editCustomer(${index})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteCustomer(${index})">
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ======================================================
// 5. DELETE CUSTOMER
// ======================================================

function deleteCustomer(index) {

    const customers = getCustomers();

    const customer = customers[index];

    const rentals = getRentals();


    const activeRental = rentals.find(
        rental =>
            rental.customerId === customer.id &&
            rental.status === "Active"
    );


    if (activeRental) {

        alert(
            "This customer has an active rental and cannot be deleted."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this customer?"
        );


    if (!confirmDelete) {

        return;

    }


    customers.splice(index, 1);

    saveCustomers(customers);


    displayCustomers();

    loadBookingCustomers();


    alert("Customer deleted successfully.");

}


// ======================================================
// 6. EDIT CUSTOMER
// ======================================================

function editCustomer(index) {

    const customers = getCustomers();

    const customer = customers[index];


    const newName =
        prompt(
            "Enter Customer Name:",
            customer.name
        );


    if (
        newName === null ||
        newName.trim() === ""
    ) {

        return;

    }


    const newContact =
        prompt(
            "Enter Contact Number:",
            customer.contact
        );


    if (
        newContact === null ||
        !/^\d{10}$/.test(newContact)
    ) {

        alert(
            "Please enter a valid 10-digit contact number."
        );

        return;

    }


    const newLicense =
        prompt(
            "Enter Driving License Number:",
            customer.license
        );


    if (
        newLicense === null ||
        newLicense.trim() === ""
    ) {

        return;

    }


    customer.name =
        newName.trim();

    customer.contact =
        newContact.trim();

    customer.license =
        newLicense.trim();


    saveCustomers(customers);


    displayCustomers();

    loadBookingCustomers();


    alert(
        "Customer information updated."
    );

}


// ======================================================
// 7. SEARCH CUSTOMERS
// ======================================================

function searchCustomers() {

    const searchInput =
        document.getElementById("customerSearch");

    const tableBody =
        document.getElementById("customerTableBody");


    if (!searchInput || !tableBody) {

        return;

    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const customers =
        getCustomers();


    const filteredCustomers =
        customers.filter(customer =>

            customer.id
                .toLowerCase()
                .includes(searchText)

            ||

            customer.name
                .toLowerCase()
                .includes(searchText)

            ||

            customer.contact
                .toLowerCase()
                .includes(searchText)

            ||

            customer.license
                .toLowerCase()
                .includes(searchText)

        );


    tableBody.innerHTML = "";


    if (filteredCustomers.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No matching customer found.
                </td>
            </tr>
        `;

        return;

    }


    filteredCustomers.forEach(customer => {

        const originalIndex =
            customers.indexOf(customer);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${customer.id}</td>

            <td>${customer.name}</td>

            <td>${customer.contact}</td>

            <td>${customer.license}</td>

            <td>
                <span class="registered-status">
                    ${customer.status}
                </span>
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editCustomer(${originalIndex})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteCustomer(${originalIndex})">
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ======================================================
// 8. CAR STORAGE
// ======================================================

function getCars() {

    const cars =
        localStorage.getItem("cars");


    if (cars) {

        return JSON.parse(cars);

    }


    localStorage.setItem(
        "cars",
        JSON.stringify(defaultCars)
    );


    return defaultCars;

}


// ======================================================
// 9. SAVE CARS
// ======================================================

function saveCars(cars) {

    localStorage.setItem(
        "cars",
        JSON.stringify(cars)
    );

}


// ======================================================
// 10. DISPLAY ALL CARS
// ======================================================

function displayCars(carsToDisplay = null) {

    const container =
        document.getElementById("carTableBody");

    if (!container) {
        return;
    }

    const cars =
        carsToDisplay || getCars();

    container.innerHTML = "";

    if (cars.length === 0) {

        container.innerHTML = `
            <div class="no-results">
                <div style="font-size:40px;">🚗</div>
                <h3>No Cars Found</h3>
                <p>
                    Try searching with another registration number,
                    brand, model or type.
                </p>
            </div>
        `;

        return;
    }

    cars.forEach(car => {

        const isAvailable =
            String(car.status).toLowerCase() === "available";

        const statusClass =
            isAvailable
                ? "status-available"
                : "status-rented";

        const image =
            car.image || getCarImage(car.registration);

        let actionHTML;

        if (isAvailable) {

            actionHTML = `
                <a
                    href="booking.html?car=${encodeURIComponent(car.registration)}"
                    class="book-btn">
                    Book Now
                </a>
            `;

        } else {

            actionHTML = `
                <button
                    class="book-btn disabled"
                    type="button"
                    disabled>
                    Currently Rented
                </button>
            `;

        }

        container.innerHTML += `

            <div class="car-card">

                <div class="car-image">

                    <img
                        src="${image}"
                        alt="${car.brand} ${car.model}"
                        onerror="this.onerror=null; this.src='images/car-placeholder.jpg';"
                    >

                    <span class="car-status ${statusClass}">
                        ${car.status}
                    </span>

                </div>

                <div class="car-details">

                    <div class="car-brand">
                        ${car.brand}
                    </div>

                    <h3 class="car-name">
                        ${car.model}
                    </h3>

                    <div class="car-meta">

                        <div class="car-meta-item">
                            <span class="car-meta-label">
                                Registration
                            </span>

                            <span class="car-meta-value">
                                ${car.registration}
                            </span>
                        </div>

                        <div class="car-meta-item">
                            <span class="car-meta-label">
                                Type
                            </span>

                            <span class="car-meta-value">
                                ${car.type}
                            </span>
                        </div>

                    </div>

                    <div class="car-price">

                        <div>
                            <div class="price-label">
                                Rental Rate
                            </div>

                            <div class="price">
                                ₹${Number(car.rate).toLocaleString("en-IN")}
                                <span>/ day</span>
                            </div>
                        </div>

                    </div>

                    ${actionHTML}

                </div>

            </div>
        `;

    });

}


// ======================================================
// 11. SEARCH CARS
// ======================================================

function searchCars() {

    const searchInput =
        document.getElementById("carSearch");

    if (!searchInput) {
        return;
    }

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const cars =
        getCars();

    const filteredCars =
        cars.filter(car =>

            String(car.registration).toLowerCase().includes(searchText)

            ||

            String(car.brand).toLowerCase().includes(searchText)

            ||

            String(car.model).toLowerCase().includes(searchText)

            ||

            String(car.type).toLowerCase().includes(searchText)

            ||

            String(car.status).toLowerCase().includes(searchText)

        );

    displayCars(filteredCars);

}


// ======================================================
// CAR IMAGE HELPER
// ======================================================

function getCarImage(registration) {

    const imageMap = {

        "OD02AB1234": "images/swift.jpg",
        "OD02CD5678": "images/creta.jpg",
        "OD02EF9012": "images/city.jpg",
        "OD02GH3456": "images/innova.jpg",
        "OD02IJ7890": "images/nexon.jpg",
        "OD02KL2468": "images/thar.jpg",
        "OD02MN1357": "images/baleno.jpg",
        "OD02PQ8024": "images/verna.jpg",
        "OD02RS4680": "images/carens.jpg",
        "OD02TU9753": "images/punch.jpg"

    };

    return imageMap[registration] ||
           "images/car-placeholder.jpg";

}


// ======================================================
// 12. RENTAL STORAGE
// ======================================================

function getRentals() {

    const rentals =
        localStorage.getItem("rentals");


    if (rentals) {

        return JSON.parse(rentals);

    }


    return [];

}


// ======================================================
// 13. SAVE RENTALS
// ======================================================

function saveRentals(rentals) {

    localStorage.setItem(
        "rentals",
        JSON.stringify(rentals)
    );

}


// ======================================================
// 14. LOAD CUSTOMERS INTO BOOKING
// ======================================================

function loadBookingCustomers() {

    const select =
        document.getElementById("bookingCustomer");


    if (!select) {

        return;

    }


    const customers =
        getCustomers();


    select.innerHTML = `
        <option value="">
            Select Customer
        </option>
    `;


    customers.forEach(customer => {

        const option =
            document.createElement("option");


        option.value =
            customer.id;


        option.textContent =
            `${customer.id} - ${customer.name}`;


        select.appendChild(option);

    });

}


// ======================================================
// 15. LOAD AVAILABLE CARS INTO BOOKING
// ======================================================

function loadBookingCars() {

    const select =
        document.getElementById("bookingCar");


    if (!select) {

        return;

    }


    const cars =
        getCars();


    select.innerHTML = `
        <option value="">
            Select Available Car
        </option>
    `;


    cars
        .filter(
            car =>
                car.status === "Available"
        )
        .forEach(car => {

            const option =
                document.createElement("option");


            option.value =
                car.registration;


            option.textContent =
                `${car.registration} - ${car.brand} ${car.model} (₹${car.rate}/day)`;


            select.appendChild(option);

        });

    // If the user clicked "Book Now" on the Cars page,
    // automatically select that car on the Booking page.
    const params =
        new URLSearchParams(window.location.search);

    const selectedCar =
        params.get("car");

    if (selectedCar) {

        const carExists =
            cars.some(
                car =>
                    car.registration === selectedCar &&
                    car.status === "Available"
            );

        if (carExists) {

            select.value =
                selectedCar;

            updateRentalRate();

        }

    }

}


// ======================================================
// 16. UPDATE RENTAL RATE
// ======================================================

function updateRentalRate() {

    const carSelect =
        document.getElementById("bookingCar");

    const rateInput =
        document.getElementById("rentalRate");


    if (!carSelect || !rateInput) {

        return;

    }


    const registration =
        carSelect.value;


    const cars =
        getCars();


    const selectedCar =
        cars.find(
            car =>
                car.registration ===
                registration
        );


    if (selectedCar) {

        rateInput.value =
            `₹${selectedCar.rate} / day`;

    }

    else {

        rateInput.value = "";

    }


    calculateRentalDays();

}


// ======================================================
// 17. CALCULATE RENTAL DAYS
// ======================================================

function calculateRentalDays() {

    const startDate =
        document.getElementById("startDate");

    const returnDate =
        document.getElementById("returnDate");

    const rentalDays =
        document.getElementById("rentalDays");

    const totalCharge =
        document.getElementById("totalCharge");


    if (
        !startDate ||
        !returnDate ||
        !rentalDays ||
        !totalCharge
    ) {

        return;

    }


    if (
        startDate.value === "" ||
        returnDate.value === ""
    ) {

        rentalDays.value = "";

        totalCharge.textContent = "₹0";

        return;

    }


    const start =
        new Date(startDate.value);

    const end =
        new Date(returnDate.value);


    if (end < start) {

        rentalDays.value = "";

        totalCharge.textContent = "₹0";


        alert(
            "Return date cannot be before the rental start date."
        );

        return;

    }


    const difference =
        end - start;


    let days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (days === 0) {

        days = 1;

    }


    rentalDays.value =
        days;


    const carSelect =
        document.getElementById("bookingCar");


    const cars =
        getCars();


    const selectedCar =
        cars.find(
            car =>
                car.registration ===
                carSelect.value
        );


    if (selectedCar) {

        const total =
            days * selectedCar.rate;


        totalCharge.textContent =
            `₹${total.toLocaleString("en-IN")}`;

    }

    else {

        totalCharge.textContent =
            "₹0";

    }

}


// ======================================================
// 18. RENT CAR / BOOK CAR
// ======================================================

function rentCar(event) {

    event.preventDefault();


    const customerSelect =
        document.getElementById("bookingCustomer");

    const carSelect =
        document.getElementById("bookingCar");

    const startDate =
        document.getElementById("startDate");

    const returnDate =
        document.getElementById("returnDate");

    const rentalDays =
        document.getElementById("rentalDays");


    if (
        !customerSelect.value ||
        !carSelect.value ||
        !startDate.value ||
        !returnDate.value ||
        !rentalDays.value
    ) {

        alert(
            "Please fill all booking details."
        );

        return;

    }


    const customers =
        getCustomers();

    const cars =
        getCars();

    const rentals =
        getRentals();


    const customer =
        customers.find(
            customer =>
                customer.id ===
                customerSelect.value
        );


    const car =
        cars.find(
            car =>
                car.registration ===
                carSelect.value
        );


    if (!customer) {

        alert(
            "Selected customer was not found."
        );

        return;

    }


    if (!car) {

        alert(
            "Selected car was not found."
        );

        return;

    }


    if (car.status !== "Available") {

        alert(
            "Sorry, this car is no longer available."
        );

        loadBookingCars();

        return;

    }


    const days =
        parseInt(
            rentalDays.value
        );


    const totalCharge =
        days * car.rate;


    // Generate Rental ID

    const rentalNumber =
        rentals.length + 1;


    const rentalId =
        "RENT" +
        String(rentalNumber).padStart(3, "0");


    // Create rental

    const newRental = {

        rentalId: rentalId,

        customerId: customer.id,

        customerName: customer.name,

        carRegistration: car.registration,

        carBrand: car.brand,

        carModel: car.model,

        startDate: startDate.value,

        returnDate: returnDate.value,

        days: days,

        rate: car.rate,

        totalCharge: totalCharge,

        status: "Active",

        actualReturnDate: "",

        paymentStatus: "Pending",

        paymentMethod: "",

        paymentDate: ""

    };


    rentals.push(newRental);


    saveRentals(rentals);


    // Change car status

    car.status = "Rented";


    saveCars(cars);


    // Remember the newly booked rental

    localStorage.setItem(
        "selectedRentalId",
        rentalId
    );


    alert(
        `Car booked successfully!\n\n` +
        `Rental ID: ${rentalId}\n` +
        `Car: ${car.brand} ${car.model}\n` +
        `Days: ${days}\n` +
        `Total Charge: ₹${totalCharge.toLocaleString("en-IN")}`
    );


    // Automatically open Payment page

    window.location.href =
        "payment.html";

}


// ======================================================
// 19. DISPLAY CURRENTLY RENTED CARS
// ======================================================

function displayReturnCars() {

    const container =
        document.getElementById("returnCarList");


    if (!container) {

        return;

    }


    const rentals =
        getRentals();


    const activeRentals =
        rentals.filter(
            rental =>
                rental.status === "Active"
        );


    container.innerHTML = "";


    if (activeRentals.length === 0) {

        container.innerHTML = `
            <div class="no-rental">
                <p>No cars are currently rented.</p>
            </div>
        `;

        return;

    }


    activeRentals.forEach(rental => {

        const card =
            document.createElement("div");


        card.className =
            "return-card";


        card.innerHTML = `

            <div class="return-card-content">

                <h3>
                    ${rental.carBrand}
                    ${rental.carModel}
                </h3>

                <p>
                    <strong>Rental ID:</strong>
                    ${rental.rentalId}
                </p>

                <p>
                    <strong>Customer:</strong>
                    ${rental.customerName}
                </p>

                <p>
                    <strong>Registration:</strong>
                    ${rental.carRegistration}
                </p>

                <p>
                    <strong>Return Date:</strong>
                    ${rental.returnDate}
                </p>

                <p>
                    <strong>Total Charge:</strong>
                    ₹${Number(rental.totalCharge)
                        .toLocaleString("en-IN")}
                </p>

            </div>

            <button
                class="return-btn"
                onclick="returnCar('${rental.rentalId}')">

                Return Car

            </button>

        `;


        container.appendChild(card);

    });

}


// ======================================================
// 20. RETURN CAR
// ======================================================

function returnCar(rentalId) {

    const rentals =
        getRentals();

    const cars =
        getCars();


    const rental =
        rentals.find(
            rental =>
                rental.rentalId ===
                rentalId
        );


    if (!rental) {

        alert(
            "Rental record not found."
        );

        return;

    }


    if (rental.status === "Completed") {

        alert(
            "This car has already been returned."
        );

        return;

    }


    const confirmReturn =
        confirm(
            `Return ${rental.carBrand} ${rental.carModel}?`
        );


    if (!confirmReturn) {

        return;

    }


    rental.status =
        "Completed";


    const today =
            new Date();


    rental.actualReturnDate =
        today.toISOString()
            .split("T")[0];


    const car =
        cars.find(
            car =>
                car.registration ===
                rental.carRegistration
        );


    if (car) {

        car.status =
            "Available";

    }


    saveRentals(rentals);

    saveCars(cars);


    alert(
        "Car returned successfully!"
    );


    displayReturnCars();

    loadBookingCars();

    displayCars();

    displayRentalHistory();

    updateHomeStatistics();

}


// ======================================================
// 21. RESET RENTAL FORM
// ======================================================

function resetRentalForm() {

    const form =
        document.getElementById("rentalForm");


    if (form) {

        form.reset();

    }


    const rentalDays =
        document.getElementById("rentalDays");

    const rentalRate =
        document.getElementById("rentalRate");

    const totalCharge =
        document.getElementById("totalCharge");


    if (rentalDays) {

        rentalDays.value = "";

    }


    if (rentalRate) {

        rentalRate.value = "";

    }


    if (totalCharge) {

        totalCharge.textContent =
            "₹0";

    }

}


// ======================================================
// 22. DISPLAY RENTAL HISTORY
// ======================================================

function displayRentalHistory() {

    const tableBody =
        document.getElementById(
            "rentalHistoryTableBody"
        );


    if (!tableBody) {

        return;

    }


    const rentals =
        getRentals();


    tableBody.innerHTML = "";


    if (rentals.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;">
                    No rental records available.
                </td>
            </tr>
        `;


        updateRentalSummary([]);

        return;

    }


    rentals.forEach(rental => {


        const row =
            document.createElement("tr");


        // Rental Status

        let statusHTML;


        if (rental.status === "Active") {

            statusHTML = `
                <span class="active-status">
                    Active
                </span>
            `;

        }

        else {

            statusHTML = `
                <span class="completed-status">
                    Completed
                </span>
            `;

        }


        // Payment Status

        let paymentStatusHTML;


        if (rental.paymentStatus === "Paid") {

            paymentStatusHTML = `
                <span class="paid-status">
                    Paid
                </span>
            `;

        }

        else {

            paymentStatusHTML = `
                <span class="pending-status">
                    Pending
                </span>
            `;

        }


        row.innerHTML = `

            <td>
                ${rental.rentalId}
            </td>


            <td>
                ${rental.customerName}
            </td>


            <td>
                ${rental.carBrand}
                ${rental.carModel}
                <br>

                <small>
                    ${rental.carRegistration}
                </small>
            </td>


            <td>
                ${rental.startDate}
            </td>


            <td>
                ${rental.returnDate}
            </td>


            <td>
                ${rental.days}
            </td>


            <td>
                ₹${Number(rental.totalCharge)
                    .toLocaleString("en-IN")}
            </td>


            <td>
                ${paymentStatusHTML}
            </td>


            <td>
                ${rental.paymentMethod || "-"}
            </td>


            <td>
                ${statusHTML}
            </td>

        `;


        tableBody.appendChild(row);

    });


    updateRentalSummary(rentals);

}


// ======================================================
// 23. UPDATE RENTAL SUMMARY
// ======================================================

function updateRentalSummary(rentals) {

    const totalRentals =
        document.getElementById(
            "totalRentals"
        );


    const activeRentals =
        document.getElementById(
            "activeRentals"
        );


    const completedRentals =
        document.getElementById(
            "completedRentals"
        );


    const totalRevenue =
        document.getElementById(
            "totalRevenue"
        );


    const total =
        rentals.length;


    const active =
        rentals.filter(
            rental =>
                rental.status === "Active"
        ).length;


    const completed =
        rentals.filter(
            rental =>
                rental.status === "Completed"
        ).length;


    const revenue =
        rentals.reduce(
            (sum, rental) =>
                sum +
                Number(rental.totalCharge),
            0
        );


    if (totalRentals) {

        totalRentals.textContent =
            total;

    }


    if (activeRentals) {

        activeRentals.textContent =
            String(active).padStart(2, "0");

    }


    if (completedRentals) {

        completedRentals.textContent =
            String(completed).padStart(2, "0");

    }


    if (totalRevenue) {

        totalRevenue.textContent =
            `₹${revenue.toLocaleString("en-IN")}`;

    }

}


// ======================================================
// 24. SEARCH RENTAL HISTORY
// ======================================================

function searchRentalHistory() {

    const searchInput =
        document.getElementById(
            "rentalSearch"
        );


    const tableBody =
        document.getElementById(
            "rentalHistoryTableBody"
        );


    if (!searchInput || !tableBody) {

        return;

    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const rentals =
        getRentals();


    const filteredRentals =
        rentals.filter(rental =>

            rental.rentalId
                .toLowerCase()
                .includes(searchText)

            ||

            rental.customerName
                .toLowerCase()
                .includes(searchText)

            ||

            rental.carRegistration
                .toLowerCase()
                .includes(searchText)

            ||

            rental.carBrand
                .toLowerCase()
                .includes(searchText)

            ||

            rental.carModel
                .toLowerCase()
                .includes(searchText)

            ||

            rental.status
                .toLowerCase()
                .includes(searchText)

        );


    tableBody.innerHTML = "";


    if (filteredRentals.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No matching rental record found.
                </td>
            </tr>
        `;

        return;

    }


    filteredRentals.forEach(rental => {

        const row =
            document.createElement("tr");


        let statusHTML;


        if (rental.status === "Active") {

            statusHTML = `
                <span class="active-status">
                    Active
                </span>
            `;

        }

        else {

            statusHTML = `
                <span class="completed-status">
                    Completed
                </span>
            `;

        }


        row.innerHTML = `

            <td>
                ${rental.rentalId}
            </td>

            <td>
                ${rental.customerName}
            </td>

            <td>
                ${rental.carBrand}
                ${rental.carModel}
                <br>
                <small>
                    ${rental.carRegistration}
                </small>
            </td>

            <td>
                ${rental.startDate}
            </td>

            <td>
                ${rental.returnDate}
            </td>

            <td>
                ${rental.days}
            </td>

            <td>
                ₹${Number(rental.totalCharge)
                    .toLocaleString("en-IN")}
            </td>

            <td>
                ${statusHTML}
            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ======================================================
// 25. HOME PAGE STATISTICS
// ======================================================

function updateHomeStatistics() {

    const cars =
        getCars();


    const rentals =
        getRentals();


    const availableCars =
        cars.filter(
            car =>
                car.status === "Available"
        ).length;


    const rentedCars =
        cars.filter(
            car =>
                car.status === "Rented"
        ).length;


    const totalRentals =
        rentals.length;


    const revenue =
        rentals.reduce(
            (sum, rental) =>
                sum +
                Number(rental.totalCharge),
            0
        );


    const availableElement =
        document.getElementById(
            "availableCars"
        );


    const rentedElement =
        document.getElementById(
            "rentedCars"
        );


    const rentalsElement =
        document.getElementById(
            "homeTotalRentals"
        );


    const revenueElement =
        document.getElementById(
            "homeRevenue"
        );


    if (availableElement) {

        availableElement.textContent =
            availableCars;

    }


    if (rentedElement) {

        rentedElement.textContent =
            rentedCars;

    }


    if (rentalsElement) {

        rentalsElement.textContent =
            totalRentals;

    }


    if (revenueElement) {

        revenueElement.textContent =
            `₹${revenue.toLocaleString("en-IN")}`;

    }

}


// ======================================================
// 26. PAYMENT - LOAD RENTALS
// ======================================================

function loadPaymentRentals() {

    const paymentRental =
        document.getElementById("paymentRental");

    if (!paymentRental) {
        return;
    }

    const rentals = getRentals();

    const unpaidRentals = rentals.filter(
        rental =>
            rental.status === "Active" &&
            rental.paymentStatus !== "Paid"
    );

    paymentRental.innerHTML =
        '<option value="">-- Select Rental --</option>';

    window.paymentRentalData = {};

    if (unpaidRentals.length === 0) {

        paymentRental.innerHTML =
            '<option value="">No unpaid active rentals</option>';

        return;
    }

    unpaidRentals.forEach(rental => {

        window.paymentRentalData[rental.rentalId] =
            rental;

        const option =
            document.createElement("option");

        option.value = rental.rentalId;

        option.textContent =
            rental.rentalId +
            " - " +
            rental.customerName +
            " - " +
            rental.carBrand +
            " " +
            rental.carModel +
            " - ₹" +
            Number(rental.totalCharge)
                .toLocaleString("en-IN");

        paymentRental.appendChild(option);
    });

    // Automatically select the newly booked rental
    const selectedRentalId =
        localStorage.getItem("selectedRentalId");

    if (
        selectedRentalId &&
        window.paymentRentalData[selectedRentalId]
    ) {

        paymentRental.value =
            selectedRentalId;

        loadPaymentDetails();
    }
}

// ======================================================
// 27. PAYMENT - LOAD SELECTED RENTAL DETAILS
// ======================================================

function loadPaymentDetails() {

    const paymentRental =
        document.getElementById("paymentRental");

    if (!paymentRental) {
        return;
    }

    const rentalId = paymentRental.value;

    if (!rentalId) {
        return;
    }

    const rental =
        window.paymentRentalData[rentalId];

    if (!rental) {
        return;
    }

    const paymentCustomer =
        document.getElementById("paymentCustomer");

    const paymentCar =
        document.getElementById("paymentCar");

    const paymentDays =
        document.getElementById("paymentDays");

    const paymentAmount =
        document.getElementById("paymentAmount");

    if (paymentCustomer) {
        paymentCustomer.value =
            rental.customerName;
    }

    if (paymentCar) {
        paymentCar.value =
            rental.carBrand +
            " " +
            rental.carModel;
    }

    if (paymentDays) {
        paymentDays.value =
            rental.days;
    }

    if (paymentAmount) {
        paymentAmount.value =
            "Rs." +
            rental.totalCharge;
    }

    const summaryRental =
        document.getElementById("summaryRental");

    const summaryCustomer =
        document.getElementById("summaryCustomer");

    const summaryCar =
        document.getElementById("summaryCar");

    const summaryDays =
        document.getElementById("summaryDays");

    const summaryAmount =
        document.getElementById("summaryAmount");

    if (summaryRental) {
        summaryRental.textContent =
            rental.rentalId;
    }

    if (summaryCustomer) {
        summaryCustomer.textContent =
            rental.customerName;
    }

    if (summaryCar) {
        summaryCar.textContent =
            rental.carBrand + " " +
            rental.carModel;
    }

    if (summaryDays) {
        summaryDays.textContent =
            rental.days;
    }

    if (summaryAmount) {
        summaryAmount.textContent =
            "Rs." + rental.totalCharge;
    }
}

// ======================================================
// 28. PAYMENT - MAKE PAYMENT
// ======================================================

function makePayment(event) {

    event.preventDefault();


    const paymentRental =
        document.getElementById(
            "paymentRental"
        );


    const paymentMethod =
        document.getElementById(
            "paymentMethod"
        );


    if (
        !paymentRental ||
        !paymentMethod
    ) {

        return;

    }


    const rentalId =
        paymentRental.value;


    const method =
        paymentMethod.value;


    if (!rentalId) {

        alert(
            "Please select a rental."
        );

        return;

    }


    if (!method) {

        alert(
            "Please select a payment method."
        );

        return;

    }


    const rentals =
        getRentals();


    const rental =
        rentals.find(
            item =>
                item.rentalId ===
                rentalId
        );


    if (!rental) {

        alert(
            "Rental record not found."
        );

        return;

    }


    if (
        rental.paymentStatus === "Paid"
    ) {

        alert(
            "This rental has already been paid."
        );

        return;

    }


    // Store payment details

    rental.paymentStatus =
        "Paid";


    rental.paymentMethod =
        method;


    rental.paymentDate =
        new Date()
            .toISOString()
            .split("T")[0];


    saveRentals(rentals);


    // Remember the paid rental
    // for the Bill page

    localStorage.setItem(
        "billRentalId",
        rental.rentalId
    );


    // Also keep selected rental

    localStorage.setItem(
        "selectedRentalId",
        rental.rentalId
    );


    alert(
        "Payment successful!\n\n" +
        "Rental ID: " +
        rental.rentalId +
        "\n" +
        "Amount: ₹" +
        Number(rental.totalCharge)
            .toLocaleString("en-IN") +
        "\n" +
        "Payment Method: " +
        method
    );


    // Automatically open Bill

    window.location.href =
        "bill.html";

}


// ======================================================
// 29. PAYMENT - RESET FORM
// ======================================================

function resetPaymentForm() {

    const paymentRental =
        document.getElementById(
            "paymentRental"
        );


    if (!paymentRental) {

        return;

    }


    paymentRental.value = "";


    const paymentCustomer =
        document.getElementById(
            "paymentCustomer"
        );


    const paymentCar =
        document.getElementById(
            "paymentCar"
        );


    const paymentDays =
        document.getElementById(
            "paymentDays"
        );


    const paymentAmount =
        document.getElementById(
            "paymentAmount"
        );


    if (paymentCustomer) {

        paymentCustomer.value = "";

    }


    if (paymentCar) {

        paymentCar.value = "";

    }


    if (paymentDays) {

        paymentDays.value = "";

    }


    if (paymentAmount) {

        paymentAmount.value = "";

    }


    const summaryRental =
        document.getElementById(
            "summaryRental"
        );


    const summaryCustomer =
        document.getElementById(
            "summaryCustomer"
        );


    const summaryCar =
        document.getElementById(
            "summaryCar"
        );


    const summaryDays =
        document.getElementById(
            "summaryDays"
        );


    const summaryAmount =
        document.getElementById(
            "summaryAmount"
        );


    if (summaryRental) {

        summaryRental.textContent =
            "-";

    }


    if (summaryCustomer) {

        summaryCustomer.textContent =
            "-";

    }


    if (summaryCar) {

        summaryCar.textContent =
            "-";

    }


    if (summaryDays) {

        summaryDays.textContent =
            "-";

    }


    if (summaryAmount) {

        summaryAmount.textContent =
            "₹0";

    }

}


// ======================================================
// 30. BILL - LOAD BILL DETAILS
// ======================================================

function loadBillDetails() {

    const billCustomer =
        document.getElementById(
            "billCustomer"
        );


    // If this is not bill.html,
    // do nothing

    if (!billCustomer) {

        return;

    }


    const billRentalId =
        localStorage.getItem(
            "billRentalId"
        );


    if (!billRentalId) {

        alert(
            "No bill is available."
        );

        return;

    }


    const rentals =
        getRentals();


    const rental =
        rentals.find(
            item =>
                item.rentalId ===
                billRentalId
        );


    if (!rental) {

        alert(
            "Rental record not found."
        );

        return;

    }


    // Customer

    billCustomer.textContent =
        rental.customerName;


    // Customer ID

    const customerId =
        document.getElementById(
            "billCustomerId"
        );


    if (customerId) {

        customerId.textContent =
            rental.customerId;

    }


    // Rental ID

    const rentalId =
        document.getElementById(
            "billRentalId"
        );


    if (rentalId) {

        rentalId.textContent =
            rental.rentalId;

    }


    // Car

    const billCar =
        document.getElementById(
            "billCar"
        );


    if (billCar) {

        billCar.textContent =
            `${rental.carBrand} ${rental.carModel}`;

    }


    // Registration

    const billRegistration =
        document.getElementById(
            "billRegistration"
        );


    if (billRegistration) {

        billRegistration.textContent =
            rental.carRegistration;

    }


    // Days

    const billDays =
        document.getElementById(
            "billDays"
        );


    if (billDays) {

        billDays.textContent =
            rental.days;

    }


    // Rate

    const billRate =
        document.getElementById(
            "billRate"
        );


    if (billRate) {

        billRate.textContent =
            `₹${Number(rental.rate)
                .toLocaleString("en-IN")}`;

    }


    // Amount

    const billAmount =
        document.getElementById(
            "billAmount"
        );


    if (billAmount) {

        billAmount.textContent =
            `₹${Number(rental.totalCharge)
                .toLocaleString("en-IN")}`;

    }


    // Start date

    const billStartDate =
        document.getElementById(
            "billStartDate"
        );


    if (billStartDate) {

        billStartDate.textContent =
            rental.startDate;

    }


    // Return date

    const billReturnDate =
        document.getElementById(
            "billReturnDate"
        );


    if (billReturnDate) {

        billReturnDate.textContent =
            rental.returnDate;

    }


    // Rental amount

    const billRentalAmount =
        document.getElementById(
            "billRentalAmount"
        );


    if (billRentalAmount) {

        billRentalAmount.textContent =
            `₹${Number(rental.totalCharge)
                .toLocaleString("en-IN")}`;

    }


    // Tax

    const billTax =
        document.getElementById(
            "billTax"
        );


    // We are currently keeping tax as ₹0

    if (billTax) {

        billTax.textContent =
            "₹0";

    }


    // Final total

    const billTotal =
        document.getElementById(
            "billTotal"
        );


    if (billTotal) {

        billTotal.textContent =
            `₹${Number(rental.totalCharge)
                .toLocaleString("en-IN")}`;

    }


    // Payment method

    const billPaymentMethod =
        document.getElementById(
            "billPaymentMethod"
        );


    if (billPaymentMethod) {

        billPaymentMethod.textContent =
            rental.paymentMethod || "Not Paid";

    }


    // Payment status

    const billPaymentStatus =
        document.getElementById(
            "billPaymentStatus"
        );


    if (billPaymentStatus) {

        billPaymentStatus.textContent =
            rental.paymentStatus || "Pending";

    }


    // Second payment status

    const billPaymentStatus2 =
        document.getElementById(
            "billPaymentStatus2"
        );


    if (billPaymentStatus2) {

        billPaymentStatus2.textContent =
            rental.paymentStatus || "Pending";

    }


    // Invoice date

    const invoiceDate =
        document.getElementById(
            "invoiceDate"
        );


    if (invoiceDate) {

        invoiceDate.textContent =
            rental.paymentDate ||
            new Date()
                .toISOString()
                .split("T")[0];

    }

}


// ======================================================
// 31. GO TO PAYMENT
// ======================================================

function goToPayment() {

    const rentalId =
        localStorage.getItem(
            "billRentalId"
        );


    if (rentalId) {

        localStorage.setItem(
            "selectedRentalId",
            rentalId
        );

    }


    window.location.href =
        "payment.html";

}


// ======================================================
// 32. PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // Customer page

        displayCustomers();


        // Cars page

        displayCars();


        // Booking page

        loadBookingCustomers();

        loadBookingCars();

        displayReturnCars();


        // Rental History page

        displayRentalHistory();


        // Home page

        updateHomeStatistics();


        // Payment page

        loadPaymentRentals();


        // Bill page

        loadBillDetails();


        // Date fields

        const startDate =
            document.getElementById(
                "startDate"
            );


        const returnDate =
            document.getElementById(
                "returnDate"
            );


        if (startDate && returnDate) {


            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];


            startDate.min =
                today;


            returnDate.min =
                today;


            startDate.addEventListener(
                "change",
                function () {

                    returnDate.min =
                        startDate.value;

                    calculateRentalDays();

                }
            );


            returnDate.addEventListener(
                "change",
                function () {

                    calculateRentalDays();

                }
            );

        }

    }
);