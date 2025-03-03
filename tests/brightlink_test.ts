import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Enhanced profile and contact management tests",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Test profile creation with new fields
    let block = chain.mineBlock([
      Tx.contractCall('brightlink', 'create-profile',
        [types.ascii("John Doe"), types.ascii("Engineer"), types.ascii("About me")],
        deployer.address
      )
    ]);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk();

    // Test adding contact with category
    block = chain.mineBlock([
      Tx.contractCall('brightlink', 'create-profile',
        [types.ascii("Jane"), types.ascii("Designer"), types.ascii("About")],
        wallet1.address
      ),
      Tx.contractCall('brightlink', 'add-contact',
        [
          types.principal(wallet1.address),
          types.ascii("Met at meetup"),
          types.ascii("professional")
        ],
        deployer.address
      )
    ]);
    block.receipts[1].result.expectOk();

    // Test contact archiving
    block = chain.mineBlock([
      Tx.contractCall('brightlink', 'archive-contact',
        [types.principal(wallet1.address)],
        deployer.address
      )
    ]);
    block.receipts[0].result.expectOk();

    // Test reminder with timestamp validation
    const futureTimestamp = chain.blockHeight + 100;
    block = chain.mineBlock([
      Tx.contractCall('brightlink', 'set-reminder',
        [
          types.principal(wallet1.address),
          types.uint(futureTimestamp),
          types.ascii("Follow up meeting")
        ],
        deployer.address
      )
    ]);
    block.receipts[0].result.expectOk();
  }
});
