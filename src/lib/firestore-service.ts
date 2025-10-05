import { getFirestoreAdmin } from './firebase-admin';
import crypto from 'crypto';

export interface AnalysisDocument {
  domain: string; // e.g., "example.com"
  url: string; // Full privacy policy URL
  hostname: string;
  logo_url?: string; // Website logo/favicon URL
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  gdpr_compliance: string;
  ccpa_compliance: string;
  dpdp_act_compliance?: string;
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
  content_hash: string; // MD5 hash of page content for change detection
  created_at: string;
  updated_at: string;
  last_checked_at: string;
}

/**
 * Generate MD5 hash of content for change detection
 */
export function generateContentHash(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Extract domain from URL (e.g., "https://example.com/privacy" -> "example.com")
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^www\./, '').split('/')[0];
  }
}

/**
 * Check if analysis exists and if content has changed
 */
export async function checkExistingAnalysis(
  domain: string,
  currentContentHash: string
): Promise<{ exists: boolean; needsUpdate: boolean; data?: AnalysisDocument }> {
  const db = getFirestoreAdmin();
  const docRef = db.collection('analyses').doc(domain);
  const doc = await docRef.get();

  if (!doc.exists) {
    return { exists: false, needsUpdate: true };
  }

  const data = doc.data() as AnalysisDocument;
  const lastChecked = new Date(data.last_checked_at);
  const now = new Date();
  const daysSinceLastCheck = (now.getTime() - lastChecked.getTime()) / (1000 * 60 * 60 * 24);

  // If content changed OR more than 30 days since last check
  const contentChanged = data.content_hash !== currentContentHash;
  const needsUpdate = contentChanged || daysSinceLastCheck > 30;

  return { exists: true, needsUpdate, data };
}

/**
 * Save or update analysis in Firestore
 */
export async function saveAnalysis(
  domain: string,
  analysisData: Omit<AnalysisDocument, 'domain' | 'created_at' | 'updated_at' | 'last_checked_at'>
): Promise<void> {
  const db = getFirestoreAdmin();
  const docRef = db.collection('analyses').doc(domain);
  const doc = await docRef.get();

  const now = new Date().toISOString();

  if (doc.exists) {
    // Update existing document
    await docRef.update({
      ...analysisData,
      updated_at: now,
      last_checked_at: now,
    });
  } else {
    // Create new document
    await docRef.set({
      domain,
      ...analysisData,
      created_at: now,
      updated_at: now,
      last_checked_at: now,
    });
  }
}

/**
 * Get analysis by domain
 */
export async function getAnalysisByDomain(domain: string): Promise<AnalysisDocument | null> {
  const db = getFirestoreAdmin();
  const docRef = db.collection('analyses').doc(domain);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  return doc.data() as AnalysisDocument;
}

/**
 * Get all analyses for homepage
 */
export async function getAllAnalyses(limit = 20): Promise<AnalysisDocument[]> {
  const db = getFirestoreAdmin();
  const snapshot = await db
    .collection('analyses')
    .orderBy('updated_at', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => doc.data() as AnalysisDocument);
}

/**
 * Update last_checked_at timestamp
 */
export async function updateLastChecked(domain: string): Promise<void> {
  const db = getFirestoreAdmin();
  const docRef = db.collection('analyses').doc(domain);
  await docRef.update({
    last_checked_at: new Date().toISOString(),
  });
}
