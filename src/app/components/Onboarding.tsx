import { useEffect } from 'react';
import sinfiLogo from '../../assets/sinfi-logo-transparent.png';

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
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#13c33e]">
      <img
        src={sinfiLogo}
        alt="SinFi"
        className="h-[92vmin] w-[92vmin] object-contain drop-shadow-2xl"
      />
    </div>
  );
}
