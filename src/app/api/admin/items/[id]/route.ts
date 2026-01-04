import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ MUST await params in Next.js 16
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Missing item ID" },
        { status: 400 }
      )
    }

    // 1️⃣ Auth client (session only)
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 2️⃣ Admin client (DB writes)
    const admin = createAdminClient()

    // 3️⃣ Ensure user exists (SAFE ROLE)
    const { data: dbUser } = await admin
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single()

    if (!dbUser) {
      const { error } = await admin.from("users").insert({
        id: user.id,
        email: user.email,
        role: "user", // ✅ EXISTING ROLE ONLY
      })

      if (error) {
        console.error("User sync failed:", error)
        return NextResponse.json(
          { error: "Failed to sync user to database" },
          { status: 500 }
        )
      }
    }

    // 4️⃣ DELETE item (admin client bypasses RLS)
    const { error: deleteError } = await admin
      .from("items")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Delete failed:", deleteError)
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE route crash:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
