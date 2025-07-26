# Installing the Sui Wallet Browser Extension

## Chrome / Brave / Edge Installation Steps

1. Open your browser and go to the Chrome Web Store: https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil

2. Click the "Add to Chrome" button on the Sui Wallet extension page.

3. A popup will appear asking for confirmation. Click "Add extension".

4. After installation, you should see the Sui Wallet icon in your browser's extension toolbar (top-right corner).

5. Click on the Sui Wallet icon to set up your wallet:
   - Create a new wallet or import an existing one
   - Set a password for your wallet
   - Securely store your recovery phrase

6. Once set up, you can connect to your application by:
   - Running your application locally
   - Clicking the "Connect Sui Wallet" button in your application
   - Approving the connection request in the Sui Wallet popup

## Troubleshooting

If you're still seeing "Sui Wallet extension not found" after installation:

1. Make sure the extension is enabled:
   - Click the extensions icon in your browser (puzzle piece)
   - Verify Sui Wallet is listed and enabled

2. Try refreshing your application page

3. Restart your browser

4. Check if your application is looking for the correct wallet interface. The Sui Wallet extension should expose a `window.suiWallet` object.

## Alternative Wallets

If you prefer, you can also use other Sui-compatible wallets:

- Ethos Wallet: https://chrome.google.com/webstore/detail/ethos-wallet/mcbigmjiafegjnnogedioegffbooigli
- Suiet Wallet: https://chrome.google.com/webstore/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd

These may require code adjustments to work with your application.