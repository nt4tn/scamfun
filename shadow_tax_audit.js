/**
 * @file shadow_tax_audit.js
 * @description Analyzes the disparity between "Creator Fee Reclaims" and Protocol Extraction.
 * Validates the "10% Shadow Tax" hypothesis in the 2026 Pump.fun fee model.
 */

const VIRTUAL_ADVANCE = 30.0; // SOL reclaimed by protocol at migration
const GRADUATION_THRESHOLD = 85.0; // SOL raised from traders
const SWAP_FEE_RATE = 0.01; // 1% flat fee on bonding curve
const CREATOR_REBATE_RATE = 0.0005; // 0.05% typical rebate in 2026

function auditLifecycle(totalVolume) {
    // 1. Calculate fees extracted during bonding
    const totalFeesCollected = totalVolume * SWAP_FEE_RATE;
    
    // 2. Calculate the "Reclaim" rebate offered to the developer
    const creatorRebate = totalVolume * CREATOR_REBATE_RATE;
    
    // 3. The "Shadow" Extraction (Reclaimed Virtual Liquidity)
    const protocolNetExtraction = totalFeesCollected + VIRTUAL_ADVANCE - creatorRebate;

    // 4. Disparity Analysis
    const extractionRatio = protocolNetExtraction / creatorRebate;
    const shadowTaxPercentage = ((VIRTUAL_ADVANCE / GRADUATION_THRESHOLD) * 100).toFixed(2);

    console.log("--- PUMP.FUN SHADOW TAX AUDIT ---");
    console.log(`Total Volume Analyzed: ${totalVolume} SOL`);
    console.log(`Fees Paid by Traders: ${totalFeesCollected.toFixed(4)} SOL`);
    console.log(`Developer Rebate (The "Bait"): ${creatorRebate.toFixed(4)} SOL`);
    console.log(`---------------------------------`);
    console.log(`Protocol Net Extraction: ${protocolNetExtraction.toFixed(4)} SOL`);
    console.log(`Extraction Ratio: ${extractionRatio.toFixed(2)}x (Protocol takes ${extractionRatio.toFixed(2)} SOL for every 1 SOL rebated)`);
    console.log(`Liquidity Compression Tax: ${shadowTaxPercentage}% of total capital raised.`);
}

// Example: Audit a project with 5,000 SOL in total bonding curve volume
auditLifecycle(5000);
