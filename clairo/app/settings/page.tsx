"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { useFamilyMode } from "@/hooks/useFamilyMode";
import { LANGUAGES, PERSONAS } from "@/types";

export default function SettingsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { familyMode, toggleFamilyMode } = useFamilyMode();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("english");
  const [defaultPersona, setDefaultPersona] = useState("office-assistant");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setName(localStorage.getItem("clairo-name") || "");
    setLanguage(localStorage.getItem("clairo-language") || "english");
    setDefaultPersona(localStorage.getItem("clairo-persona") || "office-assistant");
    setTheme(localStorage.getItem("clairo-theme") || "light");
  }, []);

  const save = () => {
    localStorage.setItem("clairo-name", name);
    localStorage.setItem("clairo-language", language);
    localStorage.setItem("clairo-persona", defaultPersona);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Sidebar familyMode={familyMode} onFamilyModeChange={toggleFamilyMode} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} familyMode={familyMode} onFamilyModeChange={toggleFamilyMode} />
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <main className="lg:ml-[256px] p-4 md:p-8 max-w-2xl">
        <h1 className="font-display text-[28px] md:text-[32px] font-semibold text-[var(--text-primary)] mb-6">Settings</h1>

        <div className="flex flex-col gap-6">
          <Card padding="lg">
            <h2 className="text-[18px] font-medium text-[var(--text-primary)] mb-4">Account</h2>
            <div className="flex flex-col gap-4">
              <Input label="Your name" placeholder="What should we call you?" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-[18px] font-medium text-[var(--text-primary)] mb-4">Preferences</h2>
            <div className="flex flex-col gap-4">
              <Select label="Default language" options={LANGUAGES.map((l) => ({ value: l.id, label: l.label }))} value={language} onChange={(e) => setLanguage(e.target.value)} />
              <Select label="Default assistant style" options={PERSONAS.map((p) => ({ value: p.id, label: `${p.emoji} ${p.label}` }))} value={defaultPersona} onChange={(e) => setDefaultPersona(e.target.value)} />
              <Select label="Theme" options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "system", label: "System" }]} value={theme} onChange={(e) => {
                setTheme(e.target.value);
                document.documentElement.setAttribute("data-theme", e.target.value === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : e.target.value);
                localStorage.setItem("clairo-theme", e.target.value);
              }} />
              <div className="pt-2">
                <Toggle checked={familyMode} onChange={toggleFamilyMode} label="Family Mode — larger text, bigger buttons, simpler interface" />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-[18px] font-medium text-[var(--text-primary)] mb-4">Privacy</h2>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" size="sm" onClick={() => {
                const data = JSON.stringify(localStorage, null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "clairo-data.json"; a.click();
              }}>Download all my data</Button>
              <Button variant="danger" size="sm" onClick={() => {
                if (confirm("Are you sure? This will delete all your data.")) {
                  localStorage.clear();
                  window.location.href = "/";
                }
              }}>Delete all data</Button>
            </div>
          </Card>

          <Button onClick={save} fullWidth>Save changes</Button>
        </div>
      </main>
    </div>
  );
}
