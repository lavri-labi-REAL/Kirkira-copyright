"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "../../../components/layout/AppShell";
import { WizardProgress } from "../../../components/wizard/WizardProgress";
import { Step1DescribeWork } from "../../../components/wizard/Step1DescribeWork";
import { Step2PreviewRequirements } from "../../../components/wizard/Step2PreviewRequirements";
import { Step3ProfileAndOwners } from "../../../components/wizard/Step3ProfileAndOwners";
import { Step5WorkDetails as Step4WorkDetails } from "../../../components/wizard/Step5WorkDetails";
import { Step6ReviewConfirm as Step5ReviewConfirm } from "../../../components/wizard/Step6ReviewConfirm";
import { Step7BackgroundFiling as Step6BackgroundFiling } from "../../../components/wizard/Step7BackgroundFiling";
import { applications } from "../../../lib/api";
import { Save } from "lucide-react";

export default function WizardPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [step, setStep]               = useState(1);
  const [loading, setLoading]         = useState(true);
  const [lastSaved, setLastSaved]     = useState<Date | null>(null);
  const [error, setError]             = useState("");

  useEffect(() => {
    if (!localStorage.getItem("kira_token")) { router.push("/login"); return; }
    applications.get(id)
      .then((app) => {
        setApplication(app);
        // Map legacy 7-step wizard_step values to new 6-step values
        const raw = app.wizard_step || 1;
        const mapped = raw >= 5 ? raw - 1 : raw; // old 5→4, 6→5, 7→6
        setStep(Math.min(mapped, 6));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleUpdate = useCallback(async (data: Record<string, any>) => {
    const updated = await applications.update(id, data);
    setApplication(updated);
    setLastSaved(new Date());
    if (data.wizard_step) setStep(data.wizard_step);
  }, [id]);

  const handleConfirmFiling = useCallback(async () => {
    await applications.confirmFiling(id);
    setStep(6);
    const updated = await applications.get(id);
    setApplication(updated);
  }, [id]);

  if (loading) return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto" />
        <div className="h-2 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    </AppShell>
  );

  if (error || !application) return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 font-medium">{error || "Application not found"}</p>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      {/* Thin top accent line */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary/40" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
              Copyright Filing Wizard
            </p>
            <h1 className="text-xl font-bold text-gray-900">
              {application.title || "New Application"}
            </h1>
          </div>
          {lastSaved && step < 6 && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <Save className="w-3.5 h-3.5" />
              Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
        </div>

        {/* Step progress */}
        {step < 6 && (
          <div className="mb-8">
            <WizardProgress current={step} />
          </div>
        )}

        {/* Step content card */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 sm:p-8">
          {step === 1 && <Step1DescribeWork application={application} onUpdate={handleUpdate} onNext={() => setStep(2)} />}
          {step === 2 && <Step2PreviewRequirements application={application} onNext={() => { handleUpdate({ wizard_step: 3 }); }} onBack={() => setStep(1)} />}
          {step === 3 && <Step3ProfileAndOwners application={application} onUpdate={handleUpdate} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <Step4WorkDetails application={application} onUpdate={handleUpdate} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <Step5ReviewConfirm application={application} onConfirm={handleConfirmFiling} onBack={() => setStep(4)} />}
          {step === 6 && <Step6BackgroundFiling application={application} />}
        </div>
      </div>
    </AppShell>
  );
}
