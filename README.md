
# Campus Events Portal

An interactive platform for students to discover, track, and engage with campus events. Built with React, TypeScript, and Tailwind CSS.

## Project info

**URL**: https://lovable.dev/projects/8b192bdc-6e13-452c-9db7-c2048c76e310

## Features

### Core Features
- **Interactive Event Calendar**: View events in daily, weekly, and monthly formats
- **Event Details**: Get comprehensive information about each event
- **Campus Map**: Interactive 3D map showing event locations
- **Responsive Design**: Works on all devices

### New Features
- **QR Code Check-in System**: Scan QR codes at events to check in and earn points
- **Progressive Web App (PWA)**: Install the app on your device for offline access
- **Smart Event Recommendations**: Get personalized event suggestions based on your preferences and schedule

## How to Use New Features

### QR Code Check-in
1. Navigate to an event's detail page
2. Click on the "Check-in" tab
3. Use the QR code scanner to scan the event's QR code
4. After successful check-in, you'll earn points and can see who else is attending in the "Networking" tab

### PWA Installation
- On Chrome/Edge: Look for the install icon in the address bar
- On iOS Safari: Tap the share button and select "Add to Home Screen"
- On Android Chrome: Tap the menu button and select "Add to Home Screen"

### Smart Recommendations
- View personalized event recommendations at the top of the Calendar page
- Recommendations are based on your past attendance patterns and schedule

## Testing Locally

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

## Deployment

Deploy to Vercel with:

```sh
npm run build
vercel --prod
```

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- react-qr-code
- react-qr-reader

## How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License

MIT
