import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Calendar as CalendarIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "./AuthContext";

const courts = [
  { id: "cancha1", name: "Cancha 1 (Arcilla)", surface: "Arcilla" },
  { id: "cancha2", name: "Cancha 2 (Césped)", surface: "Césped" },
  { id: "cancha3", name: "Cancha 3 (Dura)", surface: "Dura" },
  { id: "cancha4", name: "Cancha 4 (Arcilla)", surface: "Arcilla" },
];

const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
];

export function ReservationSystem() {
  const [date, setDate] = useState<Date>();
  const [court, setCourt] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [validationMessage, setValidationMessage] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const { currentUser, addReservation } = useAuth();

  const handleReservation = () => {
    setValidationMessage(null);

    if (!date || !court || !timeSlot) {
      setValidationMessage({
        type: "error",
        message: "Por favor, completa todos los campos (fecha, cancha y horario)",
      });
      return;
    }

    // Validate: minimum 2 days in advance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < twoDaysFromNow) {
      setValidationMessage({
        type: "error",
        message:
          "Error: El sistema no permite dar turno con menos de 2 días a la fecha solicitada. Por favor, selecciona una fecha con al menos 2 días de anticipación.",
      });
      return;
    }

    // Add reservation
    const courtName = courts.find((c) => c.id === court)?.name || court;
    addReservation({
      userId: currentUser!.id,
      date: selectedDate,
      court,
      courtName,
      timeSlot,
    });

    setValidationMessage({
      type: "success",
      message: `Su turno ha sido registrado con éxito. Disfrute su juego en ${courtName} el ${format(selectedDate, "dd/MM/yyyy", { locale: es })} de ${timeSlot}.`,
    });

    // Clear form
    setDate(undefined);
    setCourt("");
    setTimeSlot("");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Sistema de Reservas de Turnos
          </CardTitle>
          <CardDescription>
            Selecciona fecha, cancha y horario para tu próximo partido
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Reserva</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-11"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Cancha</Label>
              <Select value={court} onValueChange={setCourt}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Seleccionar cancha" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Horario</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Seleccionar horario" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleReservation}
            className="w-full h-12 bg-green-600 hover:bg-green-700"
          >
            SOLICITAR TURNO
          </Button>
        </CardContent>
      </Card>

      {/* Validation Message */}
      {validationMessage && (
        <Alert
          variant={validationMessage.type === "error" ? "destructive" : "default"}
          className={`shadow-lg border-2 ${
            validationMessage.type === "success"
              ? "bg-green-50 border-green-300 text-green-900"
              : ""
          }`}
        >
          {validationMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <AlertTitle>
            {validationMessage.type === "success" ? "Turno Confirmado" : "Error en la Reserva"}
          </AlertTitle>
          <AlertDescription>{validationMessage.message}</AlertDescription>
        </Alert>
      )}

      {/* Validation Scenarios Info */}
      <Card className="border-2">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg">Validaciones del Sistema</CardTitle>
          <CardDescription>
            Escenarios de validación implementados en el sistema de reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Escenario 1 (Error Fecha):
              </h3>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  "Error: El sistema no permite dar turno con menos de 2 días a la fecha
                  solicitada."
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Escenario 2 (Éxito):
              </h3>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  "Su turno ha sido registrado con éxito. Disfrute su juego."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
