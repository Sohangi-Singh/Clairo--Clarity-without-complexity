"use client";

import Button from "../ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  showBack?: boolean;
  nextDisabled?: boolean;
  loading?: boolean;
}

export default function StepNav({
  onBack,
  onNext,
  nextLabel = "Continue",
  showBack = true,
  nextDisabled = false,
  loading = false,
}: StepNavProps) {
  return (
    <div className="flex items-center justify-between pt-6">
      {showBack && onBack ? (
        <Button variant="ghost" size="md" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
      ) : (
        <div />
      )}
      <Button
        variant="primary"
        size="md"
        onClick={onNext}
        disabled={nextDisabled}
        loading={loading}
        icon={!loading ? <ArrowRight size={16} /> : undefined}
      >
        {nextLabel}
      </Button>
    </div>
  );
}
