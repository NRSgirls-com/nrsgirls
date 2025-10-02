# Streaming - NRSgirls Backend

## Overview
Streaming infrastructure and integration guides for the NRSgirls platform, supporting live streaming from DJs and performers to multiple platforms simultaneously.

## Streaming Architecture

### Core Components
1. **Streaming Server**: WebRTC/RTMP ingestion
2. **Transcoding Service**: Multi-bitrate encoding
3. **CDN Integration**: Global content delivery
4. **Recording Service**: Stream archiving
5. **Chat Service**: Real-time messaging
6. **Analytics Service**: Viewer tracking

## Streaming Protocols

### WebRTC (Primary)
**Advantages**:
- Ultra-low latency (< 1 second)
- Peer-to-peer capability
- Browser native support
- Interactive features

**Use Cases**:
- Interactive DJ sets
- Performer live streams
- Real-time audience interaction

### RTMP (Broadcast)
**Advantages**:
- Wide software support (OBS, XSplit)
- Reliable streaming protocol
- Good quality at various bitrates

**Use Cases**:
- Professional broadcasts
- Multi-platform streaming
- External encoder compatibility

### HLS (Playback)
**Advantages**:
- Adaptive bitrate streaming
- Wide device compatibility
- CDN-friendly

**Use Cases**:
- Viewer playback
- Recorded content
- Fallback option

## Streaming Server Setup

### WebRTC Server (mediasoup)
```javascript
const mediasoup = require('mediasoup');

// Worker configuration
const workerSettings = {
  logLevel: 'warn',
  logTags: [
    'info',
    'ice',
    'dtls',
    'rtp',
    'srtp',
    'rtcp'
  ],
  rtcMinPort: 40000,
  rtcMaxPort: 49999
};

// Router configuration
const mediaCodecs = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: {
      'x-google-start-bitrate': 1000
    }
  },
  {
    kind: 'video',
    mimeType: 'video/H264',
    clockRate: 90000,
    parameters: {
      'packetization-mode': 1,
      'profile-level-id': '42e01f',
      'level-asymmetry-allowed': 1
    }
  }
];

// Create worker
const worker = await mediasoup.createWorker(workerSettings);

// Create router
const router = await worker.createRouter({ mediaCodecs });
```

### RTMP Server (Node-Media-Server)
```javascript
const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media'
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        hlsKeep: false,
        dash: false
      }
    ]
  }
};

const nms = new NodeMediaServer(config);
nms.run();

// Authentication
nms.on('prePublish', async (id, StreamPath, args) => {
  const streamKey = args.key;
  
  // Verify stream key
  const isValid = await verifyStreamKey(streamKey);
  
  if (!isValid) {
    const session = nms.getSession(id);
    session.reject();
  }
});
```

## Stream Key Management

### Generate Stream Key
```javascript
const crypto = require('crypto');

const generateStreamKey = async (userId, creatorType) => {
  // Create unique stream key
  const streamKey = crypto.randomBytes(16).toString('hex');
  
  // Store in database
  await db.streamKeys.create({
    userId: userId,
    creatorType: creatorType,
    key: streamKey,
    createdAt: new Date(),
    expiresAt: addDays(new Date(), 90), // 90 days validity
    active: true
  });
  
  return streamKey;
};

// Verify stream key
const verifyStreamKey = async (streamKey) => {
  const key = await db.streamKeys.findOne({
    key: streamKey,
    active: true
  });
  
  if (!key) {
    return false;
  }
  
  // Check expiration
  if (new Date() > key.expiresAt) {
    await db.streamKeys.update(key.id, { active: false });
    return false;
  }
  
  return {
    userId: key.userId,
    creatorType: key.creatorType
  };
};
```

### Stream URL Format
```
Primary Stream:
rtmp://stream.nrsgirls.com/live/{streamKey}

WebRTC:
wss://webrtc.nrsgirls.com/stream/{streamKey}

Playback URL:
https://cdn.nrsgirls.com/live/{streamKey}/index.m3u8
```

## Multistreaming Integration

### Supported Platforms
1. YouTube Live
2. Twitch
3. Facebook Live
4. Custom RTMP endpoints

### Configuration
```javascript
const multistreamConfig = {
  youtube: {
    enabled: true,
    rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2/',
    streamKey: 'user-youtube-key',
    maxBitrate: 4500,
    maxResolution: '1080p'
  },
  twitch: {
    enabled: true,
    rtmpUrl: 'rtmp://live.twitch.tv/app/',
    streamKey: 'user-twitch-key',
    maxBitrate: 6000,
    maxResolution: '1080p'
  },
  facebook: {
    enabled: true,
    rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
    streamKey: 'user-facebook-key',
    maxBitrate: 4000,
    maxResolution: '720p'
  },
  custom: [
    {
      name: 'Custom Endpoint 1',
      rtmpUrl: 'rtmp://custom-server.com/live/',
      streamKey: 'custom-key'
    }
  ]
};

// Start multistreaming
const startMultistream = async (streamId, config) => {
  const inputStream = `rtmp://localhost/live/${streamId}`;
  
  for (const platform of Object.keys(config)) {
    if (config[platform].enabled) {
      await startRestream(inputStream, config[platform]);
    }
  }
};

// FFmpeg restreaming
const startRestream = async (input, output) => {
  const ffmpeg = spawn('ffmpeg', [
    '-i', input,
    '-c:v', 'copy',
    '-c:a', 'copy',
    '-f', 'flv',
    `${output.rtmpUrl}${output.streamKey}`
  ]);
  
  ffmpeg.stderr.on('data', (data) => {
    console.log(`FFmpeg: ${data}`);
  });
  
  return ffmpeg;
};
```

## Integration Guides

### YouTube Live Integration

#### Setup Guide
1. **Enable YouTube Live**
   - Go to YouTube Studio
   - Navigate to "Go Live"
   - Enable live streaming

2. **Get Stream Key**
   - In YouTube Studio, go to "Stream settings"
   - Copy your stream key
   - Keep this secure

3. **Configure in NRSgirls**
   - Navigate to DJ/Performer Portal
   - Go to "Streaming Settings"
   - Select "YouTube Live"
   - Paste stream key
   - Save configuration

4. **Stream Requirements**
   - Minimum: 720p at 2500 kbps
   - Recommended: 1080p at 4500 kbps
   - Maximum: 1080p at 6000 kbps
   - Audio: 128 kbps stereo

#### API Integration
```javascript
const { google } = require('googleapis');

// YouTube Data API v3
const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
});

// Create live broadcast
const createYouTubeBroadcast = async (title, description) => {
  const broadcast = await youtube.liveBroadcasts.insert({
    part: 'snippet,status,contentDetails',
    requestBody: {
      snippet: {
        title: title,
        description: description,
        scheduledStartTime: new Date().toISOString()
      },
      status: {
        privacyStatus: 'public'
      },
      contentDetails: {
        enableAutoStart: true,
        enableAutoStop: true
      }
    }
  });
  
  return broadcast.data;
};

// Create live stream
const createYouTubeStream = async (title) => {
  const stream = await youtube.liveStreams.insert({
    part: 'snippet,cdn',
    requestBody: {
      snippet: {
        title: title
      },
      cdn: {
        frameRate: 'variable',
        ingestionType: 'rtmp',
        resolution: 'variable'
      }
    }
  });
  
  return stream.data;
};
```

### Twitch Integration

#### Setup Guide
1. **Get Twitch Stream Key**
   - Go to Twitch Dashboard
   - Navigate to "Settings" > "Stream"
   - Copy your stream key
   - Reset key if compromised

2. **Configure in NRSgirls**
   - Go to "Streaming Settings"
   - Select "Twitch"
   - Paste stream key
   - Save configuration

3. **Stream Requirements**
   - Maximum: 1080p at 6000 kbps
   - Recommended: 720p at 3000-4500 kbps
   - Audio: 160 kbps stereo
   - Keyframe interval: 2 seconds

#### API Integration
```javascript
const axios = require('axios');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN;

// Update stream information
const updateTwitchStream = async (userId, title, game) => {
  const response = await axios.patch(
    `https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`,
    {
      title: title,
      game_id: game
    },
    {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`
      }
    }
  );
  
  return response.data;
};

// Get stream status
const getTwitchStreamStatus = async (userId) => {
  const response = await axios.get(
    `https://api.twitch.tv/helix/streams?user_id=${userId}`,
    {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`
      }
    }
  );
  
  return response.data.data[0]; // null if offline
};
```

### Facebook Live Integration

#### Setup Guide
1. **Get Facebook Stream Key**
   - Go to Facebook Live Producer
   - Create new live video
   - Copy stream key and server URL

2. **Configure in NRSgirls**
   - Go to "Streaming Settings"
   - Select "Facebook Live"
   - Paste stream key
   - Save configuration

3. **Stream Requirements**
   - Maximum: 720p at 4000 kbps
   - Audio: 128 kbps stereo
   - Secure RTMPS connection required

#### API Integration
```javascript
const FB = require('fb');

// Create live video
const createFacebookLiveVideo = async (accessToken, title, description) => {
  FB.setAccessToken(accessToken);
  
  const video = await FB.api('me/live_videos', 'post', {
    title: title,
    description: description,
    status: 'LIVE_NOW'
  });
  
  return {
    streamUrl: video.stream_url,
    streamKey: video.secure_stream_url.split('/').pop(),
    videoId: video.id
  };
};

// End live video
const endFacebookLiveVideo = async (accessToken, videoId) => {
  FB.setAccessToken(accessToken);
  
  await FB.api(`${videoId}`, 'post', {
    end_live_video: true
  });
};
```

## OBS Studio Configuration

### Recommended OBS Settings

#### Video Settings
```
Base (Canvas) Resolution: 1920x1080
Output (Scaled) Resolution: 1920x1080
Downscale Filter: Lanczos
FPS: 30 or 60
```

#### Output Settings
```
Output Mode: Advanced
Encoder: x264 or Hardware (NVENC/QuickSync/AMD)
Rate Control: CBR
Bitrate: 4500 kbps
Keyframe Interval: 2 seconds
Preset: veryfast or medium
Profile: high
Tune: zerolatency
```

#### Audio Settings
```
Sample Rate: 48 kHz
Channels: Stereo
Audio Bitrate: 160 kbps
```

### Connection Guide
```
Server: rtmp://stream.nrsgirls.com/live
Stream Key: [Your unique stream key]
```

### OBS Configuration File
```ini
[Stream1]
Server=rtmp://stream.nrsgirls.com/live
key=[STREAM_KEY]

[Video]
BaseCX=1920
BaseCY=1080
OutputCX=1920
OutputCY=1080
FPSType=0
FPSCommon=30

[AdvOut]
Encoder=obs_x264
RecEncoder=obs_x264
VBitrate=4500
ABitrate=160
RecType=Standard
RecFilePath=/recordings
```

## Recording and VOD

### Automatic Recording
```javascript
const recordStream = async (streamId) => {
  const outputPath = `/recordings/${streamId}`;
  
  const ffmpeg = spawn('ffmpeg', [
    '-i', `rtmp://localhost/live/${streamId}`,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-f', 'mp4',
    `${outputPath}/${Date.now()}.mp4`
  ]);
  
  return ffmpeg;
};

// Upload to S3 after stream ends
const uploadRecording = async (streamId, filePath) => {
  const fileStream = fs.createReadStream(filePath);
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `recordings/${streamId}/${path.basename(filePath)}`,
    Body: fileStream,
    ContentType: 'video/mp4'
  };
  
  await s3.upload(params).promise();
  
  // Delete local file
  await fs.unlink(filePath);
  
  // Update database
  await db.streams.update(streamId, {
    recordingUrl: `https://cdn.nrsgirls.com/recordings/${streamId}/${path.basename(filePath)}`
  });
};
```

## Adaptive Bitrate Streaming

### HLS Configuration
```javascript
const generateHLS = async (inputStream, outputDir) => {
  const ffmpeg = spawn('ffmpeg', [
    '-i', inputStream,
    
    // 1080p variant
    '-map', '0:v:0',
    '-map', '0:a:0',
    '-c:v', 'libx264',
    '-b:v', '4500k',
    '-s', '1920x1080',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '5',
    '-hls_flags', 'delete_segments+append_list',
    `${outputDir}/1080p.m3u8`,
    
    // 720p variant
    '-map', '0:v:0',
    '-map', '0:a:0',
    '-c:v', 'libx264',
    '-b:v', '2500k',
    '-s', '1280x720',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '5',
    '-hls_flags', 'delete_segments+append_list',
    `${outputDir}/720p.m3u8`,
    
    // 480p variant
    '-map', '0:v:0',
    '-map', '0:a:0',
    '-c:v', 'libx264',
    '-b:v', '1000k',
    '-s', '854x480',
    '-c:a', 'aac',
    '-b:a', '96k',
    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '5',
    '-hls_flags', 'delete_segments+append_list',
    `${outputDir}/480p.m3u8`
  ]);
  
  return ffmpeg;
};
```

### Master Playlist
```m3u8
#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=4628000,RESOLUTION=1920x1080
1080p.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=2628000,RESOLUTION=1280x720
720p.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1096000,RESOLUTION=854x480
480p.m3u8
```

## CDN Integration

### Cloudflare Stream
```javascript
const uploadToCloudflare = async (videoUrl) => {
  const response = await axios.post(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/copy`,
    {
      url: videoUrl
    },
    {
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`
      }
    }
  );
  
  return response.data.result;
};
```

### AWS CloudFront
```javascript
const cloudfront = new AWS.CloudFront();

const invalidateCache = async (distribution, paths) => {
  const params = {
    DistributionId: distribution,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: paths.length,
        Items: paths
      }
    }
  };
  
  await cloudfront.createInvalidation(params).promise();
};
```

## Monitoring and Analytics

### Stream Health Monitoring
```javascript
const monitorStreamHealth = async (streamId) => {
  const metrics = {
    bitrate: await getCurrentBitrate(streamId),
    fps: await getCurrentFPS(streamId),
    droppedFrames: await getDroppedFrames(streamId),
    viewers: await getViewerCount(streamId),
    latency: await getStreamLatency(streamId)
  };
  
  // Alert if issues detected
  if (metrics.droppedFrames > 100) {
    await alertCreator(streamId, 'High dropped frames detected');
  }
  
  if (metrics.bitrate < 1000) {
    await alertCreator(streamId, 'Low bitrate warning');
  }
  
  return metrics;
};
```

### Viewer Analytics
```javascript
const trackViewerMetrics = async (streamId, userId) => {
  await redis.sadd(`stream:${streamId}:viewers`, userId);
  
  await db.analytics.create({
    eventType: 'stream_join',
    streamId: streamId,
    userId: userId,
    timestamp: new Date()
  });
  
  // Update real-time viewer count
  const viewerCount = await redis.scard(`stream:${streamId}:viewers`);
  await updateViewerCount(streamId, viewerCount);
};
```

## Troubleshooting

### Common Issues

#### High Latency
- Check network connection
- Reduce bitrate
- Use closer streaming server
- Enable low-latency mode

#### Dropped Frames
- Reduce output resolution
- Lower bitrate
- Check CPU/GPU usage
- Upgrade hardware

#### Connection Issues
- Verify stream key
- Check firewall settings
- Ensure ports are open (1935, 443, 80)
- Test network stability

## File Structure
```
streaming/
├── servers/
│   ├── webrtc-server.js
│   ├── rtmp-server.js
│   └── hls-server.js
├── integration/
│   ├── youtube.js
│   ├── twitch.js
│   ├── facebook.js
│   └── custom-rtmp.js
├── transcoding/
│   ├── ffmpeg-config.js
│   ├── adaptive-bitrate.js
│   └── recording.js
├── multistream/
│   ├── restream.js
│   └── config-manager.js
├── monitoring/
│   ├── stream-health.js
│   ├── analytics.js
│   └── alerts.js
├── cdn/
│   ├── cloudflare.js
│   ├── cloudfront.js
│   └── cache-manager.js
├── guides/
│   ├── OBS_SETUP.md
│   ├── YOUTUBE_INTEGRATION.md
│   ├── TWITCH_INTEGRATION.md
│   └── FACEBOOK_INTEGRATION.md
└── README.md
```

## Performance Requirements

### Server Requirements
- CPU: 8+ cores
- RAM: 16GB+ 
- Network: 1Gbps+
- Storage: SSD with 500GB+

### Bandwidth Requirements
Per Stream:
- Upload: 5-10 Mbps
- Per Viewer: 2-5 Mbps

### Scalability
- Support 10,000+ concurrent streams
- Handle 100,000+ concurrent viewers
- 99.9% uptime
- Sub-3-second latency
