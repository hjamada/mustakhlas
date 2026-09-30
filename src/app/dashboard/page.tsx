import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

  const [projectsCount, ipcsCount, pendingIPCs] = await Promise.all([
    prisma.project.count({ where: { companyId: session.user.companyId } }),
    prisma.iPC.count({
      where: { project: { companyId: session.user.companyId } },
    }),
    prisma.iPC.findMany({
      where: {
        project: { companyId: session.user.companyId },
        status: { in: ["DRAFT", "SUBMITTED", "UNDER_REVIEW"] },
      },
      include: { project: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const totalPending = pendingIPCs.reduce(
    (sum, ipc) => sum + Number(ipc.totalPayable),
    0
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          مرحباً، {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">إليك نظرة عامة على نشاطك</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي المشاريع</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{projectsCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                🏗️
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي المستخلصات</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{ipcsCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                📋
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">مبالغ قيد التحصيل</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {formatCurrency(totalPending)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
                💰
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent IPCs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">آخر المستخلصات</CardTitle>
          <Link href="/dashboard/projects">
            <Button variant="outline" size="sm">+ مشروع جديد</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {pendingIPCs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📂</div>
              <p className="text-gray-500 mb-4">لا توجد مستخلصات بعد</p>
              <Link href="/dashboard/projects">
                <Button>أنشئ مشروعك الأول</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingIPCs.map((ipc) => (
                <Link key={ipc.id} href={`/dashboard/ipcs/${ipc.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">
                        مستخلص #{ipc.ipcNumber} — {ipc.project.name}
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {new Date(ipc.createdAt).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        {formatCurrency(Number(ipc.totalPayable))}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(ipc.status)}`}>
                        {getStatusLabel(ipc.status)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    DRAFT: "مسودة",
    SUBMITTED: "مُرسل",
    UNDER_REVIEW: "قيد المراجعة",
    APPROVED_PARTIAL: "معتمد جزئياً",
    APPROVED_FULL: "معتمد",
    REJECTED: "مرفوض",
    PAID: "مدفوع",
  }
  return labels[status] || status
}

function getStatusStyle(status: string) {
  const styles: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-600",
    SUBMITTED: "bg-blue-100 text-blue-700",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
    APPROVED_PARTIAL: "bg-orange-100 text-orange-700",
    APPROVED_FULL: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    PAID: "bg-emerald-100 text-emerald-700",
  }
  return styles[status] || "bg-gray-100 text-gray-600"
}
