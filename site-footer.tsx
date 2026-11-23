import Link from "next/link";
import { site } from "@/config/site";
import { initials } from "@/lib/format";
import { ContactButtons } from "@/components/contact-buttons";

export function SiteFooter() {
  const { contact } = site;

  return (
    <footer className="border-t border-white/10 bg-canvas/60">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400/90">
            Nexus <span className="text-white">Academics</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            {site.tagline} The academic hub for the {site.cohort} study group at the{" "}
            {site.university}, {site.campus}.
          </p>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-slate-500">
            DCIT 101 · DCIT 103 · DCIT 105 · STAT 111 · ECON 101 · UGRC 110 / 150
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-400">
            <li><Link href="/courses" className="hover:text-emerald-300">Courses</Link></li>
            <li><Link href="/materials" className="hover:text-emerald-300">Library</Link></li>
            <li><Link href="/weeks" className="hover:text-emerald-300">This week</Link></li>
            <li><Link href="/quizzes" className="hover:text-emerald-300">Exams &amp; practice</Link></li>
            <li><Link href="/forum" className="hover:text-emerald-300">Forum</Link></li>
            <li><Link href="/assignments" className="hover:text-emerald-300">Assignments</Link></li>
            <li><Link href="/calendar" className="hover:text-emerald-300">Calendar</Link></li>
            <li><Link href="/presentations" className="hover:text-emerald-300">Presentations</Link></li>
            <li><Link href="/announcements" className="hover:text-emerald-300">Announcements</Link></li>
            <li><Link href="/leaderboard" className="hover:text-emerald-300">Leaderboard</Link></li>
            <li><Link href="/flashcards" className="hover:text-emerald-300">Flashcards</Link></li>
            <li><Link href="/assistant" className="hover:text-emerald-300">AI assistant</Link></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Founder &amp; Developer
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-xs font-black text-canvas">
              {initials(site.creatorName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">{site.creatorName}</p>
              <p className="text-xs text-slate-400">{site.ownerRole} · {site.ownerTitle}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
            <li><a href={`mailto:${contact.email}`} className="hover:text-emerald-300">{contact.email}</a></li>
            <li><a href={`mailto:${contact.schoolEmail}`} className="hover:text-emerald-300">{contact.schoolEmail}</a></li>
            {contact.showPhone ? <li><a href={`tel:${contact.phoneIntl}`} className="hover:text-emerald-300">{contact.phoneDisplay}</a></li> : null}
          </ul>
          <div className="mt-4">
            <ContactButtons compact includeSchoolEmail />
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-5 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Nexus Academics · Created by {site.creatorName}, {site.ownerRole} ·{" "}
        {site.university}. Course materials belong to their respective lecturers and authors.
      </div>
    </footer>
  );
}
