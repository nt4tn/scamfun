# migration_listener.py
# Uses Solana WebSocket to track migrations to PumpSwap/Raydium

import asyncio
from solana.rpc.websocket_api import connect

# The canonical Pump.fun Migration Account (2025/2026)
MIGRATION_PROGRAM_ID = "39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg"

async def main():
    async with connect("wss://api.mainnet-beta.solana.com") as websocket:
        # Subscribe to all transactions involving the migration account
        await websocket.logs_subscribe(
            mentions=[MIGRATION_PROGRAM_ID]
        )
        print(f"Monitoring Migration Events for {MIGRATION_PROGRAM_ID}...")

        async for msg in websocket:
            for log in msg.value.logs:
                if "migrate" in log.lower() or "initialize2" in log.lower():
                    print("\n[!] GRADUATION DETECTED")
                    print(f"Transaction: https://solscan.io/tx/{msg.value.signature}")
                    print("Status: 30 SOL Virtual Advance Reclaimed by Protocol.")

if __name__ == "__main__":
    asyncio.run(main())
