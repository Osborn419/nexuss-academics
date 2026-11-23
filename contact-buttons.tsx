import { GraduationCap, Mail, MessageCircle, Phone } from "lucide-react";
import { site } from "@/config/site";

/** WhatsApp / call / email buttons for reaching the creator. */
export function ContactButtons({
  compact = false,
  includeSchoolEmail = false,
}: {
  compact?: boolean;
  includeSchoolEmail?: boolean;
}) {
  const { contact } = site;
  const size = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";

  return (
    <div className="flex flex-wrap gap-2">
      {contact.showPhone ? (
        <a
          href={contact.whatsapp}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 font-semibold text-emerald-200 ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/25 ${size}`}
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      ) : null}
      {contact.showPhone ? (
        <a
          href={`tel:${contact.phoneIntl}`}
          className={`inline-flex items-center gap-2 rounded-xl bg-white/5 font-semibold text-slate-200 ring-1 ring-white/12 transition hover:bg-white/10 ${size}`}
        >
          <Phone className="h-4 w-4" /> Call
        </a>
      ) : null}
      <a
        href={`mailto:${contact.email}`}
        className={`inline-flex items-center gap-2 rounded-xl bg-white/5 font-semibold text-slate-200 ring-1 ring-white/12 transition hover:bg-white/10 ${size}`}
      >
        <Mail className="h-4 w-4" /> Email
      </a>
      {includeSchoolEmail ? (
        <a
          href={`mailto:${contact.schoolEmail}`}
          className={`inline-flex items-center gap-2 rounded-xl bg-white/5 font-semibold text-slate-200 ring-1 ring-white/12 transition hover:bg-white/10 ${size}`}
        >
          <GraduationCap className="h-4 w-4" /> UG email
        </a>
      ) : null}
    </div>
  );
}
