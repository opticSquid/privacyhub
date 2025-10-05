'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  Shield,
  ArrowLeft,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  Download,
  Eye,
  DollarSign,
  Lock,
  UserCheck,
  Scale,
  HelpCircle
} from 'lucide-react';
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
  analysis_data: {
    overall_score: number;
    privacy_grade: string;
    risk_level: string;
    regulatory_compliance: {
      gdpr_compliance: string;
      ccpa_compliance: string;
      dpdp_act_compliance?: string;
    };
    categories?: Record<string, unknown>;
    recommendations?: string[];
    key_findings?: string[];
    summary?: string;
  };
}

interface Props {
  analysis: AnalysisData;
}

export function AnalysisDetailView({ analysis }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateWithTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return `${dateStr} at ${timeStr}`;
  };

  const formatHostname = (hostname: string) => {
    return hostname.replace(/^www\./, '');
  };


  const displayScore = analysis.overall_score;

  const getComplianceStatus = (compliance: string) => {
    switch (compliance?.toUpperCase()) {
      case 'COMPLIANT': return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', text: 'Good' };
      case 'PARTIALLY_COMPLIANT': return { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Okay' };
      case 'NON_COMPLIANT': return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', text: 'Poor' };
      default: return { icon: Info, color: 'text-gray-600', bg: 'bg-gray-50', text: 'Unknown' };
    }
  };

  const downloadReport = () => {
    const reportData = {
      website: formatHostname(analysis.hostname),
      url: analysis.url,
      analysis_date: analysis.created_at,
      overall_score: analysis.overall_score,
      privacy_grade: analysis.privacy_grade,
      risk_level: analysis.risk_level,
      gdpr_compliance: analysis.gdpr_compliance,
      ccpa_compliance: analysis.ccpa_compliance,
      dpdp_act_compliance: analysis.dpdp_act_compliance,
      full_analysis: analysis.analysis_data
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy-report-${formatHostname(analysis.hostname)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button onClick={downloadReport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
          
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src={getOptimizedLogo(analysis.hostname, 80)}
                alt={`${formatHostname(analysis.hostname)} logo`}
                width={80}
                height={80}
                className="rounded-2xl object-cover shadow-lg border-2 border-white"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"><svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>';
                  }
                }}
                unoptimized
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{formatHostname(analysis.hostname)}</h1>
            <p className="text-lg text-gray-600">Privacy Policy Analysis</p>
            <p className="text-sm text-gray-500 mt-1">Last checked on {formatDateWithTime(analysis.created_at)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Privacy Overview Summary - Clean Simple UI */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Main Score Display */}
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Overall Privacy Score
              </p>
              <div className="mb-4">
                <span className={`text-7xl md:text-8xl font-extrabold tracking-tight ${
                  displayScore >= 7 ? 'text-green-600' :
                  displayScore >= 5 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {displayScore.toFixed(1)}
                </span>
                <span className="text-3xl md:text-4xl text-gray-400 font-semibold ml-2">/10</span>
              </div>
              <p className="text-base md:text-lg text-gray-700 font-medium">
                {displayScore >= 8 ? 'Excellent privacy protection' :
                 displayScore >= 6.5 ? 'Good privacy standards' :
                 displayScore >= 5 ? 'Fair privacy practices' :
                 displayScore >= 3 ? 'Below average privacy' :
                 'Poor privacy protection'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${
                    displayScore >= 7 ? 'bg-green-500' :
                    displayScore >= 5 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(displayScore / 10) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 px-1">
                <span className={`text-xs font-semibold ${displayScore < 3 ? 'text-red-600' : 'text-gray-500'}`}>
                  0-3 Poor
                </span>
                <span className={`text-xs font-semibold ${displayScore >= 3 && displayScore < 5 ? 'text-orange-600' : 'text-gray-500'}`}>
                  3-5 Fair
                </span>
                <span className={`text-xs font-semibold ${displayScore >= 5 && displayScore < 7 ? 'text-yellow-600' : 'text-gray-500'}`}>
                  5-7 Good
                </span>
                <span className={`text-xs font-semibold ${displayScore >= 7 ? 'text-green-600' : 'text-gray-500'}`}>
                  7-10 Excellent
                </span>
              </div>
            </div>

            {/* Grade and Risk Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="w-full p-6 rounded-lg border-2 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg hover:border-blue-300 transition-all">
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                        Privacy Grade
                      </p>
                      <div className={`text-6xl md:text-7xl font-black ${
                        analysis.privacy_grade === 'A' ? 'text-green-600' :
                        analysis.privacy_grade === 'B' ? 'text-blue-600' :
                        analysis.privacy_grade === 'C' ? 'text-yellow-600' :
                        analysis.privacy_grade === 'D' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {analysis.privacy_grade || 'F'}
                      </div>
                    </div>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Privacy Grade Explained</h4>
                    <p className="text-sm text-gray-600">
                      {analysis.privacy_grade === 'A' ? 'Excellent privacy practices with strong user protections and transparent policies.' :
                       analysis.privacy_grade === 'B' ? 'Good privacy practices with clear policies and minor concerns.' :
                       analysis.privacy_grade === 'C' ? 'Average privacy practices with some issues that need attention.' :
                       analysis.privacy_grade === 'D' ? 'Poor privacy practices with significant concerns and weak protections.' :
                       'Very poor privacy practices. Major concerns identified. Use with extreme caution.'}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className={`w-full p-6 rounded-lg border-2 hover:shadow-lg transition-all ${
                    analysis.risk_level?.includes('LOW') ? 'bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-300' :
                    analysis.risk_level?.includes('MODERATE') ? 'bg-gradient-to-br from-yellow-50 to-amber-50 hover:border-yellow-300' :
                    'bg-gradient-to-br from-red-50 to-orange-50 hover:border-red-300'
                  }`}>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                        Risk Level
                      </p>
                      <div className={`text-2xl md:text-3xl font-bold ${
                        analysis.risk_level?.includes('LOW') ? 'text-green-600' :
                        analysis.risk_level?.includes('MODERATE') ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {analysis.risk_level?.replace('_', ' ').replace('-', ' ') || 'Unknown'}
                      </div>
                    </div>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Risk Level Assessment</h4>
                    <p className="text-sm text-gray-600">
                      {analysis.risk_level?.includes('LOW') ? 'Low risk to your privacy. The website demonstrates good data protection practices.' :
                       analysis.risk_level?.includes('MODERATE') ? 'Moderate risk detected. Some privacy concerns exist that you should be aware of.' :
                       'High risk to your privacy. Significant concerns about data handling and user protection.'}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            {/* Compliance Status */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider text-center mb-4">
                Regulatory Compliance
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className={`w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center text-xl font-bold ${
                    analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-600' :
                    analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {analysis.gdpr_compliance === 'COMPLIANT' ? '✓' :
                     analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? '~' : '✗'}
                  </div>
                  <p className="text-xs font-bold text-gray-700">GDPR</p>
                  <p className="text-xs text-gray-500">EU</p>
                </div>
                <div className="text-center">
                  <div className={`w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center text-xl font-bold ${
                    analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-600' :
                    analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {analysis.ccpa_compliance === 'COMPLIANT' ? '✓' :
                     analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? '~' : '✗'}
                  </div>
                  <p className="text-xs font-bold text-gray-700">CCPA</p>
                  <p className="text-xs text-gray-500">California</p>
                </div>
                <div className="text-center">
                  <div className={`w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center text-xl font-bold ${
                    analysis.dpdp_act_compliance === 'COMPLIANT' ? 'bg-green-100 text-green-600' :
                    analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {analysis.dpdp_act_compliance === 'COMPLIANT' ? '✓' :
                     analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? '~' : '✗'}
                  </div>
                  <p className="text-xs font-bold text-gray-700">DPDP Act</p>
                  <p className="text-xs text-gray-500">India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What You Should Be Aware Of - Using Alert Component */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Privacy Considerations</AlertTitle>
          <AlertDescription className="mt-4 space-y-4">
            <div className="space-y-3">
              <HoverCard>
                <HoverCardTrigger className="flex items-start gap-2 cursor-help">
                  <Badge variant="outline" className="mt-0.5">Data Use</Badge>
                  <p className="text-sm">Your personal data may be monetized through advertising or third-party sharing.</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Data Monetization Details
                    </h4>
                    <p className="text-sm text-gray-600">
                      Many websites generate revenue by collecting user data and sharing it with advertisers, data brokers, and marketing companies. This can include your browsing habits, interests, and personal preferences.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger className="flex items-start gap-2 cursor-help">
                  <Badge variant="outline" className="mt-0.5">Tracking</Badge>
                  <p className="text-sm">Your online activities and location may be continuously monitored.</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Tracking & Surveillance
                    </h4>
                    <p className="text-sm text-gray-600">
                      Websites use various technologies like cookies, pixels, and fingerprinting to track your behavior across the internet, building detailed profiles about your interests and activities.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger className="flex items-start gap-2 cursor-help">
                  <Badge variant="outline" className="mt-0.5">Security</Badge>
                  <p className="text-sm">Check how your data is protected from breaches and unauthorized access.</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Data Security Measures
                    </h4>
                    <p className="text-sm text-gray-600">
                      Look for information about encryption, secure storage, access controls, and breach notification procedures to understand how well your data is protected.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger className="flex items-start gap-2 cursor-help">
                  <Badge variant="outline" className="mt-0.5">Rights</Badge>
                  <p className="text-sm">You have legal rights to control your personal data.</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Your Privacy Rights
                    </h4>
                    <p className="text-sm text-gray-600">
                      Under laws like GDPR and CCPA, you have rights to access, correct, delete, and port your data. You can also opt-out of certain data processing activities.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </AlertDescription>
        </Alert>

        {/* What This Means for You */}
        {analysis.analysis_data.summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                What This Means for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{analysis.analysis_data.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Important Things to Know */}
        {analysis.analysis_data.key_findings && analysis.analysis_data.key_findings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Important Things to Know
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.analysis_data.key_findings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* How to Protect Yourself */}
        {analysis.analysis_data.recommendations && analysis.analysis_data.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                How to Protect Yourself
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.analysis_data.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Legal Protection Status - Enhanced with Visual Indicators */}
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Regulatory Compliance
              <HoverCard>
                <HoverCardTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Privacy Law Compliance</h4>
                    <p className="text-sm text-gray-600">
                      These indicators show how well the website complies with major privacy regulations that protect your personal data rights.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* GDPR with Enhanced Visual */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className={`p-5 rounded-xl border-2 transition-all cursor-help hover:shadow-lg ${
                    getComplianceStatus(analysis.gdpr_compliance).bg
                  } hover:scale-[1.02]`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {React.createElement(getComplianceStatus(analysis.gdpr_compliance).icon, {
                          className: `w-6 h-6 ${getComplianceStatus(analysis.gdpr_compliance).color}`
                        })}
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">GDPR</h4>
                          <p className="text-xs text-gray-600">General Data Protection Regulation</p>
                        </div>
                      </div>
                      <Badge
                        variant={analysis.gdpr_compliance === 'COMPLIANT' ? 'default' :
                                analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'secondary' :
                                'destructive'}
                        className="text-sm px-3 py-1"
                      >
                        {getComplianceStatus(analysis.gdpr_compliance).text}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          analysis.gdpr_compliance === 'COMPLIANT' ? 'bg-green-500 w-full' :
                          analysis.gdpr_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-500 w-2/3' :
                          'bg-red-500 w-1/3'
                        }`}
                      />
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-96">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">General Data Protection Regulation (EU)</h4>
                    <p className="text-sm text-gray-600">
                      The GDPR is the world&apos;s strongest privacy law, giving EU citizens comprehensive rights to access, correct, delete, and port their data. It requires explicit consent for data processing and imposes significant penalties for violations.
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-gray-700">
                        Compliance Status: <span className={getComplianceStatus(analysis.gdpr_compliance).color}>
                          {analysis.gdpr_compliance?.replace('_', ' ') || 'Unknown'}
                        </span>
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* CCPA with Enhanced Visual */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className={`p-5 rounded-xl border-2 transition-all cursor-help hover:shadow-lg ${
                    getComplianceStatus(analysis.ccpa_compliance).bg
                  } hover:scale-[1.02]`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {React.createElement(getComplianceStatus(analysis.ccpa_compliance).icon, {
                          className: `w-6 h-6 ${getComplianceStatus(analysis.ccpa_compliance).color}`
                        })}
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">CCPA</h4>
                          <p className="text-xs text-gray-600">California Consumer Privacy Act</p>
                        </div>
                      </div>
                      <Badge
                        variant={analysis.ccpa_compliance === 'COMPLIANT' ? 'default' :
                                analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'secondary' :
                                'destructive'}
                        className="text-sm px-3 py-1"
                      >
                        {getComplianceStatus(analysis.ccpa_compliance).text}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          analysis.ccpa_compliance === 'COMPLIANT' ? 'bg-green-500 w-full' :
                          analysis.ccpa_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-500 w-2/3' :
                          'bg-red-500 w-1/3'
                        }`}
                      />
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-96">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">California Consumer Privacy Act (US)</h4>
                    <p className="text-sm text-gray-600">
                      The CCPA gives California residents the right to know what personal information is collected, the right to delete it, the right to opt-out of its sale, and the right to non-discrimination for exercising these rights.
                    </p>
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-gray-700">
                        Compliance Status: <span className={getComplianceStatus(analysis.ccpa_compliance).color}>
                          {analysis.ccpa_compliance?.replace('_', ' ') || 'Unknown'}
                        </span>
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* DPDP Act 2023 with Enhanced Visual */}
              {analysis.dpdp_act_compliance && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className={`p-5 rounded-xl border-2 transition-all cursor-help hover:shadow-lg ${
                      getComplianceStatus(analysis.dpdp_act_compliance).bg
                    } hover:scale-[1.02]`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {React.createElement(getComplianceStatus(analysis.dpdp_act_compliance).icon, {
                            className: `w-6 h-6 ${getComplianceStatus(analysis.dpdp_act_compliance).color}`
                          })}
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">DPDP Act 2023</h4>
                            <p className="text-xs text-gray-600">Digital Personal Data Protection Act</p>
                          </div>
                        </div>
                        <Badge
                          variant={analysis.dpdp_act_compliance === 'COMPLIANT' ? 'default' :
                                  analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? 'secondary' :
                                  'destructive'}
                          className="text-sm px-3 py-1"
                        >
                          {getComplianceStatus(analysis.dpdp_act_compliance).text}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            analysis.dpdp_act_compliance === 'COMPLIANT' ? 'bg-green-500 w-full' :
                            analysis.dpdp_act_compliance === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-500 w-2/3' :
                            'bg-red-500 w-1/3'
                          }`}
                        />
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-96">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Digital Personal Data Protection Act 2023 (India)</h4>
                      <p className="text-sm text-gray-600">
                        India&apos;s comprehensive data protection law that governs the processing of digital personal data, giving individuals rights over their personal information and establishing accountability for data fiduciaries.
                      </p>
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium text-gray-700">
                          Compliance Status: <span className={getComplianceStatus(analysis.dpdp_act_compliance).color}>
                            {analysis.dpdp_act_compliance?.replace('_', ' ') || 'Unknown'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>

            {/* Overall Compliance Summary */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Overall Regulatory Compliance
                </div>
                <div className="flex gap-2">
                  {[analysis.gdpr_compliance, analysis.ccpa_compliance, analysis.dpdp_act_compliance].filter(Boolean).map((status, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        status === 'COMPLIANT' ? 'bg-green-500' :
                        status === 'PARTIALLY_COMPLIANT' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Website Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-600" />
              Website Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Website:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatHostname(analysis.hostname)}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={analysis.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Analysis Date:</span>
                <span className="font-medium">{formatDate(analysis.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Report ID:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">#{analysis.id}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Disclaimer */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Disclaimer</AlertTitle>
          <AlertDescription className="mt-2 space-y-2 text-sm">
            <p>
              <strong>Educational Purpose Only:</strong> This analysis and score is based on our proprietary methodology 
              and is intended for education and privacy awareness purposes only.
            </p>
            <p>
              <strong>Potential Limitations:</strong> The analysis may contain errors, omissions, or inaccuracies. 
              Privacy policies can change frequently, and our analysis reflects the policy at the time of review.
            </p>
            <p>
              <strong>Not Legal Advice:</strong> This report should not be used as the sole basis for legal, 
              business, or financial decisions. Always consult qualified professionals for specific advice.
            </p>
            <p>
              <strong>Independent Verification:</strong> We recommend reviewing the actual privacy policy 
              and consulting with privacy experts for critical assessments.
            </p>
          </AlertDescription>
        </Alert>

        {/* Footer Actions */}
        <div className="text-center pt-8">
          <div className="space-y-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">Analyze Another Website</Link>
            </Button>
            <p className="text-sm text-gray-500">
              Help us improve privacy awareness by sharing this report with others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}