// Test file to check if @mysten/sui.js can be imported correctly
import { Connection, JsonRpcProvider, TransactionBlock } from '@mysten/sui.js';

// Just a simple function to use the imported types
function testSui() {
  const connection = new Connection({
    fullnode: 'https://fullnode.testnet.sui.io:443'
  });
  const provider = new JsonRpcProvider(connection);
  const tx = new TransactionBlock();
  
  console.log('Successfully imported @mysten/sui.js');
  return { provider, tx };
}

testSui();