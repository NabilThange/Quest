'use client';

import { Suspense } from 'react';
import Auth9 from '@/components/ui/auth-09';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-neutral-900 font-sans">Loading...</div>}>
      <Auth9 initialMode="login" />
    </Suspense>
  );
}
