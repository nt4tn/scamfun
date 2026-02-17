/**
 * @file shadow_tax_audit.js
 * @description Analyzes the 2026 "Creator Fee Reclaim" structural deficit.
 */

const VIRTUAL_ADVANCE = 30.0;     // SOL reclaimed by protocol at migration
const GRADUATION_THRESHOLD = 85.0; // SOL raised from traders
const PROTOCOL_SWAP_FEE = 0.01;   // 1% flat fee on bonding curve
const CREATOR_REBATE_RATE = 0.0005; // 0.05% typical rebate (50% of PumpSwap 0.1% fee)

/**
 * Simulates the net flow of capital for a graduated token.
 * @param {number} totalBondingVolume - Total volume (SOL) traded during the bonding phase.
 */
function runShadowAudit(totalBondingVolume) {
    const tradersPaid = totalBondingVolume * PROTOCOL_SWAP_FEE;
    const devRebate = totalBondingVolume * CREATOR_REBATE_RATE;
    
    // The "Shadow Extraction" includes the 30 SOL and the un-rebated swap fees
    const protocolRetention = tradersPaid - devRebate;
    const totalExtraction = protocolRetention + VIRTUAL_ADVANCE;

    // The Shadow Tax is the ratio of what the protocol keeps vs what it gives back
    const shadowTaxRatio = (totalExtraction / devRebate).toFixed(2);
    const capitalLossAtGraduation = ((VIRTUAL_ADVANCE / (GRADUATION_THRESHOLD + VIRTUAL_ADVANCE)) * 100).toFixed(2);

    console.log("==========================================");
    console.log("   PUMP.FUN 2026 SHADOW TAX AUDITOR       ");
    console.log("==========================================");
    console.log(`Bonding Curve Volume:   ${totalBondingVolume} SOL`);
    console.log(`Fees Taken from Pool:   ${tradersPaid.toFixed(4)} SOL`);
    console.log(`Developer "Reclaim":    ${devRebate.toFixed(4)} SOL`);
    console.log("------------------------------------------");
    console.log(`Protocol Extraction:    ${totalExtraction.toFixed(4)} SOL`);
    console.log(`Shadow Tax Multiplier:  ${shadowTaxRatio}x`);
    console.log(`Liquidity Density Drop: ${capitalLossAtGraduation}%`);
    console.log("==========================================");
    console.log("VERDICT: For every 1 SOL rebated, the protocol");
    console.log(`extracts ${shadowTaxRatio} SOL from the token's ecosystem.`);
}

// Typical "successful" curve with 4,500 SOL in rotational volume
runShadowAudit(4500);
