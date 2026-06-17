import { useEffect } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-800 to-yellow-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="space-y-5">
          <div className="w-24 h-24 bg-amber-50 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-yellow-900">LS</span>
          </div>
          <h1 className="text-4xl font-bold">La Sede</h1>
          <p className="text-xl font-medium tracking-[0.22em] opacity-90">UADE</p>
        </div>
      </div>
    </div>
  );
}
