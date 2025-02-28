import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Profile creation and update tests",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Test profile creation
    let block = chain.mineBlock([
      Tx.contractCall('brightlink', 'create-profile',
        [types.ascii("John Doe"), types.ascii("Engineer"), types.ascii("About me")],
        deployer.address
      )
    ]);
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk();

    // Test duplicate profile creation (should fail)
    block = chain.mineBlock([
      Tx.contractCall('brightlink', 'create-profile',
        [types.ascii("John Doe"), types.ascii("Engineer"), types.ascii("About me")],
        deployer.address
      )
    ]);
    block.receipts[0].result.expectErr().expectUint(100);

    // Test profile update
    block = chain.mineBlock([
      Tx.contractCall('brightlink', 'update-profile',
        [types.ascii("John Doe"), types.ascii("Senior Engineer"), types.ascii("Updated about")],
        deployer.address
      )
    ]);
    block.receipts[0].result.expectOk();
  }
});

Clarinet.test({
  name: "Contact management tests",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Create profiles first
    let block = chain.mineBlock([
      Tx.contractCall('brightlink', 'create-profile',
        [types.ascii("John"), types.ascii("Engineer"), types.ascii("About")],
        deployer.address
      ),
      Tx.contractCall('brightlink', 'create-profile',
        [types.ascii("Jane"), types.ascii("Designer"), types.ascii("About")],
        wallet1.address
      )
    ]);

    // Test adding contact
    block = chain.mineBlock([
      Tx.contractCall('brightlink', 'add-contact',
        [types.principal(wallet1.address), types.ascii("Met at meetup")],
        deployer.address
      )
    ]);
    block.receipts[0].result.expectOk();

    // Test updating contact notes
    block = chain.mineBlock([
      Tx.contractCall('brightlink', 'update-contact-notes',
        [types.principal(wallet1.address), types.ascii("Updated notes")],
        deployer.address
      )
    ]);
    block.receipts[0].result.expectOk();
  }
});

Clarinet.test({
  name: "Reminder management tests", 
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Setup profiles and contact
    let block = chain.mineBlock([
      Tx.contractCall('brightlink', 'create-profile',
        [types.ascii("John"), types.ascii("Engineer"), types.ascii("About")],
        deployer.address
      ),
      Tx.contractCall('brightlink', 'create-profile',
        [types.ascii("Jane"), types.ascii("Designer"), types.ascii("About")],
        wallet1.address
      ),
      Tx.contractCall('brightlink', 'add-contact',
        [types.principal(wallet1.address), types.ascii("Met at meetup")],
        deployer.address
      )
    ]);

    // Test setting reminder
    block = chain.mineBlock([
      Tx.contractCall('brightlink', 'set-reminder',
        [types.principal(wallet1.address), types.uint(1642147200), types.ascii("Follow up meeting")],
        deployer.address
      )
    ]);
    block.receipts[0].result.expectOk();
  }
});
