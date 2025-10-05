'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PrivacyAnalyzer from '@/components/PrivacyAnalyzer';
import { AnalysisHistoryCards } from '@/components/AnalysisHistoryCards';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Privacy Awareness Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Your Privacy Matters
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Know What Apps & Websites Do With Your Personal Data
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                Every day you use apps and visit websites that collect your personal information.
                Do you know how they use it? Our free privacy policy analyser helps you understand
                what&rsquo;s really happening with your data.
              </p>

              {/* Privacy Policy Analyser - Moved to top */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy Policy Analyser</h3>
                  <p className="text-sm text-slate-600">Enter any website or app privacy policy URL to get an instant AI-powered analysis</p>
                </div>
                <div id="analyzer">
                  <PrivacyAnalyzer />
                </div>
              </div>

              {/* Privacy Concerns */}
              <div className="bg-orange-50 rounded-lg p-6 mb-8 border border-orange-200">
                <h3 className="text-lg font-bold text-orange-800 mb-4">Common Privacy Concerns:</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-orange-700"><strong>Data Selling:</strong> Many apps sell your personal information to third parties</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-orange-700"><strong>Location Tracking:</strong> Your every move might be recorded and stored</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-orange-700"><strong>Hidden Permissions:</strong> Apps access more data than you realize</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-orange-700"><strong>Unclear Policies:</strong> Privacy policies are often confusing and lengthy</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Privacy Education Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Your Privacy Matters
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto">
              Your personal data is valuable. Companies collect it to make money, governments use it for surveillance, 
              and hackers want to steal it. Here&rsquo;s what you need to know:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Your Data = Money</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Companies like Google and Facebook make billions selling access to your personal information. 
                  The more they know about you, the more money they make.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">👁️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Constant Surveillance</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your phone tracks your location 24/7. Apps monitor what you do, when you sleep, 
                  who you call, and what you buy. This data never gets deleted.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">You Have Rights</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Laws like GDPR give you the right to know what data is collected, 
                  delete your information, and say no to data sharing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Analysis Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              See How Popular Apps Handle Your Privacy
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our community has analyzed thousands of privacy policies from apps and websites you use every day. 
              Discover which ones protect your privacy and which ones don&rsquo;t.
            </p>
          </div>
          
          <AnalysisHistoryCards />
        </div>
      </section>
      
      {/* Privacy Protection Tips Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Take Control of Your Digital Privacy
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-10">
              Small changes can make a big difference. Here are simple tools and tips 
              to protect your privacy online.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Digital Footprint Check</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  See exactly what information your browser reveals to every website you visit.
                </p>
                <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700" asChild>
                  <Link href="/digital-fingerprint">Check Now →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Privacy Education</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Learn how privacy policies work and what to look for when reading them.
                </p>
                <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700" asChild>
                  <Link href="/methodology">Learn More →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Support Privacy Rights</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Help us build better privacy tools and spread awareness about digital rights.
                </p>
                <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700" asChild>
                  <Link href="/support">Get Involved →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Privacy Tips */}
          <div className="mt-16 bg-slate-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Quick Privacy Tips for Daily Life</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Review App Permissions</h4>
                  <p className="text-slate-300 text-sm">
                    Check what permissions your apps have. Turn off location, camera, and microphone access for apps that don&rsquo;t need them.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Use Private Browsing</h4>
                  <p className="text-slate-300 text-sm">
                    Browse in private/incognito mode to prevent websites from tracking your activity across sessions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Read Before You Accept</h4>
                  <p className="text-slate-300 text-sm">
                    Take a few minutes to read privacy policies, especially for apps that handle sensitive data like banking or health.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Delete Unused Accounts</h4>
                  <p className="text-slate-300 text-sm">
                    Regularly delete old accounts and apps you no longer use. Each one is a potential privacy risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
