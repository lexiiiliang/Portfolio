import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader compact />
      <main className="not-found">
        <p className="micro-label">404 / OFF THE MAP</p>
        <h1>This path has not become a project yet.</h1>
        <Link href="/">Return home ↗</Link>
      </main>
    </>
  );
}
