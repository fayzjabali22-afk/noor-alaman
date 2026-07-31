import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  timestamps: number[];
}

// In-memory sliding window store for IP addresses per category
const rateLimitMap = new Map<string, RateLimitStore>();

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, store] of rateLimitMap.entries()) {
    store.timestamps = store.timestamps.filter(ts => now - ts < 300000);
    if (store.timestamps.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}, 300000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  categoryName: string;
}

export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  aiAssistant: {
    maxRequests: 10,
    windowMs: 60000, // 1 minute
    categoryName: 'AI Assistant Queries',
  },
  visitRecord: {
    maxRequests: 20,
    windowMs: 60000,
    categoryName: 'Visit Counter Throttling',
  },
  reportSubmit: {
    maxRequests: 5,
    windowMs: 60000,
    categoryName: 'Governance Report Submissions',
  },
  generalApi: {
    maxRequests: 60,
    windowMs: 60000,
    categoryName: 'General API Endpoints',
  },
};

export function createRateLimiter(configKey: keyof typeof RATE_LIMIT_CONFIGS) {
  const config = RATE_LIMIT_CONFIGS[configKey] || RATE_LIMIT_CONFIGS.generalApi;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] as string || req.ip || 'anonymous-ip';
    const clientKey = `${configKey}_${ip}`;
    const now = Date.now();

    if (!rateLimitMap.has(clientKey)) {
      rateLimitMap.set(clientKey, { timestamps: [] });
    }

    const store = rateLimitMap.get(clientKey)!;
    // Remove timestamps outside the sliding window
    store.timestamps = store.timestamps.filter(ts => now - ts < config.windowMs);

    if (store.timestamps.length >= config.maxRequests) {
      console.warn(`[AUDIT TRAIL - RATE LIMIT BREACH] IP: ${ip} | Category: ${config.categoryName} | Exceeded ${config.maxRequests} reqs/${config.windowMs / 1000}s`);
      
      return res.status(429).json({
        status: 'RATE_LIMITED',
        error: 'Too Many Requests',
        message: 'عذراً، تم استقبال عدد كبير من الطلبات في فترة قصيرة. يُرجى الانتظار لحظات لحماية استقرار المنصة الإنسانية وسلامة الخدمات.',
        retryAfterSeconds: Math.ceil((config.windowMs - (now - store.timestamps[0])) / 1000),
      });
    }

    store.timestamps.push(now);
    next();
  };
}
