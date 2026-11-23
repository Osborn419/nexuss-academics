import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm text-emerald-400">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Not in the library</h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        That page or file does not exist. It may have been moved by the administrator.
      </p>
      <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-canvas">
        <Home className="h-4 w-4" /> Back to Nexus Academics
      </Link>
    </div>
  );
}
