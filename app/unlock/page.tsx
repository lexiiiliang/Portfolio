import Link from "next/link";
import { Localized } from "@/components/Localized";
import { SiteHeader } from "@/components/SiteHeader";
import { UnlockForm } from "@/components/UnlockForm";

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/projects/") ? next : "/#work";

  return (
    <>
      <SiteHeader compact />
      <main className="unlock-page">
        <div className="unlock-orbit" aria-hidden="true"><span>✦</span></div>
        <div className="unlock-copy">
          <p className="micro-label">PRIVATE CASE / 访客访问</p>
          <h1><Localized en="Some work needs a quieter room." zh="有些项目，需要在更安静的房间里观看。" /></h1>
          <p>
            <Localized
              en="Enter the shared portfolio password to continue. Access stays active on this device for seven days."
              zh="请输入作品集共享密码。验证后，本设备会保留七天访问权限。"
            />
          </p>
          <UnlockForm nextPath={nextPath} />
          <Link href="/#work" className="text-link"><Localized en="← Back to selected work" zh="← 返回精选项目" /></Link>
        </div>
      </main>
    </>
  );
}
