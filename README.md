#  Pump.fun Protocol: Asymptotic State Transitions and The Liquidity Extraction "Trap"

This repository provides a rigorous mathematical framework for the **Pump.fun** lifecycle. We move beyond simple trading mechanics to analyze the **Virtual Bonding Curve (VBC)**, the **Deterministic Migration Instruction**, and the systemic extraction of value during the "graduation" phase.

---

## 1. The Virtual Bonding Curve (VBC) Formalism

The Pump.fun environment is a two-phase Automated Market Maker (AMM). Phase 1 uses **Virtual Reserves** to simulate liquidity density without requiring an initial deposit.

### 1.1 Reserve Invariants
Let $V_{sol}$ and $V_{token}$ be the virtual reserves. The pricing follows the Constant Product Invariant:
$$V_{sol} \times V_{token} = k$$

At genesis ($t_0$), the protocol initializes with:
* **$V_{sol(0)}$**: $30$ SOL (The "Virtual Advance")
* **$V_{token(0)}$**: $1,073,000,000$ units
* **Real Tokens**: $793,100,000$ (The amount available for purchase)

The price $P$ at any point $x$ (SOL contributed) is the derivative of the curve:
$$P(x) = \frac{V_{sol(0)} + x}{V_{token(0)} - \text{tokens\_out}}$$

### 1.2 Graduation Threshold ($B$)
Migration is triggered when the `real_sol_reserves` reach the critical bound $B \approx 85$ SOL. At this state transition:
1.  **SOL Accumulated**: $85$ SOL from users.
2.  **Tokens Remaining**: Exactly $206,900,000$ tokens (The "Migration Pack").
3.  **Total Virtual SOL**: $30 \text{ (virtual)} + 85 \text{ (real)} = 115$ SOL.

---

## 2. The Migration Mechanism: $S_{virtual} \rightarrow S_{amm}$

When `complete == true`, the `migrate` instruction is called. This is a non-reversible state change that moves liquidity to **PumpSwap** (native) or **Raydium**.

### 2.1 The Liquidity Density Shift
Inside the bonding curve, the "smoothness" of the price is protected by the **30 SOL Virtual Advance**. Upon migration, the protocol **reclaims** that virtual SOL, which creates a massive delta in liquidity depth.

![Virtual vs Real Liquidity Density Drop](https://i.ibb.co/gMw95RjY/Gemini-Generated-Image-n8ai7hn8ai7hn8ai.png)

| Metric | Pre-Migration (VBC) | Post-Migration (AMM) |
| :--- | :--- | :--- |
| **SOL Reserve** | $115$ SOL (Virtual + Real) | **$85$ SOL** (Real Only) |
| **Token Reserve** | $206.9$M Tokens | $206.9$M Tokens |
| **Invariant ($k$)** | $k_{vbc} \approx 2.37 \times 10^{10}$ | **$k_{amm} \approx 1.75 \times 10^{10}$** |

> [!CAUTION]
> **The "Density Drop":** Because the invariant $k$ drops by **~26%** instantly, the price becomes significantly more volatile. The same 1 SOL sell order that moved the price by $0.5\%$ on the curve will move it by $\approx 1.8\%$ on the DEX.

---

## 3. The "Migration Fee" & Systematic Extraction

While Pump.fun advertises "Free Launching," the protocol extracts significant value during the graduation event. Critics refer to this as the **"Liquidity Trap."**

### 3.1 The SOL Extraction Formula (The "Scam" Analysis)

![Pump.fun Liquidity Trap Value Loss](https://i.ibb.co/xqx2jG3q/Gemini-Generated-Image-v8zqllv8zqllv8zq.png)

During the migration from the curve to the DEX, the protocol handles the $85$ SOL raised as follows:

1.  **Protocol Skim**: Before PumpSwap, the protocol took a **6 SOL Migration Fee**. This meant $85$ SOL was raised, but only $79$ SOL reached the pool.
2.  **Virtual Reclaim**: The $30$ SOL virtual reserve is removed. This money was never there to begin with, but it "fooled" the curve into higher liquidity density.
3.  **The Result**: The token enters the open market with **7% to 10% less backing** than the users' collective input, while the protocol keeps the 1% swap fees collected throughout the entire bonding process.

### 3.2 Late-Buyer Asymptotics
As the curve approaches $100\%$, the price flattens ($dP/dx \rightarrow 0$). Buyers at $99\%$ are purchasing tokens at a "Virtual Premium." The moment migration occurs and the 30 SOL floor is pulled:
$$Value\_Loss = \left( 1 - \frac{k_{amm}}{k_{vbc}} \right) \approx 26.08\%$$
This means late buyers are mathematically "exit liquidity" for the protocol's migration fees.

---

## 4. Implementation & Analysis Scripts

```python
# derive_migration_matrix.py
def calculate_graduation_impact(real_sol_raised, virtual_sol_advance):
    v_total = real_sol_raised + virtual_sol_advance
    density_drop = (real_sol_raised / v_total) * 100
    return f"Liquidity Density Drop: {100 - density_drop:.2f}%"

print(calculate_graduation_impact(85, 30))
# Output: Liquidity Density Drop: 26.09%
