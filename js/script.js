// Function to Reset Form Fields and Hide Dynamic Ticket Output
function resetFormResults() {
    // Clear DOM validation error messages
    document.getElementById("nameError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("destError").innerHTML = "";
    document.getElementById("weightError").innerHTML = "";
    
    // Hide output container
    var outputDiv = document.getElementById("ticketOutput");
    outputDiv.style.display = "none";
    outputDiv.innerHTML = "";
}

// Function to Validate Form Inputs and Calculate Delivery Cost
function calculateFee() {
    // 1. Clear previous DOM error messages
    document.getElementById("nameError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("destError").innerHTML = "";
    document.getElementById("weightError").innerHTML = "";

    // 2. Retrieve user input from HTML form DOM elements
    var nameInput = document.getElementById("custName").value;
    var emailInput = document.getElementById("custEmail").value;
    var destInput = document.getElementById("destination").value;
    var weightInput = document.getElementById("cargoWeight").value;

    // Retrieve selected Speed Card radio button value
    var selectedSpeedRadio = document.querySelector('input[name="speed"]:checked');
    var speedInput = selectedSpeedRadio ? selectedSpeedRadio.value : "1.0";

    // Retrieve optional checkboxes
    var insuranceCheck = document.getElementById("insurance").checked;
    var shieldCheck = document.getElementById("shield").checked;

    let isValid = true; // Validation control flag

    // 3. Validation Check: Customer Name (Required)
    if (nameInput.trim() === "") {
        document.getElementById("nameError").innerHTML = "Customer Name is required.";
        isValid = false;
    }

    // 4. Validation Check: Sea-Mail Address (Required + Format Check)
    if (emailInput.trim() === "") {
        document.getElementById("emailError").innerHTML = "Sea-Mail Address is required.";
        isValid = false;
    } else if (emailInput.indexOf("@") === -1 || emailInput.indexOf(".") === -1) {
        document.getElementById("emailError").innerHTML = "Invalid email format (must contain '@' and '.').";
        isValid = false;
    }

    // 5. Validation Check: Destination Ramp Selection (Required)
    if (destInput === "") {
        document.getElementById("destError").innerHTML = "Please select a drop-off exit destination.";
        isValid = false;
    }

    // 6. Validation Check: Cargo Weight (Numeric & Range Check > 0)
    var weight = parseFloat(weightInput);
    if (weightInput.trim() === "" || isNaN(weight) || weight <= 0) {
        document.getElementById("weightError").innerHTML = "Parcel weight must be a valid number greater than 0 kg.";
        isValid = false;
    }

    // Stop execution and alert user if any validation fails
    if (!isValid) {
        alert("⚠️ Input error! Please correct the highlighted fields.");
        return false;
    }

    // 7. Pricing Formulas & Multiplier Assignments
    var baseFee = 10.00;                          // Fixed Intake Charge (RM 10.00)
    var destFee = parseFloat(destInput);           // Destination Exit Fee (RM 15, 35, or 60)
    var speedMultiplier = parseFloat(speedInput);    // Speed Factor (1.0x, 1.4x, or 1.8x)
    var weightFee = weight * 4.00;                // Weight Fee Rate (RM 4.00 per kg)

    // Accumulate Optional Extras Checkbox Values
    var extrasFee = 0.00;
    if (insuranceCheck) extrasFee += 8.00;       // Squirt's Shell Insurance (+RM 8.00)
    if (shieldCheck) extrasFee += 5.00;          // Jellyfish Protection Wrap (+RM 5.00)

    // Compute Base Subtotal and Speed Surge Breakdown
    var subtotal = baseFee + destFee + weightFee + extrasFee;
    var speedSurcharge = (subtotal * speedMultiplier) - subtotal;
    var totalCost = subtotal * speedMultiplier;

    // Retrieve readable destination label text
    var destSelect = document.getElementById("destination");
    var destText = destSelect.options[destSelect.selectedIndex].text;

    // 8. Construct Output Summary Ticket HTML String
    var ticketHTML = 
        "<h3>🧾 Official Shipping Calculation Summary</h3>" +
        "<div class='ticket-row'><span><strong>Customer:</strong></span> <span>" + nameInput + "</span></div>" +
        "<div class='ticket-row'><span><strong>Email:</strong></span> <span>" + emailInput + "</span></div>" +
        "<div class='ticket-row'><span><strong>Destination:</strong></span> <span>" + destText + "</span></div>" +
        "<div class='ticket-row'><span><strong>Base Fee:</strong></span> <span>RM " + baseFee.toFixed(2) + "</span></div>" +
        "<div class='ticket-row'><span><strong>Weight Fee (" + weight + " kg):</strong></span> <span>RM " + weightFee.toFixed(2) + "</span></div>" +
        "<div class='ticket-row'><span><strong>Optional Extras:</strong></span> <span>RM " + extrasFee.toFixed(2) + "</span></div>" +
        "<div class='ticket-row'><span><strong>Base Subtotal:</strong></span> <span>RM " + subtotal.toFixed(2) + "</span></div>" +
        "<div class='ticket-row'><span><strong>Speed Surge (" + speedMultiplier + "x):</strong></span> <span>+RM " + speedSurcharge.toFixed(2) + "</span></div>" +
        "<div class='total-box'>💰 TOTAL FEE: RM " + totalCost.toFixed(2) + "</div>";

    // Inject HTML into Result Div Container and Make Visible
    var outputDiv = document.getElementById("ticketOutput");
    outputDiv.innerHTML = ticketHTML;
    outputDiv.style.display = "block";

    alert("✅ Calculation complete! Scroll down to view your breakdown.");
    return false;
}