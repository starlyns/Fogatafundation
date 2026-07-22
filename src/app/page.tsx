import { AppShell } from "@/components/layout/AppShell";
import { Hero } from "@/components/sections/Hero";
import { Vision } from "@/components/sections/Vision";
import { Gap } from "@/components/sections/Gap";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Participate } from "@/components/sections/Participate";
import { Covenant } from "@/components/sections/Covenant";
import { FirstFire } from "@/components/sections/FirstFire";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <AppShell>
      <Hero />
      <Vision />
      <Gap />
      <HowItWorks />
      <Participate />
      <Covenant />
      <FirstFire />
      <Ecosystem />
      <Faq />
      <FinalCta />
    </AppShell>
  );
}
