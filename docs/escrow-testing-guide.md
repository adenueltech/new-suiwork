# Escrow Smart Contract Testing Guide

This guide explains how to test the SuiWork escrow smart contract functionality to ensure it's working correctly.

## Overview

The escrow system in SuiWork allows clients and freelancers to safely transact with each other. The escrow smart contract has the following key functions:

1. **Create Escrow**: Creates a new escrow contract for a job
2. **Lock Funds**: Client locks funds in the escrow
3. **Release Funds**: Client releases funds to the freelancer upon job completion
4. **Raise Dispute**: Either party can raise a dispute
5. **Dispute Refund**: Refunds funds to the client in case of a dispute

## Prerequisites

Before testing the escrow functionality, ensure you have:

1. A Sui wallet (like Sui Wallet or Slush Wallet) installed and connected
2. Some SUI tokens in your wallet for testing (use the Sui testnet faucet if needed)
3. Access to both a client and freelancer account (you can create two accounts for testing)

## Testing Flow

### 1. Setup Test Accounts

1. Create or use two different accounts:
   - One as a client
   - One as a freelancer

2. Ensure the client account has sufficient SUI tokens for testing.

### 2. Create a Test Job

1. Log in as the client
2. Navigate to the dashboard
3. Click "Post New Job"
4. Fill in the job details and submit
5. Note the job ID for later use

### 3. Submit a Proposal (as Freelancer)

1. Log in as the freelancer
2. Find the job posted by the client
3. Click "Apply" and submit a proposal
4. Log back in as the client to accept the proposal

### 4. Test Escrow Creation

1. Log in as the client
2. Navigate to the job details page
3. Click on "Create Escrow"
4. Fill in the following details:
   - Job ID: The ID of the test job
   - Freelancer Address: The wallet address of the freelancer
   - Amount: The agreed amount in SUI
5. Click "Create Escrow"
6. Verify that a transaction is created and executed
7. Check that the escrow ID is returned and displayed

### 5. Test Locking Funds

1. With the escrow created, enter the escrow ID in the "Escrow ID" field
2. Enter the amount to lock
3. Click "Lock Funds"
4. Approve the transaction in your wallet
5. Verify that the transaction is successful

### 6. Test Releasing Funds

1. Enter the escrow ID and freelancer address
2. Click "Release Funds"
3. Approve the transaction in your wallet
4. Verify that the transaction is successful
5. Log in as the freelancer to confirm the funds were received

## Troubleshooting

### Transaction Failures

If a transaction fails, check the following:

1. **Wallet Connection**: Ensure your wallet is properly connected
2. **Gas Fees**: Make sure you have enough SUI for gas fees
3. **Correct Addresses**: Verify that all addresses are correct
4. **Network Issues**: Check your internet connection and the Sui network status
5. **Console Logs**: Check browser console logs for any error messages

### Verification Methods

To verify that the escrow contract is working correctly:

1. **Transaction History**: Check your wallet's transaction history
2. **Object Explorer**: Use the Sui Explorer to view the created objects
3. **Balance Changes**: Verify that the balances change as expected in both wallets

## Testing on Testnet vs Mainnet

- **Testnet**: Always test first on the Sui testnet to avoid losing real funds
- **Mainnet**: Only use the mainnet with real funds after thorough testing

## Common Error Messages

| Error Message | Possible Cause | Solution |
|---------------|----------------|----------|
| "Insufficient funds" | Not enough SUI in wallet | Add more SUI to your wallet |
| "Transaction rejected" | User rejected the transaction | Try again and approve the transaction |
| "Object not found" | Incorrect escrow ID | Verify the escrow ID is correct |
| "Unauthorized" | Not the owner of the escrow | Ensure you're using the correct wallet |

## Conclusion

By following this testing flow, you can verify that the escrow smart contract is functioning correctly. If you encounter any issues that aren't covered in this guide, please contact the development team for assistance.