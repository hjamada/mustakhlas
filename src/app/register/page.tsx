"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const data = {
      // Company
      crNumber: form.get("crNumber"),
      vatNumber: form.get("vatNumber"),
      nameAr: form.get("nameAr"),
      phone: form.get("phone"),
      companyEmail: form.get("companyEmail"),
      // Owner
      fullName: form.get("fullName"),
      email: form.get("email"),
      password: form.get("password"),
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.message || "حدث خطأ، يرجى المحاولة مجدداً")
      } else {
        router.push("/login?registered=1")
      }
    } catch {
      setError("حدث خطأ في الاتصال")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">م</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">تسجيل منشأة جديدة</h1>
          <p className="text-gray-500 text-sm mt-1">أنشئ حسابك وابدأ إدارة مستخلصاتك</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-2 mb-2">
              {[1, 2].map((s) => (
                <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${step >= s ? "bg-blue-600" : "bg-gray-200"}`} />
              ))}
            </div>
            <CardTitle>{step === 1 ? "بيانات المنشأة" : "بيانات المسؤول"}</CardTitle>
            <CardDescription>
              {step === 1 ? "الخطوة 1 من 2: معلومات شركتك" : "الخطوة 2 من 2: حساب المدير"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nameAr">اسم المنشأة</Label>
                    <Input id="nameAr" name="nameAr" placeholder="شركة النجاح للمقاولات" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crNumber">رقم السجل التجاري</Label>
                      <Input id="crNumber" name="crNumber" placeholder="1010123456" required dir="ltr" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vatNumber">الرقم الضريبي</Label>
                      <Input id="vatNumber" name="vatNumber" placeholder="300000000000003" required dir="ltr" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input id="phone" name="phone" placeholder="0512345678" required dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">البريد الإلكتروني للمنشأة</Label>
                    <Input id="companyEmail" name="companyEmail" type="email" placeholder="info@company.com" required dir="ltr" />
                  </div>
                  <Button type="button" className="w-full" onClick={() => setStep(2)}>
                    التالي ←
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل</Label>
                    <Input id="fullName" name="fullName" placeholder="محمد العبدالله" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني (للدخول)</Label>
                    <Input id="email" name="email" type="email" placeholder="manager@company.com" required dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input id="password" name="password" type="password" placeholder="8 أحرف على الأقل" required dir="ltr" minLength={8} />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                      → رجوع
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
                    </Button>
                  </div>
                </>
              )}
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                سجّل الدخول
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
