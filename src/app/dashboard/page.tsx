import { createClient } from "@/lib/server"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Activity, TrendingUp, Shield } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const stats = [
    {
      title: "Usuarios Activos",
      value: "2,543",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Actividad Diaria",
      value: "1,234",
      change: "+8%",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Crecimiento",
      value: "23.5%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Seguridad",
      value: "99.9%",
      change: "Estable",
      icon: Shield,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <Badge variant="secondary">Bienvenido, {user?.user_metadata?.full_name || user?.email}</Badge>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Principal</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">En vivo</Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change} desde el mes pasado</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Resumen de Actividad</CardTitle>
              <CardDescription>Vista general de la actividad reciente en tu aplicación</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevos usuarios registrados</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                  <Badge variant="secondary">+15</Badge>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sistema actualizado</p>
                    <p className="text-xs text-muted-foreground">Hace 4 horas</p>
                  </div>
                  <Badge variant="outline">Completado</Badge>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Backup programado</p>
                    <p className="text-xs text-muted-foreground">Hace 6 horas</p>
                  </div>
                  <Badge variant="secondary">Automático</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Información de Sesión</CardTitle>
              <CardDescription>Detalles de tu sesión actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Último acceso</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user?.last_sign_in_at || "").toLocaleString("es-ES")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">ID de usuario</p>
                  <p className="text-xs text-muted-foreground font-mono">{user?.id.substring(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estado de verificación</p>
                  <Badge variant={user?.email_confirmed_at ? "default" : "secondary"}>
                    {user?.email_confirmed_at ? "Verificado" : "Pendiente"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
