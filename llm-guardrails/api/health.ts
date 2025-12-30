/**
 * Health Check Endpoint
 * Vercel Serverless Function
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { guardrails } from '../lib/middleware';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
): void {
  // Quick test of guardrails
  const testResult = guardrails.quickCheck('How do I configure DNS records?');

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    guardrails: {
      status: testResult.allowed ? 'operational' : 'degraded',
      allowedScopes: ['dns', 'email', 'defensiveSecurity', 'legalGov'],
      hardBlocks: ['adultContent', 'offensiveSecurity', 'privilegedData']
    }
  });
}
