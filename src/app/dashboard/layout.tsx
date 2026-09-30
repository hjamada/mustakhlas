import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">م</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">مُستخلَص</p>
              <p className="text-gray-400 text-xs truncate max-w-[120px]">{session.user.companyName}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/dashboard", label: "الرئيسية", icon: "🏠" },
            { href: "/dashboard/projects", label: "المشاريع", icon: "🏗️" },
            { href: "/dashboard/ipcs", label: "المستخلصات", icon: "📋" },
            { href: "/dashboard/team", label: "الفريق", icon: "👥" },
            { href: "/dashboard/settings", label: "الإعدادات", icon: "⚙️" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-700 text-xs font-bold">
                {session.user.name?.charAt(0) || "م"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
              <p className="text-xs text-gray-400">{getRoleLabel(session.user.role)}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST" className="mt-3">
            <Button variant="ghost" size="sm" className="w-full text-gray-500 text-xs">
              تسجيل الخروج
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    OWNER: "مالك المنشأة",
    PROJECT_MANAGER: "مدير المشروع",
    SITE_ENGINEER: "مهندس موقع",
    QS_ENGINEER: "مهندس كميات",
    ACCOUNTANT: "محاسب",
  }
  return labels[role] || role
}
