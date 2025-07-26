import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';


const SUI_NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet';
const PACKAGE_ID = process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID || '';
const MODULE_NAME = 'escrow';


export const getProvider = () => {
  return new SuiClient({
    url: SUI_NETWORK === 'mainnet'
      ? 'https://fullnode.mainnet.sui.io:443'
      : 'https://fullnode.testnet.sui.io:443'
  });
};

// Escrow contract interface
export interface EscrowData {
  jobId: number;
  client: string;
  freelancer: string;
  amount: number;
}

// Create a new escrow
export async function createEscrow(
  { jobId, client, freelancer, amount }: EscrowData
) {
  try {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_escrow`,
      arguments: [
        tx.pure(jobId),
        tx.pure(client),
        tx.pure(freelancer),
        tx.pure(amount),
      ],
    });

    return tx;
  } catch (error) {
    console.error('Error creating escrow transaction:', error);
    throw error;
  }
}

// Lock funds in escrow
export async function lockFunds(
  escrowObjectId: string,
  amount: number
) {
  try {
    const tx = new Transaction();
    
    // Create a coin object with the specified amount
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::lock_funds`,
      arguments: [
        tx.object(escrowObjectId),
        coin,
      ],
    });

    return tx;
  } catch (error) {
    console.error('Error creating lock funds transaction:', error);
    throw error;
  }
}

// Release funds to freelancer
export async function releaseFunds(
  escrowObjectId: string,
  freelancerAddress: string
) {
  try {
    const tx = new Transaction();
    
    // Call release_funds and get the coin
    const coin = tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::release_funds`,
      arguments: [tx.object(escrowObjectId)],
    });
    
    // Transfer the coin to the freelancer
    tx.transferObjects([coin], tx.pure(freelancerAddress));

    return tx;
  } catch (error) {
    console.error('Error creating release funds transaction:', error);
    throw error;
  }
}

// Raise a dispute
export async function raiseDispute(
  escrowObjectId: string
) {
  try {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::raise_dispute`,
      arguments: [tx.object(escrowObjectId)],
    });

    return tx;
  } catch (error) {
    console.error('Error creating raise dispute transaction:', error);
    throw error;
  }
}

// Refund to client (dispute resolution)
export async function disputeRefund(
  escrowObjectId: string,
  clientAddress: string
) {
  try {
    const tx = new Transaction();
    
    // Call dispute_refund and get the coin
    const coin = tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::dispute_refund`,
      arguments: [tx.object(escrowObjectId)],
    });
    
    // Transfer the coin back to the client
    tx.transferObjects([coin], tx.pure(clientAddress));

    return tx;
  } catch (error) {
    console.error('Error creating dispute refund transaction:', error);
    throw error;
  }
}

// Get escrow information
export async function getEscrowInfo(
  provider: SuiClient,
  escrowObjectId: string
) {
  try {
    const object = await provider.getObject({
      id: escrowObjectId,
      options: {
        showContent: true,
      },
    });
    
    return object;
  } catch (error) {
    console.error('Error getting escrow info:', error);
    throw error;
  }
}