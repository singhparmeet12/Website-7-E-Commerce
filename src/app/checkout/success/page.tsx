import { Suspense } from 'react';
import { SuccessClient } from '@/components/checkout/SuccessClient';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent-cobalt" />
          <p className="font-mono text-xs uppercase tracking-wider text-studio-500">
            Confirming order dispatch...
          </p>
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
