import { AccountInformationForm } from "./components/AccountInformationForm";
import { AppearanceForm } from "./components/AppearanceForm";
import { ProfileInformationForm } from "./components/ProfileInformationForm";
import { Section } from "./components/Section";

export default function PreferencesForm() {
  return (
    <article className="max-w-4xl">
      <Section title="계정 정보">
        <AccountInformationForm />
      </Section>
      <Section title="프로필 정보">
        <ProfileInformationForm />
      </Section>
      <Section title="테마">
        <AppearanceForm />
      </Section>
    </article>
  );
}
