import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">م</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">مُستخلَص</h1>
              <p className="text-blue-300 text-xs">SubConPay</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-blue-900 hover:bg-blue-50">
                ابدأ مجاناً
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-600/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-blue-200 text-sm">مخصص لقطاع المقاولات في المملكة العربية السعودية</span>
        </div>

        <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
          أنهِ مشكلة تأخر
          <br />
          <span className="text-blue-300">صرف المستخلصات</span>
          <br />
          إلى الأبد
        </h2>

        <p className="text-blue-200 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          منصة متخصصة لمقاولي الباطن تُحول عملية المطالبة بالمستخلصات من معركة إدارية
          إلى ملف رقمي موثق لا يمكن رفضه.
        </p>

        <div className="flex gap-4 justify-center mb-20">
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 h-14">
              ابدأ مجاناً ←
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 h-14">
              شاهد العرض التجريبي
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: "📊",
              title: "استيراد BOQ ذكي",
              desc: "رفع جداول الكميات من Excel وتحليلها تلقائياً في ثوانٍ"
            },
            {
              icon: "📸",
              title: "توثيق ميداني",
              desc: "صور موثقة بالإحداثيات والوقت من هاتف المهندس مباشرة"
            },
            {
              icon: "✅",
              title: "اعتماد إلكتروني",
              desc: "بوابة مراجعة للمقاول الرئيسي دون الحاجة لإنشاء حساب"
            },
          ].map((f, i) => (
            <Card key={i} className="bg-white/10 border-white/10 text-white">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
