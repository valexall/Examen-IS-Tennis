import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export function MyReservations() {
  const { currentUser, getUserReservations, cancelReservation } = useAuth();
  const reservations = getUserReservations(currentUser!.id);

  // Sort by date
  const sortedReservations = [...reservations].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const handleCancel = (reservationId: string) => {
    cancelReservation(reservationId);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Mis Turnos Reservados
          </CardTitle>
          <CardDescription>
            Gestiona y visualiza todos tus turnos programados
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {sortedReservations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tienes turnos reservados</p>
              <p className="text-gray-400 text-sm mt-2">
                Ve a la pestaña "Nueva Reserva" para solicitar un turno
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedReservations.map((reservation) => {
                const isPast = reservation.date < new Date();
                return (
                  <Card key={reservation.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={isPast ? "secondary" : "default"}
                              className={
                                isPast
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-green-600 hover:bg-green-700"
                              }
                            >
                              {isPast ? "Finalizado" : "Próximo"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>{format(reservation.date, "dd/MM/yyyy", { locale: es })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>{reservation.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{reservation.courtName}</span>
                            </div>
                          </div>
                        </div>
                        {!isPast && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancelar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Cancelar turno?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  ¿Estás seguro de que deseas cancelar este turno? Esta acción no se
                                  puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>No, mantener turno</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancel(reservation.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Sí, cancelar turno
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
