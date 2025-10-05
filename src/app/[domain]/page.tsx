import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAnalysisByDomain } from '@/lib/firestore-service';
import { AnalysisDetailView } from '@/components/AnalysisDetailView';

interface Props {
  params: Promise<{ domain: string }>;
}

async function getAnalysis(domain: string) {
  try {
    const analysis = await getAnalysisByDomain(domain);
    return analysis;
  } catch (error) {
    console.error('Error fetching analysis from Firestore:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;
  const analysis = await getAnalysis(domain);

  if (!analysis) {
    return {
      title: 'Analysis Not Found | PrivacyHub.in',
    };
  }

  const hostname = analysis.hostname.replace(/^www\./, '');

  return {
    title: `${hostname} Privacy Analysis | PrivacyHub.in`,
    description: `Detailed privacy policy analysis for ${hostname}. Grade: ${analysis.privacy_grade}, Score: ${Math.round(analysis.overall_score)}. Comprehensive GDPR, CCPA & DPDP Act 2023 compliance review.`,
    openGraph: {
      title: `${hostname} Privacy Analysis | PrivacyHub.in`,
      description: `Privacy grade ${analysis.privacy_grade} with ${Math.round(analysis.overall_score)} score. ${analysis.risk_level} risk level.`,
      type: 'website',
      url: `https://privacyhub.in/${domain}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hostname} Privacy Analysis | PrivacyHub.in`,
      description: `Privacy grade ${analysis.privacy_grade} with ${Math.round(analysis.overall_score)} score. ${analysis.risk_level} risk level.`,
    },
  };
}

export default async function DomainAnalysisPage({ params }: Props) {
  const { domain } = await params;
  const analysis = await getAnalysis(domain);

  if (!analysis) {
    notFound();
  }

  // Transform Firestore document to match the AnalysisDetailView expected format
  const analysisData = {
    id: 0, // Firestore doesn't use numeric IDs
    url: analysis.url,
    hostname: analysis.hostname,
    overall_score: analysis.overall_score,
    privacy_grade: analysis.privacy_grade,
    risk_level: analysis.risk_level,
    gdpr_compliance: analysis.gdpr_compliance,
    ccpa_compliance: analysis.ccpa_compliance,
    dpdp_act_compliance: analysis.dpdp_act_compliance,
    created_at: analysis.last_checked_at, // Use last_checked_at for display
    analysis_data: analysis.analysis_data
  };

  return <AnalysisDetailView analysis={analysisData} />;
}
