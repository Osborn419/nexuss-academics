/**
 * Nexus Academics — site configuration.
 */
const contact = {
  email: "frimpongrobert67@gmail.com",
  schoolEmail: "okfrimpong002@st.ug.edu.gh",
  phone: "0599793927",
  phoneDisplay: "059 979 3927",
  phoneIntl: "+233599793927",
  whatsapp: "https://wa.me/233599793927",
  showPhone: true as boolean,
};

export const site = {
  projectName: "Nexus Academics",
  groupName: "Nexus Academics",
  creatorName: "Osborn Kobi Frimpong",
  ownerName: "Osborn Kobi Frimpong",
  ownerFirstName: "Osborn",
  ownerRole: "Founder & Developer",
  ownerTitle: "Student, University of Ghana",
  contact,
  university: "University of Ghana",
  campus: "Legon",
  cohort: "Level 100 IT",
  tagline: "Learn together. Rank honestly. Graduate ready.",
  description:
    "Nexus Academics is the academic learning platform for the University of Ghana Level 100 IT study group: DCIT 101, DCIT 103, DCIT 105, STAT 111 and ECON 101, plus the UGRC 110 / UGRC 150 elective.",
  /** Set once an administrator account exists (see /setup). */
} as const;

export const siteNav = [
  { href: "/courses", label: "Courses" },
  { href: "/weeks", label: "This week" },
  { href: "/materials", label: "Library" },
  { href: "/quizzes", label: "Exams" },
  { href: "/forum", label: "Forum" },
  { href: "/calendar", label: "Calendar" },
] as const;
