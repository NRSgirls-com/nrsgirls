# DJ Portal - NRSgirls Platform

## Overview
The DJ Portal is the central hub for DJs to manage their profile, upload music, control live streams, and track their earnings.

## Features

### 1. DJ Enrollment
- Multi-step registration process
- Profile creation (bio, genres, avatar)
- Equipment and experience information
- Payment information setup (W-9/W-8BEN, bank details)
- Terms of service and creator agreement

### 2. Music Upload & Library Management
- Drag-and-drop MP3 upload interface
- Batch upload support
- Progress tracking for uploads
- Automatic virus scanning
- Audio format validation
- Metadata editing (title, artist, genre, BPM)
- Track organization (playlists, folders)
- Storage quota tracking
- Search and filter capabilities

### 3. Live Mixing Dashboard
- Audio mixer interface with multiple channels
- Track queuing system
- Crossfader and EQ controls
- Real-time waveform display
- Streaming quality settings (bitrate, resolution)
- Viewer count and analytics
- Live chat integration
- Moderation tools
- Recording controls
- Multi-platform streaming setup

### 4. Analytics & Earnings
- Real-time viewer statistics
- Engagement metrics (likes, comments, shares)
- Revenue tracking by stream
- Historical performance data
- Audience demographics
- Peak viewing times
- Payout schedule and history
- Tax documentation (1099 forms)
- Referral earnings

### 5. Profile Management
- Public profile customization
- Streaming schedule
- Social media links
- Portfolio/mix history
- Follower management
- Notification preferences

## Technology Stack
- **Framework**: React with Next.js
- **State Management**: Redux or Zustand
- **Audio Processing**: Web Audio API, Tone.js
- **File Upload**: Uppy or react-dropzone
- **Charts/Analytics**: Chart.js or Recharts
- **Real-time**: WebSocket for live features
- **API**: REST and GraphQL endpoints

## Components

### Dashboard Components
- `DashboardLayout.jsx` - Main dashboard layout
- `Sidebar.jsx` - Navigation sidebar
- `UploadZone.jsx` - File upload interface
- `MusicLibrary.jsx` - Track library display
- `LiveMixer.jsx` - Live mixing interface
- `Analytics.jsx` - Performance analytics
- `EarningsPanel.jsx` - Revenue tracking
- `ProfileEditor.jsx` - Profile management
- `StreamScheduler.jsx` - Scheduling interface

### Upload Components
- `FileDropzone.jsx` - Drag-and-drop upload
- `UploadProgress.jsx` - Upload progress indicator
- `MetadataEditor.jsx` - Track metadata editing
- `BulkUpload.jsx` - Multiple file upload

### Mixer Components
- `AudioMixer.jsx` - Main mixing interface
- `ChannelStrip.jsx` - Individual channel controls
- `Equalizer.jsx` - EQ interface
- `Crossfader.jsx` - Crossfade control
- `WaveformDisplay.jsx` - Audio waveform visualization
- `TrackQueue.jsx` - Upcoming tracks queue
- `LiveChat.jsx` - Integrated chat

### Analytics Components
- `RevenueChart.jsx` - Earnings visualization
- `ViewerStats.jsx` - Viewer statistics
- `EngagementMetrics.jsx` - Engagement data
- `AudienceInsights.jsx` - Demographic data

## File Structure
```
dj-portal/
├── components/
│   ├── dashboard/
│   ├── upload/
│   ├── mixer/
│   ├── analytics/
│   └── shared/
├── pages/
│   ├── dashboard.jsx
│   ├── upload.jsx
│   ├── library.jsx
│   ├── live.jsx
│   ├── analytics.jsx
│   ├── earnings.jsx
│   └── profile.jsx
├── hooks/
│   ├── useAudioUpload.js
│   ├── useAudioMixer.js
│   ├── useStreamingSession.js
│   └── useAnalytics.js
├── utils/
│   ├── audioProcessing.js
│   ├── fileValidation.js
│   └── streaming.js
├── styles/
└── README.md
```

## API Endpoints Used
- `POST /api/dj/register` - DJ enrollment
- `GET /api/dj/profile` - Get DJ profile
- `PUT /api/dj/profile` - Update profile
- `POST /api/dj/upload-track` - Upload music
- `GET /api/dj/tracks` - Get track library
- `DELETE /api/dj/track/:id` - Delete track
- `POST /api/dj/start-stream` - Start live stream
- `POST /api/dj/end-stream` - End stream
- `GET /api/dj/analytics` - Get analytics data
- `GET /api/dj/earnings` - Get earnings data

## User Flows

### Enrollment Flow
1. Registration form (email, password, DJ name)
2. Profile creation (bio, genres, photo)
3. Payment setup (tax forms, bank info)
4. Terms acceptance
5. Email verification
6. Dashboard onboarding tour

### Upload Flow
1. Select files or drag-and-drop
2. Automatic virus scan
3. Metadata extraction
4. Edit track information
5. Upload to library
6. Organization (playlists/folders)

### Live Streaming Flow
1. Select tracks for session
2. Configure stream settings
3. Start stream
4. Live mixing and audience interaction
5. Monitor analytics
6. End stream
7. Review session analytics

## Security Features
- Secure file upload with validation
- Virus scanning on all uploads
- Copyright detection
- Two-factor authentication
- Session management
- Rate limiting on uploads

## Performance Optimization
- Lazy loading of components
- Code splitting by route
- Image optimization
- Audio file compression
- CDN for static assets
- Caching strategies

## Accessibility
- Keyboard shortcuts for mixing
- Screen reader support for analytics
- High contrast mode
- Focus management
- ARIA labels for custom controls

## Testing
- Unit tests for all components
- Integration tests for user flows
- Audio processing tests
- Upload functionality tests
- E2E tests for critical paths
