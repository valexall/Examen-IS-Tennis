import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  LogOut,
  Calendar,
  User,
  Trophy,
  Clock,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { ReservationSystem } from "./ReservationSystem";
import { MyReservations } from "./MyReservations";
import { UserProfile } from "./UserProfile";

export function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("reservations");

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b-2 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-green-800">Club de Tenis</h1>
                <p className="text-gray-600 text-sm">Sistema de Gestión - Usuario Logueado</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-600 text-sm">Bienvenido/a</p>
                <p className="text-green-800">{currentUser.name}</p>
              </div>
              <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-auto">
            <TabsTrigger value="reservations" className="flex items-center gap-2 py-3">
              <Calendar className="h-4 w-4" />
              <span>Nueva Reserva</span>
            </TabsTrigger>
            <TabsTrigger value="my-reservations" className="flex items-center gap-2 py-3">
              <Clock className="h-4 w-4" />
              <span>Mis Turnos</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
              <User className="h-4 w-4" />
              <span>Mi Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <ReservationSystem />
          </TabsContent>

          <TabsContent value="my-reservations">
            <MyReservations />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
