import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminLangProvider } from "@/components/admin/admin-lang"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLangProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="lg:ml-72">{children}</div>
      </div>
    </AdminLangProvider>
  )
}
