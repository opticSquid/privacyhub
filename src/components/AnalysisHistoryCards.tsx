'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { getOptimizedLogo } from '@/lib/logo-service';

interface AnalysisData {
  id: number;
  url: string;
  hostname: string;
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  gdpr_compliance: string;
  ccpa_compliance: string;
  dpdp_act_compliance?: string;
  created_at: string;
  domain?: string; // Domain for linking to /[domain] routes
  analysis_data: {
    overall_score: number;
    privacy_grade: string;
    risk_level: string;
    regulatory_compliance: {
      gdpr_compliance: string;
      ccpa_compliance: string;
      dpdp_act_compliance?: string;
    };
  };
}

export function AnalysisHistoryCards() {
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchAnalyses = useCallback(async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const currentCount = reset ? 0 : analyses.length;
      const response = await fetch(`/api/history?limit=24&offset=${currentCount}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analyses');
      }
      const data = await response.json();
      
      if (reset) {
        setAnalyses(data.analyses);
      } else {
        setAnalyses(prev => [...prev, ...data.analyses]);
      }
      
      // Check if there might be more analyses
      setHasMore(data.analyses.length === 24);
    } catch (err) {
      console.error('Error fetching analyses:', err);
      setError('Failed to load analysis history');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [analyses.length]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);


  const getComplianceIcon = (compliance: string) => {
    switch (compliance?.toUpperCase()) {
      case 'COMPLIANT': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'PARTIALLY_COMPLIANT': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'NON_COMPLIANT': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatHostname = (hostname: string) => {
    return hostname.replace(/^www\./, '');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Badge variant="outline" className="gap-2 px-4 py-2">
            <Clock className="w-4 h-4 animate-spin" />
            Loading Recent Analyses...
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Analysis History</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => fetchAnalyses()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (analyses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {analyses.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full w-fit mx-auto">
          <TrendingUp className="w-4 h-4" />
          <span>{analyses.length} community analyses</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyses.map((analysis) => (
          <Link
            key={analysis.id}
            href={analysis.domain ? `/${analysis.domain}` : `/analysis/${analysis.id}`}
            className="block group"
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-200 group-hover:border-blue-400 bg-white">
              <CardContent className="p-6">
                {/* Header Section with Logo */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={getOptimizedLogo(analysis.hostname, 48)}
                          alt={`${formatHostname(analysis.hostname)} logo`}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            // Fallback to shield icon on error
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>';
                            }
                          }}
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 truncate text-base leading-tight">
                          {formatHostname(analysis.hostname)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="text-xs">{formatDate(analysis.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Metrics Section */}
                <div className="mb-6">
                  {/* Score Display with Progress */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(analysis.overall_score * 10)}
                        <span className="text-sm text-gray-500">/100</span>
                      </div>
                      <HoverCard>
                        <HoverCardTrigger>
                          <Badge 
                            variant={analysis.privacy_grade === 'A' ? 'default' :
                                    analysis.privacy_grade === 'B' ? 'secondary' :
                                    analysis.privacy_grade === 'C' ? 'outline' :
                                    'destructive'}
                            className="font-bold"
                          >
                            {analysis.privacy_grade || 'F'}
                          </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-60">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Privacy Grade: {analysis.privacy_grade}</h4>
                            <p className="text-xs text-gray-600">
                              {analysis.privacy_grade === 'A' ? 'Excellent privacy practices' :
                               analysis.privacy_grade === 'B' ? 'Good privacy practices' :
                               analysis.privacy_grade === 'C' ? 'Average privacy practices' :
                               analysis.privacy_grade === 'D' ? 'Poor privacy practices' :
                               'Very poor privacy practices'}
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <Progress 
                      value={Math.min(analysis.overall_score * 10, 100)} 
                      className="h-2 mb-2" 
                    />
                    <p className="text-xs text-gray-500">Privacy Protection Score</p>
                  </div>
                  
                  {/* Enhanced Risk Level Badge */}
                  <div className="mb-4 text-center">
                    <Badge 
                      variant={analysis.risk_level?.includes('LOW') ? 'default' :
                              analysis.risk_level?.includes('MODERATE') ? 'secondary' :
                              'destructive'}
                      className="px-4 py-1"
                    >
                      {analysis.risk_level?.replace('_', ' ').replace('-', ' ') || 'Unknown'} Risk
                    </Badge>
                  </div>
                </div>

                {/* Enhanced Compliance Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Compliance</h4>
                    <HoverCard>
                      <HoverCardTrigger>
                        <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-60">
                        <p className="text-xs text-gray-600">
                          Shows how well the website follows privacy laws like GDPR and CCPA.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <HoverCard>
                      <HoverCardTrigger>
                        <Badge 
                          variant={analysis.gdpr_compliance === 'COMPLIANT' ? 'default' :
                                  analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'secondary' :
                                  'outline'}
                          className="cursor-help text-xs"
                        >
                          {getComplianceIcon(analysis.gdpr_compliance)}
                          <span className="ml-1">GDPR</span>
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-60">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">GDPR Compliance</h4>
                          <p className="text-xs text-gray-600">
                            {analysis.gdpr_compliance?.replace('_', ' ') || 'Unknown'} - European data protection regulation
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>

                    <HoverCard>
                      <HoverCardTrigger>
                        <Badge 
                          variant={analysis.ccpa_compliance === 'COMPLIANT' ? 'default' :
                                  analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'secondary' :
                                  'outline'}
                          className="cursor-help text-xs"
                        >
                          {getComplianceIcon(analysis.ccpa_compliance)}
                          <span className="ml-1">CCPA</span>
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-60">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">CCPA Compliance</h4>
                          <p className="text-xs text-gray-600">
                            {analysis.ccpa_compliance?.replace('_', ' ') || 'Unknown'} - California privacy law
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="default" 
                  className="w-full font-medium group-hover:bg-blue-50 group-hover:border-blue-500 group-hover:text-blue-700 transition-all duration-200"
                >
                  View Full Analysis
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => fetchAnalyses(false)}
            disabled={loadingMore}
            className="min-w-[200px]"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2"></div>
                Loading...
              </>
            ) : (
              'Load More Analyses'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}