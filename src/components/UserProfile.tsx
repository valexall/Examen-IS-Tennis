import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { User, Mail, Calendar, MapPin, Shield } from "lucide-react";
import { useAuth } from "./AuthContext";

export function UserProfile() {
  const { currentUser, getUserReservations } = useAuth();
  const userReservations = getUserReservations(currentUser!.id);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil de Usuario
          </CardTitle>
          <CardDescription>Información de tu cuenta de socio</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-500 flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre Completo
              </Label>
              <p className="text-lg">{currentUser!.name}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <p className="text-lg">{currentUser!.email}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Edad
              </Label>
              <p className="text-lg">{currentUser!.age} años</p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Domicilio
              </Label>
              <p className="text-lg">{currentUser!.address}</p>
            </div>
          </div>

          <div className="pt-4 border-t-2">
            <div className="space-y-2">
              <Label className="text-gray-500 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Estado de la Cuenta
              </Label>
              <div className="flex gap-2">
                <Badge
                  variant={currentUser!.isBlocked ? "destructive" : "default"}
                  className={currentUser!.isBlocked ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  {currentUser!.isBlocked ? "Bloqueada" : "Activa"}
                </Badge>
                <Badge variant="outline">ID: {currentUser!.id}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg">Estadísticas</CardTitle>
          <CardDescription>Resumen de tu actividad en el club</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-600 text-sm mb-1">Turnos Reservados</p>
              <p className="text-green-800 text-3xl">{userReservations.length}</p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-600 text-sm mb-1">Próximos Turnos</p>
              <p className="text-blue-800 text-3xl">
                {userReservations.filter((r) => r.date >= new Date()).length}
              </p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
              <p className="text-purple-600 text-sm mb-1">Turnos Completados</p>
              <p className="text-purple-800 text-3xl">
                {userReservations.filter((r) => r.date < new Date()).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
