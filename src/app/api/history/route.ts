import { NextRequest, NextResponse } from 'next/server';
import { getRecentAnalyses, getAnalysisStats } from '@/lib/database';
import { getAllAnalyses } from '@/lib/firestore-service';
import { historyRateLimiter, getClientIp, createRateLimitHeaders } from '@/lib/rate-limiter';
import { validatePaginationParams } from '@/lib/input-validation';
import { withCache, CacheKeys } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitCheck = historyRateLimiter.check(clientIp);

    if (!rateLimitCheck.allowed) {
      const headers = createRateLimitHeaders(
        rateLimitCheck.remaining,
        rateLimitCheck.resetTime,
        30
      );

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetTime: new Date(rateLimitCheck.resetTime).toISOString()
        },
        { status: 429, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawLimit = searchParams.get('limit') || '24';
    const rawOffset = searchParams.get('offset') || '0';
    const includeStats = searchParams.get('stats') === 'true';

    // Validate and sanitize pagination parameters
    const { limit, offset } = validatePaginationParams(rawLimit, rawOffset);

    // Try cache first, then Firestore
    const cacheKey = CacheKeys.history(limit, offset);
    const analyses = await withCache(
      cacheKey,
      60, // 1 minute cache
      async () => {
        try {
          const firestoreAnalyses = await getAllAnalyses(limit);

          // Transform to match the expected format
          return firestoreAnalyses.map((doc, index) => ({
            id: index + offset,
            url: doc.url,
            hostname: doc.hostname,
            overall_score: doc.overall_score,
            privacy_grade: doc.privacy_grade,
            risk_level: doc.risk_level,
            gdpr_compliance: doc.gdpr_compliance,
            ccpa_compliance: doc.ccpa_compliance,
            dpdp_act_compliance: doc.dpdp_act_compliance,
            created_at: doc.last_checked_at,
            analysis_data: doc.analysis_data,
            domain: doc.domain
          }));
        } catch (firestoreError) {
          console.error('Firestore fetch failed, falling back to SQLite:', firestoreError);

          // Fallback to SQLite
          const sqliteAnalyses = getRecentAnalyses(limit, offset);

          // Parse analysis_data back to JSON for each result
          return sqliteAnalyses.map(analysis => ({
            ...analysis,
            analysis_data: JSON.parse(analysis.analysis_data as unknown as string)
          }));
        }
      }
    );

    const response: {
      analyses: typeof analyses;
      total: number;
      stats?: ReturnType<typeof getAnalysisStats>;
    } = {
      analyses,
      total: analyses.length
    };

    if (includeStats) {
      response.stats = getAnalysisStats();
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analysis history' },
      { status: 500 }
    );
  }
}