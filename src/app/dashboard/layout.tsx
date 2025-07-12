import type React from "react"
import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  )
}
