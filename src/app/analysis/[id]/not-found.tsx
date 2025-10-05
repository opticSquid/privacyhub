import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Analysis Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The privacy analysis you&apos;re looking for doesn&apos;t exist or may have been removed. 
          This could happen if the analysis ID is incorrect or the analysis has expired.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Search className="w-4 h-4 mr-2" />
              Browse All Analyses
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Looking for a specific website?</strong> Use our privacy policy analyser to create a new analysis
            or browse our community database for existing analyses.
          </p>
        </div>
      </div>
    </div>
  );
}