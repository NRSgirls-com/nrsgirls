const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 8080;

// Get the webhook secret from environment variable
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

if (!GITHUB_WEBHOOK_SECRET) {
  console.error('Error: GITHUB_WEBHOOK_SECRET environment variable not set.');
  process.exit(1);
}

// Middleware to capture raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Improved Middleware function to verify GitHub signature
function verifyGitHubSignature(req, res, next) {
  const signatureHeader = req.headers['x-hub-signature-256'];
  if (!signatureHeader) {
    return res.status(401).send('Unauthorized: No signature provided.');
  }

  // Generate expected signature
  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  hmac.update(req.rawBody);
  const expectedSignature = `sha256=${hmac.digest('hex')}`;

  try {
    // Both signatures as buffers
    const sigBuffer = Buffer.from(signatureHeader, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    // Length check to prevent timingSafeEqual throw
    if (sigBuffer.length !== expectedBuffer.length) {
      return res.status(401).send('Unauthorized: Invalid signature.');
    }

    const isSignatureValid = crypto.timingSafeEqual(sigBuffer, expectedBuffer);
    if (!isSignatureValid) {
      return res.status(401).send('Unauthorized: Invalid signature.');
    }
  } catch (e) {
    return res.status(401).send('Unauthorized: Invalid signature.');
  }
  next();
}

// Apply verification middleware to webhook endpoint
app.post('/github-webhook', verifyGitHubSignature, (req, res) => {
  const githubEvent = req.headers['x-github-event'];
  console.log(`Received a verified webhook for the '${githubEvent}' event`);

  if (githubEvent === 'push') {
    const payload = req.body;
    const repositoryName = payload.repository.full_name;
    const commitAuthor = payload.head_commit.author.name;
    const commitMessage = payload.head_commit.message;
    const branch = payload.ref.split('/').pop();

    console.log(`New push to repository: ${repositoryName}`);
    console.log(`Branch: ${branch}`);
    console.log(`Author: ${commitAuthor}`);
    console.log(`Commit Message: "${commitMessage}"`);
  }

  res.status(200).send('Webhook received and verified.');
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
