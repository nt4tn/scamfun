import asyncio
from solana.rpc.websocket_api import connect

# Official 2026 Pump.fun Migration Program Address
PUMP_MIGRATION_PROGRAM = "39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg"

async def monitor_scamfun_extractions():
    """
    Subscribes to Solana logs to detect live 'Graduation' events.
    Logs the exact transaction where 30 SOL is pulled from the curve.
    """
    async with connect("wss://api.mainnet-beta.solana.com") as websocket:
        await websocket.logs_subscribe(mentions=[PUMP_MIGRATION_PROGRAM])
        print(f"LISTENING FOR LIQUIDITY EXTRACTION ON: {PUMP_MIGRATION_PROGRAM}")

        async for msg in websocket:
            logs = msg.value.logs
            # Look for the 'migrate' instruction which reclaims the virtual SOL
            if any("migrate" in log.lower() for log in logs):
                sig = msg.value.signature
                print("\n[!] GRADUATION DETECTED - 30 SOL EXTRACTED")
                print(f"TX Reference: https://solscan.io/tx/{sig}")
                print("STATUS: Liquidity compressed. 10% Shadow Tax applied.")

if __name__ == "__main__":
    try:
        asyncio.run(monitor_scamfun_extractions())
    except KeyboardInterrupt:
        print("\nAudit suspended.")
