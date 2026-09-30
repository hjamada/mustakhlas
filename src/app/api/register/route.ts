import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  crNumber: z.string().min(10).max(15),
  vatNumber: z.string().min(15).max(15),
  nameAr: z.string().min(2),
  phone: z.string().min(9),
  companyEmail: z.string().email(),
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    // Check if company already exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { crNumber: data.crNumber },
          { vatNumber: data.vatNumber },
        ],
      },
    })

    if (existingCompany) {
      return NextResponse.json(
        { message: "رقم السجل التجاري أو الرقم الضريبي مسجّل مسبقاً" },
        { status: 409 }
      )
    }

    // Check if user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "هذا البريد الإلكتروني مسجّل مسبقاً" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    // Create company + owner in one transaction
    const company = await prisma.company.create({
      data: {
        crNumber: data.crNumber,
        vatNumber: data.vatNumber,
        nameAr: data.nameAr,
        phone: data.phone,
        email: data.companyEmail,
        users: {
          create: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            passwordHash,
            role: "OWNER",
          },
        },
      },
    })

    return NextResponse.json({ success: true, companyId: company.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "بيانات غير صحيحة", errors: error.errors }, { status: 400 })
    }
    console.error("Register error:", error)
    return NextResponse.json({ message: "حدث خطأ داخلي" }, { status: 500 })
  }
}
