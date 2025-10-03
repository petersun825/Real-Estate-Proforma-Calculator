import numpy_financial as npf

def calculate_development_returns(investor_equity, cash_flows):
    """
    Calculates the Equity Multiple and IRR for a development project.

    Args:
        investor_equity (float): Total upfront capital invested by the investor.
        cash_flows (list): A list of annual cash flows, including the
                           initial equity investment (as a negative value) and
                           the final sales proceeds/profit (as a positive value).

    Returns:
        tuple: (equity_multiple, irr_percentage)
    """

    # --- Equity Multiple Calculation ---
    # Total Profit is the sum of all positive cash flows (distributions)
    # minus the initial investment (absolute value of the first negative entry).
    total_distributions = sum(c for c in cash_flows if c > 0)
    total_profit = total_distributions - abs(cash_flows[0])
    equity_multiple = total_distributions / abs(investor_equity)

    # --- IRR Calculation ---
    # numpy_financial's IRR function calculates the internal rate of return.
    # It requires the initial investment as the first cash flow (negative).
    try:
        irr = npf.irr(cash_flows)
        irr_percentage = round(irr * 100, 2)
    except ValueError:
        irr_percentage = "N/A (IRR calculation failed)"

    return round(equity_multiple, 2), irr_percentage


# ===============================================
# 2. EXAMPLE INPUT (Based on a $2M Sales Project)
# ===============================================

# 💡 ASSUMPTIONS:
# Total Project Cost: $1,600,000 (80% of $2M sale)
# Required Equity (Investor + Developer): $480,000 (30% of Total Cost)
# Let's assume the Investor contributes 80% of the required equity.
INVESTOR_EQUITY = -400000  # Initial cash outflow at Time 0 (Year 0)
PROJECT_DURATION_YEARS = 2 # Total project time (e.g., 24 months)

# 💡 PROJECT CASH FLOWS (Hypothetical Annual Flows):
# Year 0: Initial Equity Investment
# Year 1: $0 (Construction Phase)
# Year 2: Final Net Sale Proceeds after debt payoff, fees, and initial capital return.
# Total Distributions: $400,000 (Return of Capital) + $250,000 (Profit) = $650,000

CASH_FLOW_STREAM = [
    INVESTOR_EQUITY,
    0,                   # End of Year 1 Cash Flow
    650000               # End of Year 2 Cash Flow (Sale/Refi Proceeds)
]


# ===============================================
# 3. RUN THE CALCULATOR
# ===============================================
em, irr = calculate_development_returns(abs(INVESTOR_EQUITY), CASH_FLOW_STREAM)

# 4. DISPLAY RESULTS
print(f"--- Real Estate Investment Pro Forma ---")
print(f"Initial Investor Equity: ${abs(INVESTOR_EQUITY):,.0f}")
print(f"Total Project Duration: {PROJECT_DURATION_YEARS} years")
print("-" * 35)
print(f"Equity Multiple (EM): {em}x")
print(f"Internal Rate of Return (IRR): {irr}%")
print(f"Total Profit: ${CASH_FLOW_STREAM[-1] - abs(INVESTOR_EQUITY):,.0f}")
