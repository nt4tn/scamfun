import math

class MigrationForensics:
    def __init__(self, real_sol=85.0, virtual_advance=30.0):
        self.real_sol = real_sol
        self.virtual_advance = virtual_advance
        self.total_supply = 1_073_000_000
        self.migration_pack = 206_900_000

    def calculate_impact(self, sol_input, is_post_migration=False):
        """Calculates price impact (slippage) for a 1 SOL trade."""
        current_sol = self.real_sol if is_post_migration else (self.real_sol + self.virtual_advance)
        # Constant Product: x * y = k
        k = current_sol * self.migration_pack
        new_sol = current_sol + sol_input
        new_token_reserve = k / new_sol
        tokens_out = self.migration_pack - new_token_reserve
        price_impact = (tokens_out / self.migration_pack) * 100
        return price_impact

    def run_report(self):
        impact_pre = self.calculate_impact(1.0, False)
        impact_post = self.calculate_impact(1.0, True)
        escalation = impact_post / impact_pre

        print("--- LIQUIDITY COMPRESSION REPORT ---")
        print(f"Pre-Migration Slippage (1 SOL):  {impact_pre:.4f}%")
        print(f"Post-Migration Slippage (1 SOL): {impact_post:.4f}%")
        print(f"Volatility Escalation:           {escalation:.2f}x")
        print("------------------------------------")
        print(f"CONCLUSION: The token is {((escalation-1)*100):.1f}% more volatile")
        print("due to the protocol's 30 SOL extraction.")

if __name__ == "__main__":
    MigrationForensics().run_report()
