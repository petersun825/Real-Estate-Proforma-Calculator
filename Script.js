/**
 * Calculates the Internal Rate of Return (IRR) for a series of cash flows.
 * Uses the Newton's method approximation.
 * @param {number[]} cashFlows - Array of cash flows (negative for outflow, positive for inflow).
 * @returns {number} The calculated IRR as a decimal, or NaN if calculation fails.
 */
function calculateIRR(cashFlows) {
    // Initial guess for the rate
    let rate = 0.1; 
    let maxIterations = 100;
    let precision = 0.0001;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let derivative = 0;
        
        // Calculate NPV and its derivative
        for (let t = 0; t < cashFlows.length; t++) {
            npv += cashFlows[t] / Math.pow(1 + rate, t);
            derivative -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
        }

        // Check for convergence
        if (Math.abs(npv) < precision) {
            return rate;
        }
        
        // Apply Newton's Method formula
        rate -= npv / derivative;

        // Check for divergence
        if (rate <= -1) {
            // IRR calculation failed (often due to extreme cash flows)
            return NaN; 
        }
    }
    // Max iterations reached, return approximation
    return rate;
}

/**
 * Main function to calculate and display the financial returns.
 */
function calculateReturns() {
    const initialEquity = parseFloat(document.getElementById('initialEquity').value);
    const projectDuration = parseInt(document.getElementById('projectDuration').value);
    const totalDistribution = parseFloat(document.getElementById('totalDistribution').value);

    // Basic input validation
    if (isNaN(initialEquity) || isNaN(projectDuration) || isNaN(totalDistribution) || initialEquity <= 0 || projectDuration <= 0 || totalDistribution <= 0) {
        alert("Please enter valid positive numbers for all fields.");
        return;
    }

    // --- 1. Equity Multiple (EM) ---
    const equityMultiple = totalDistribution / initialEquity;
    
    // --- 2. Total Profit ---
    const totalProfit = totalDistribution - initialEquity;

    // --- 3. Internal Rate of Return (IRR) ---
    // Create the cash flow stream for the IRR calculation
    // Year 0: -Initial Equity (outflow)
    // Years 1 to N-1: 0 (no interim cash flow assumed for a development-and-sell)
    // Year N: Total Distribution (inflow)
    
    const cashFlows = [];
    cashFlows.push(-initialEquity); // Initial Outflow
    
    // Add zero flows for the construction period (years 1 to Duration-1)
    for (let i = 1; i < projectDuration; i++) {
        cashFlows.push(0);
    }
    
    // Add the final distribution at the end of the project duration
    cashFlows.push(totalDistribution);
    
    const irrRate = calculateIRR(cashFlows);
    let irrResultText;
    
    if (!isNaN(irrRate)) {
        // Convert to percentage and format
        irrResultText = (irrRate * 100).toFixed(2) + "%";
    } else {
        irrResultText = "Calculation Failed";
    }

    // --- Display Results ---
    document.getElementById('emResult').textContent = `${equityMultiple.toFixed(2)}x`;
    document.getElementById('irrResult').textContent = irrResultText;
    document.getElementById('profitResult').textContent = `$${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
