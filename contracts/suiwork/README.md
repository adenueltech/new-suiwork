# Sui Smart Contract Integration Guide

This guide will help you set up the Sui development environment, compile and deploy the smart contract, and integrate it with your Next.js application.

## 1. Install the Sui SDK

First, you need to install the Sui SDK in your project:

```bash
npm install @mysten/sui.js
# or
yarn add @mysten/sui.js
# or
pnpm add @mysten/sui.js
```

## 2. Install the Sui CLI

To compile and deploy your smart contract, you need to install the Sui CLI:

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui
```

Verify the installation:

```bash
sui --version
```

## 3. Compile and Publish the Smart Contract

Navigate to your contract directory and build the contract:

```bash
cd contracts/suiwork
sui move build
```

If the build is successful, you can publish the contract to the Sui testnet:

```bash
sui client switch --env testnet
sui client publish --gas-budget 100000000
```

After publishing, you'll receive a package ID. Update your `.env.local` file with this ID:

```
NEXT_PUBLIC_SUIWORK_PACKAGE_ID=your_package_id_here
```

## 4. Start the Next.js Development Server

Now you can start your Next.js development server to test the integration:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 5. Testing the Integration

1. Navigate to the Escrow page at http://localhost:3000/escrow
2. Switch to the "Sui Blockchain Escrow" tab
3. Fill in the required fields:
   - Private Key: Your Sui wallet private key
   - Job ID: A numeric identifier for the job
   - Client Address: The Sui address of the client
   - Freelancer Address: The Sui address of the freelancer
   - Amount: The amount of SUI to lock in escrow
4. Click "Create Escrow" to create a new escrow contract
5. Once created, you can use the "Lock Funds" and "Release Funds" buttons to test the escrow functionality

## Important Notes

1. **Private Keys**: Never share your private keys or commit them to version control. The private key input in the UI is for testing purposes only.

2. **Testnet Funds**: You'll need testnet SUI tokens to test the contract. You can get them from the Sui testnet faucet.

3. **Error Handling**: If you encounter any errors, check the browser console for detailed error messages.

4. **Package ID**: Make sure to update the `NEXT_PUBLIC_SUIWORK_PACKAGE_ID` in your `.env.local` file with the actual package ID after publishing.

5. **Production Deployment**: For production, you would need to implement proper wallet connection and key management rather than directly inputting private keys.

## Smart Contract Structure

The escrow smart contract (`escrow.move`) implements the following functionality:

1. **Create Escrow**: Creates a new escrow contract between a client and freelancer
2. **Lock Funds**: Allows the client to lock funds in the escrow
3. **Release Funds**: Allows the client to release funds to the freelancer
4. **Raise Dispute**: Allows either party to raise a dispute
5. **Dispute Refund**: Allows the client to get a refund in case of a dispute

## TypeScript Integration

The TypeScript integration (`lib/sui.ts`) provides functions to interact with the smart contract:

1. **createEscrow**: Creates a new escrow contract
2. **lockFunds**: Locks funds in an existing escrow
3. **releaseFunds**: Releases funds to the freelancer
4. **raiseDispute**: Raises a dispute on an escrow
5. **disputeRefund**: Processes a refund to the client