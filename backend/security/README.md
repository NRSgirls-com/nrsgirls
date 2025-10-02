# Security - NRSgirls Backend

## Overview
Comprehensive security infrastructure for the NRSgirls platform, including file scanning, content moderation, virus detection, and threat prevention.

## Security Layers

### 1. Upload Security
### 2. Content Moderation
### 3. Virus and Malware Detection
### 4. DDoS Protection
### 5. Authentication Security
### 6. Data Protection

## File Upload Security

### MP3 Scanning Pipeline

#### Stage 1: File Validation
```javascript
// File type validation
const validateFileType = (file) => {
  const allowedMimeTypes = ['audio/mpeg', 'audio/mp3'];
  const allowedExtensions = ['.mp3'];
  
  // Check MIME type
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }
  
  // Check file extension
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension');
  }
  
  // Verify magic bytes (MP3 signature)
  const header = file.buffer.slice(0, 3);
  if (!isValidMP3Header(header)) {
    throw new Error('Invalid MP3 file structure');
  }
  
  return true;
};
```

#### Stage 2: File Size Limits
- Maximum file size: 100 MB per MP3
- Minimum file size: 100 KB (to avoid empty/corrupted files)
- Rate limiting on uploads: 10 files per hour per user

#### Stage 3: Virus Scanning
```javascript
// ClamAV integration
const scanFile = async (filePath) => {
  const scanner = new ClamAV({
    host: process.env.CLAMAV_HOST,
    port: process.env.CLAMAV_PORT
  });
  
  try {
    const result = await scanner.scanFile(filePath);
    
    if (result.isInfected) {
      // Log incident
      await logSecurityEvent({
        type: 'virus_detected',
        file: filePath,
        virus: result.viruses,
        severity: 'critical'
      });
      
      // Delete file immediately
      await fs.unlink(filePath);
      
      // Quarantine user if multiple infected uploads
      await checkUserThreatLevel(userId);
      
      throw new Error('File contains malware');
    }
    
    return { clean: true };
  } catch (error) {
    throw error;
  }
};
```

#### Stage 4: Audio File Analysis
```javascript
// Audio metadata and content analysis
const analyzeAudio = async (filePath) => {
  const metadata = await mm.parseFile(filePath);
  
  // Extract audio properties
  const analysis = {
    duration: metadata.format.duration,
    bitrate: metadata.format.bitrate,
    sampleRate: metadata.format.sampleRate,
    channels: metadata.format.numberOfChannels,
    codec: metadata.format.codec,
    
    // Metadata
    title: metadata.common.title,
    artist: metadata.common.artist,
    album: metadata.common.album,
    year: metadata.common.year
  };
  
  // Validate audio properties
  if (analysis.duration < 30) {
    throw new Error('Audio file too short');
  }
  
  if (analysis.duration > 7200) { // 2 hours max
    throw new Error('Audio file too long');
  }
  
  return analysis;
};
```

#### Stage 5: Copyright Detection
```javascript
// Audio fingerprinting for copyright detection
const checkCopyright = async (filePath) => {
  // Generate acoustic fingerprint
  const fingerprint = await generateFingerprint(filePath);
  
  // Compare against copyright database (ACRCloud, Audible Magic, etc.)
  const matches = await copyrightDB.search(fingerprint);
  
  if (matches.length > 0) {
    return {
      copyrighted: true,
      matches: matches.map(m => ({
        title: m.title,
        artist: m.artist,
        confidence: m.score,
        rightsholder: m.owner
      }))
    };
  }
  
  return { copyrighted: false };
};
```

### Image Upload Security

#### Image Validation
```javascript
const validateImage = async (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid image type');
  }
  
  if (file.size > maxSize) {
    throw new Error('Image too large');
  }
  
  // Verify image is not corrupted
  const image = await sharp(file.buffer);
  const metadata = await image.metadata();
  
  // Check dimensions
  if (metadata.width > 4096 || metadata.height > 4096) {
    throw new Error('Image dimensions too large');
  }
  
  return true;
};
```

#### Image Processing
```javascript
// Sanitize and optimize images
const processImage = async (file) => {
  const image = sharp(file.buffer);
  
  // Strip EXIF data for privacy
  const processed = await image
    .rotate() // Auto-rotate based on EXIF
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();
  
  return processed;
};
```

## Content Moderation

### Automated Moderation

#### Text Moderation
```javascript
// Content filtering for chat and profiles
const moderateText = async (text) => {
  // Profanity filter
  const profanityCheck = await profanityFilter.check(text);
  if (profanityCheck.hasProfanity) {
    return {
      allowed: false,
      reason: 'profanity',
      flagged: profanityCheck.words
    };
  }
  
  // Spam detection
  const isSpam = await spamDetector.analyze(text);
  if (isSpam.score > 0.8) {
    return {
      allowed: false,
      reason: 'spam',
      score: isSpam.score
    };
  }
  
  // Hate speech detection
  const hateSpeech = await hateSpeechDetector.check(text);
  if (hateSpeech.detected) {
    return {
      allowed: false,
      reason: 'hate_speech',
      confidence: hateSpeech.confidence
    };
  }
  
  // URL and link validation
  const links = extractLinks(text);
  for (const link of links) {
    const isSafe = await checkURLSafety(link);
    if (!isSafe) {
      return {
        allowed: false,
        reason: 'malicious_link',
        url: link
      };
    }
  }
  
  return { allowed: true };
};
```

#### Image Moderation
```javascript
// AI-powered image content moderation
const moderateImage = async (imageUrl) => {
  // Use AWS Rekognition, Google Vision, or similar
  const analysis = await imageModeration.analyze(imageUrl);
  
  // Check for inappropriate content
  const flags = {
    nudity: analysis.nudity > 0.7,
    violence: analysis.violence > 0.8,
    drugs: analysis.drugs > 0.7,
    weapons: analysis.weapons > 0.8
  };
  
  if (Object.values(flags).some(f => f === true)) {
    return {
      allowed: false,
      flags: flags,
      requiresReview: true
    };
  }
  
  return { allowed: true };
};
```

### Manual Moderation

#### Report Queue System
```javascript
// User report processing
const processReport = async (reportId) => {
  const report = await db.reports.findById(reportId);
  
  // Fetch reported content
  const content = await fetchReportedContent(report);
  
  // Assign to moderator
  const moderator = await assignModerator(report);
  
  // Update status
  await db.reports.update(reportId, {
    status: 'reviewing',
    reviewedBy: moderator.id,
    reviewStarted: new Date()
  });
  
  // Send notification to moderator
  await notifyModerator(moderator, report);
};
```

#### Moderation Actions
```javascript
const moderationActions = {
  // Remove content
  removeContent: async (contentId, reason) => {
    await db.markDeleted(contentId, reason);
    await notifyCreator(contentId, 'content_removed', reason);
  },
  
  // Warn user
  warnUser: async (userId, reason) => {
    await db.warnings.create({ userId, reason });
    await notifyUser(userId, 'warning', reason);
  },
  
  // Suspend user
  suspendUser: async (userId, duration, reason) => {
    await db.users.update(userId, {
      suspended: true,
      suspendedUntil: addDays(new Date(), duration),
      suspensionReason: reason
    });
    await notifyUser(userId, 'suspended', { duration, reason });
  },
  
  // Ban user
  banUser: async (userId, reason) => {
    await db.users.update(userId, {
      banned: true,
      bannedAt: new Date(),
      banReason: reason
    });
    await terminateAllSessions(userId);
    await notifyUser(userId, 'banned', reason);
  }
};
```

## Virus and Malware Detection

### ClamAV Configuration
```yaml
# clamd.conf
LogFile /var/log/clamav/clamd.log
LogFileMaxSize 10M
LogTime yes
LogRotate yes
PidFile /var/run/clamav/clamd.pid

TCPSocket 3310
TCPAddr 127.0.0.1

MaxThreads 12
MaxConnectionQueueLength 30
MaxFileSize 100M
MaxScanSize 500M

StreamMaxLength 100M

# Scan options
ScanArchive yes
ScanPDF yes
ScanOLE2 yes
ScanHTML yes

# Heuristics
HeuristicScanPrecedence yes
PhishingScanURLs yes
PhishingSignatures yes
```

### Integration with Upload Service
```javascript
class VirusScanner {
  constructor() {
    this.scanner = new ClamAV({
      host: process.env.CLAMAV_HOST,
      port: process.env.CLAMAV_PORT,
      timeout: 30000
    });
  }
  
  async scanFile(filePath) {
    try {
      // Scan file
      const result = await this.scanner.scanFile(filePath);
      
      // Log scan result
      await this.logScan({
        file: filePath,
        result: result.isInfected ? 'infected' : 'clean',
        viruses: result.viruses || []
      });
      
      if (result.isInfected) {
        // Quarantine file
        await this.quarantineFile(filePath);
        
        // Alert security team
        await this.alertSecurity({
          type: 'virus_detected',
          file: filePath,
          viruses: result.viruses
        });
        
        return { safe: false, viruses: result.viruses };
      }
      
      return { safe: true };
    } catch (error) {
      // If scanner fails, reject upload as precaution
      await this.alertSecurity({
        type: 'scanner_error',
        error: error.message,
        file: filePath
      });
      
      throw new Error('Unable to complete security scan');
    }
  }
  
  async quarantineFile(filePath) {
    const quarantinePath = `/quarantine/${path.basename(filePath)}`;
    await fs.move(filePath, quarantinePath);
    
    await db.quarantine.create({
      originalPath: filePath,
      quarantinePath: quarantinePath,
      timestamp: new Date()
    });
  }
}
```

## DDoS Protection

### Rate Limiting
```javascript
// Express rate limiting middleware
const rateLimit = require('express-rate-limit');

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

// Upload rate limit (stricter)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Upload limit exceeded'
});

// Login rate limit
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});
```

### Request Filtering
```javascript
// Request validation middleware
const validateRequest = (req, res, next) => {
  // Block suspicious user agents
  const userAgent = req.get('user-agent');
  if (!userAgent || isSuspiciousUserAgent(userAgent)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Check request size
  const contentLength = req.get('content-length');
  if (contentLength > MAX_REQUEST_SIZE) {
    return res.status(413).json({ error: 'Request too large' });
  }
  
  // Validate origin
  const origin = req.get('origin');
  if (origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  
  next();
};
```

### Cloudflare Integration
```javascript
// Cloudflare WAF rules
const cloudflareRules = {
  // Block known bad actors
  blockBadBots: true,
  
  // Challenge suspicious requests
  challengeThreshold: 'medium',
  
  // Rate limiting rules
  rateLimits: [
    {
      path: '/api/auth/login',
      requests: 5,
      period: 300 // 5 minutes
    },
    {
      path: '/api/*/upload',
      requests: 10,
      period: 3600 // 1 hour
    }
  ],
  
  // Geographic restrictions
  allowedCountries: ['US', 'CA', 'GB', 'AU', 'EU'],
  
  // Security level
  securityLevel: 'high'
};
```

## Authentication Security

### Password Security
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Password requirements
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  maxLength: 128
};

// Password hashing
const hashPassword = async (password) => {
  // Validate password strength
  if (!isStrongPassword(password)) {
    throw new Error('Password does not meet security requirements');
  }
  
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Password verification
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

### Two-Factor Authentication
```javascript
const speakeasy = require('speakeasy');

// Generate 2FA secret
const generate2FASecret = (userId) => {
  const secret = speakeasy.generateSecret({
    name: `NRSgirls (${userId})`,
    length: 32
  });
  
  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url
  };
};

// Verify 2FA token
const verify2FAToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time steps for clock drift
  });
};
```

### Session Management
```javascript
// Secure session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  store: new RedisStore({
    client: redisClient,
    prefix: 'session:'
  })
};

// Session validation
const validateSession = async (sessionId) => {
  const session = await redis.get(`session:${sessionId}`);
  
  if (!session) {
    throw new Error('Invalid session');
  }
  
  // Check for suspicious activity
  const lastActivity = new Date(session.lastActivity);
  const now = new Date();
  
  if (now - lastActivity > SESSION_TIMEOUT) {
    await redis.del(`session:${sessionId}`);
    throw new Error('Session expired');
  }
  
  // Update last activity
  session.lastActivity = now;
  await redis.set(`session:${sessionId}`, JSON.stringify(session));
  
  return session;
};
```

## Data Protection

### Encryption at Rest
```javascript
const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const ALGORITHM = 'aes-256-gcm';

// Encrypt sensitive data
const encrypt = (data) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

// Decrypt sensitive data
const decrypt = (encrypted, iv, authTag) => {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
```

### Encryption in Transit
```javascript
// TLS/SSL configuration
const httpsOptions = {
  key: fs.readFileSync('/path/to/private-key.pem'),
  cert: fs.readFileSync('/path/to/certificate.pem'),
  ca: fs.readFileSync('/path/to/ca-bundle.pem'),
  
  // Security options
  minVersion: 'TLSv1.2',
  ciphers: [
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES256-GCM-SHA384'
  ].join(':'),
  honorCipherOrder: true
};

const server = https.createServer(httpsOptions, app);
```

## Security Monitoring

### Logging
```javascript
const winston = require('winston');

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'security' },
  transports: [
    new winston.transports.File({
      filename: 'logs/security-error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/security.log'
    })
  ]
});

// Log security events
const logSecurityEvent = async (event) => {
  securityLogger.info({
    type: event.type,
    severity: event.severity,
    userId: event.userId,
    details: event.details,
    timestamp: new Date(),
    ipAddress: event.ipAddress
  });
  
  // Alert on critical events
  if (event.severity === 'critical') {
    await alertSecurityTeam(event);
  }
};
```

### Intrusion Detection
```javascript
// Detect suspicious patterns
const detectIntrusion = async (userId, action) => {
  const recentActions = await getRecentActions(userId, '1h');
  
  // Check for rapid-fire requests
  if (recentActions.length > 100) {
    await flagUser(userId, 'rate_abuse');
  }
  
  // Check for failed login attempts
  const failedLogins = recentActions.filter(a => 
    a.action === 'login' && a.status === 'failed'
  );
  
  if (failedLogins.length > 5) {
    await lockAccount(userId, '1h');
  }
  
  // Check for geographic anomalies
  const locations = recentActions.map(a => a.location);
  if (hasImpossibleTravel(locations)) {
    await flagUser(userId, 'impossible_travel');
    await require2FA(userId);
  }
};
```

## File Structure
```
security/
├── scanning/
│   ├── virus-scanner.js
│   ├── file-validator.js
│   ├── audio-analyzer.js
│   └── copyright-detector.js
├── moderation/
│   ├── text-moderator.js
│   ├── image-moderator.js
│   ├── report-processor.js
│   └── moderation-actions.js
├── auth/
│   ├── password-policy.js
│   ├── two-factor.js
│   ├── session-manager.js
│   └── jwt-handler.js
├── encryption/
│   ├── data-encryption.js
│   └── tls-config.js
├── monitoring/
│   ├── security-logger.js
│   ├── intrusion-detector.js
│   └── alert-system.js
├── ddos/
│   ├── rate-limiter.js
│   ├── request-validator.js
│   └── cloudflare-config.js
├── config/
│   ├── security-policies.js
│   └── clamav.conf
└── README.md
```

## Security Checklist

### Pre-Production
- [ ] All dependencies updated and scanned for vulnerabilities
- [ ] HTTPS/TLS configured with strong ciphers
- [ ] Rate limiting implemented on all endpoints
- [ ] Input validation on all user inputs
- [ ] File upload security in place
- [ ] Virus scanning operational
- [ ] Content moderation active
- [ ] Authentication security configured
- [ ] Session management secure
- [ ] Data encryption implemented
- [ ] Security logging enabled
- [ ] Intrusion detection active
- [ ] DDoS protection configured
- [ ] Security audit completed
- [ ] Penetration testing performed

### Ongoing
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Security patch monitoring
- [ ] Log review and analysis
- [ ] Incident response drills
- [ ] User security education
- [ ] Policy updates
- [ ] Compliance reviews
