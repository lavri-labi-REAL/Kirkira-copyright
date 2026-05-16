"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { CheckCircle, Loader, LayoutDashboard, ArrowRight } from "lucide-react";

interface Props {
  application: any;
}

export function Step7BackgroundFiling({ application }: Props) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Loader className="w-4 h-4 text-white animate-spin" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Queued!</h2>
        <p className="text-gray-500 max-w-md">
          Your copyright application has been submitted to our filing system. Our automation
          worker will now file it directly with KECOBO.
        </p>
      </div>

      <div className="bg-primary-50 rounded-xl p-5 w-full max-w-sm text-left space-y-2">
        <div className="flex items-center gap-2 text-primary-700">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">Application data saved</span>
        </div>
        <div className="flex items-center gap-2 text-primary-700">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">Documents uploaded</span>
        </div>
        <div className="flex items-center gap-2 text-primary-700">
          <Loader className="w-4 h-4 text-primary-700 animate-spin" />
          <span className="text-sm font-medium">Filing with KECOBO...</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
          <span className="text-sm">Certificate delivery</span>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-400">
          Redirecting to dashboard in 5 seconds...
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          <LayoutDashboard className="w-4 h-4" />
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
