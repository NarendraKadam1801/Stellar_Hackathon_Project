# Authentication Guide

This document explains the authentication flow for NGOs and Users in the AidBridge platform.

## Two Types of Authentication

### 1. NGO Authentication (Login/Signup)
- **Purpose**: For NGOs to manage donations, create tasks, and access the dashboard
- **Method**: Email/Password authentication
- **Pages**: 
  - `/ngo/login` - NGO login page
  - `/ngo/signup` - NGO registration page
  - `/ngo-dashboard` - NGO dashboard (requires authentication)
- **Features**:
  - Create donation tasks
  - View received donations
  - Upload proof of fund usage
  - Manage NGO profile

### 2. User Wallet Connection (Freighter)
- **Purpose**: For users to donate to NGO tasks
- **Method**: Freighter wallet connection (Stellar blockchain)
- **How it works**:
  - Users click "Connect Wallet" button
  - Freighter extension prompts for permission
  - Once connected, users can donate to any task
- **No signup required**: Users only need to connect their Stellar wallet

## Freighter Wallet Integration

### Installation
Users need to install the Freighter browser extension from [freighter.app](https://freighter.app)

### API Integration
The app uses the official Freighter API loaded via CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-freighter-api/5.0.0/index.min.js"></script>
```

### Key Methods Used
1. **isConnected()** - Check if Freighter is installed
2. **requestAccess()** - Request permission to access user's public key
3. **getAddress()** - Get the user's Stellar public key
4. **signTransaction()** - Sign donation transactions
5. **getNetwork()** - Get the current network (testnet/mainnet)

## Logout Functionality

### NGO Logout
- Clears NGO authentication data
- Keeps wallet connection intact
- Redirects to home page

### Full Logout (Clear All)
- Clears ALL browser data:
  - localStorage (NGO auth, wallet data)
  - sessionStorage
  - All cookies
- Disconnects wallet
- Logs out NGO
- Redirects to home page

### Logout Buttons in Header
- **NGO Logout**: Only logs out NGO account
- **Clear All**: Red button that clears everything (shown when either NGO or wallet is connected)

## Data Storage

### NGO Authentication
- **localStorage**: `accessToken`, `refreshToken`, `ngo_profile`
- **Cookies**: Same data for backend authentication

### Wallet Connection
- **localStorage**: `wallet_connected`, `wallet_type`, `wallet_publicKey`
- No cookies needed (wallet is client-side only)

## Security Notes

1. **NGO Authentication**: Uses JWT tokens with refresh mechanism
2. **Wallet Connection**: No private keys are stored - only public keys
3. **Transaction Signing**: Always done through Freighter extension (secure)
4. **Logout**: Comprehensive cleanup of all sensitive data

## User Flow Examples

### Donor Flow
1. Visit homepage
2. Click "Connect Wallet"
3. Approve Freighter permission
4. Browse tasks and donate
5. (Optional) Click "Clear All" to disconnect

### NGO Flow
1. Visit homepage
2. Click "NGO Login" or go to `/ngo/login`
3. Login or signup
4. Access NGO dashboard
5. Create tasks, view donations
6. (Optional) Connect wallet to receive donations
7. Click "Logout" to logout or "Clear All" to clear everything

## Technical Implementation

### Files Modified
- `/frontend/app/layout.tsx` - Added Freighter API script
- `/frontend/lib/redux/slices/wallet-slice.ts` - Proper Freighter integration
- `/frontend/lib/wallet-connectors.ts` - Updated to use official API
- `/frontend/components/header.tsx` - Separate NGO and wallet sections
- `/frontend/lib/logout-utils.ts` - Comprehensive logout utilities

### Key Features
- Proper error handling for wallet connection
- Clear separation between NGO and user authentication
- Comprehensive logout that clears all browser data
- Persistent wallet connection across page refreshes
- Support for multiple wallet types (Freighter primary)
