"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import ToolGrid from "@/components/dashboard/ToolGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import VoiceInput from "@/components/voice/VoiceInput";
import Card from "@/components/ui/Card";
import { useFamilyMode } from "@/hooks/useFamilyMode";
import { useHistory } from "@/hooks/useHistory";
import { useRouter } from "next/navigation";

const voiceHints = [
  "Try: \"Write a complaint letter to my landlord\"",
  "Try: \"Explain my blood report\"",
  "Try: \"Check if this message is a scam\"",
  "Try: \"Help me write a sick leave application\"",
];

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { familyMode, toggleFamilyMode } = useFamilyMode();
  const { history } = useHistory();
  const router = useRouter();
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex((i) => (i + 1) % voiceHints.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleVoiceResult = (text: string) => {
    router.push(`/chat?q=${encodeURIComponent(text)}`);
  };

  const stats = [
    { label: "Documents created", value: history.length },
    { label: "Estimated hours saved", value: Math.round(history.length * 0.5) },
    { label: "Files processed", value: history.filter((h) => h.inputs && typeof h.inputs === "object").length },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar familyMode={familyMode} onFamilyModeChange={toggleFamilyMode} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} familyMode={familyMode} onFamilyModeChange={toggleFamilyMode} />
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <main className="lg:ml-[256px] p-4 md:p-8 max-w-6xl">
        <div className="flex flex-col gap-8">
          <WelcomeBanner />

          {/* Voice Quick Start */}
          <Card padding="lg" className="relative overflow-hidden">
            <div className="flex flex-col items-center gap-4 text-center">
              <VoiceInput onResult={handleVoiceResult} size="lg" label="🎙️ Just tell us what you need" />
              <motion.p
                key={hintIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[13px] text-[var(--text-tertiary)]"
              >
                {voiceHints[hintIndex]}
              </motion.p>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <Card key={s.label} padding="md">
                <p className="text-[24px] font-semibold text-[var(--text-primary)]">{s.value}</p>
                <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Tool Grid */}
          <div>
            <h2 className="text-[20px] font-medium text-[var(--text-primary)] mb-4">All Tools</h2>
            <ToolGrid />
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-[20px] font-medium text-[var(--text-primary)] mb-4">Recent Activity</h2>
            <Card padding="none">
              <RecentActivity items={history} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
