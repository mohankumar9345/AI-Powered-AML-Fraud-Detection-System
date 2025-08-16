// Risk detection logic
function checkTransaction(sender, receiver, amount, country) {
  let score = 0;
  let status = "Safe";
  let reasons = [];

  // Rule 1: Amount below 5 Lakhs = Safe
  if (amount < 500000) {
    score = 10;
    status = "Safe";
    reasons.push("Amount below 5 Lakhs - Safe in all countries");
  }

  // Rule 2: Between 5 and 10 Lakhs = Low Risk
  else if (amount >= 500000 && amount <= 1000000) {
    score = 30;
    status = "Low Risk";
    reasons.push("Normal transaction between 5-10 Lakhs");
  }

  // Rule 3: Above 10 Lakhs = Suspicious (unless India)
  else if (amount > 1000000) {
    score = 80;
    if (country.toLowerCase() !== "india") {
      status = "Suspicious";
      reasons.push("Suspicious: Large transaction & High-risk country (not India)");
    } else {
      status = "Large Transaction";
      reasons.push("Large transaction above 10 Lakhs in India");
    }
  }

  // Extra check: Sender == Receiver
  if (sender.toLowerCase() === receiver.toLowerCase()) {
    score += 20;
    reasons.push("Sender and Receiver are the same");
    if (status === "Safe") status = "Low Risk";
  }

  return { sender, receiver, amount, country, score, status, reasons };
}

// Badge generator
function getStatusBadge(status) {
  if (status === "Safe") {
    return `<span class="badge safe">🟢 Safe</span>`;
  } else if (status === "Low Risk") {
    return `<span class="badge low">🟡 Low Risk</span>`;
  } else if (status === "Large Transaction") {
    return `<span class="badge large">🟠 Large Transaction</span>`;
  } else {
    return `<span class="badge suspicious">🔴 Suspicious</span>`;
  }
}

// Add row to history table
function addToHistory(txn) {
  const table = document.querySelector("#history tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${txn.sender}</td>
    <td>${txn.receiver}</td>
    <td>₹${txn.amount.toLocaleString()}</td>
    <td>${txn.country}</td>
    <td>${txn.score}</td>
    <td>${getStatusBadge(txn.status)}</td>
    <td>${txn.reasons.join(", ")}</td>
  `;

  table.appendChild(row);
}

// Button check
document.getElementById("checkBtn").addEventListener("click", () => {
  const sender = document.getElementById("sender").value;
  const receiver = document.getElementById("receiver").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const country = document.getElementById("country").value;

  if (!sender || !receiver || isNaN(amount)) {
    alert("Please enter all details!");
    return;
  }

  const txn = checkTransaction(sender, receiver, amount, country);
  addToHistory(txn);
});

// Example buttons
document.querySelectorAll(".example").forEach(card => {
  card.addEventListener("click", () => {
    let txn;
    if (card.classList.contains("safe")) {
      txn = checkTransaction("Rajesh Kumar", "Anil Traders", 450000, "India"); // Safe
    } else {
      txn = checkTransaction("Fraudster Ltd", "Fraudster Ltd", 2500000, "Russia"); // Suspicious
    }
    addToHistory(txn);
  });
});
