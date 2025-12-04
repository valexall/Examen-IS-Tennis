import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { UserPlus, Info, CheckCircle2, ArrowLeft, Trophy } from "lucide-react";
import { useAuth } from "./AuthContext";

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(18);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const { register } = useAuth();

  const handleRegister = () => {
    if (!name || !email || !address) {
      setMessage({ type: "error", text: "Por favor, completa todos los campos" });
      return;
    }

    if (age < 18) {
      setMessage({
        type: "error",
        text: "Debes tener al menos 18 años para registrarte como socio del club",
      });
      return;
    }

    const result = register({ name, email, age, address });

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      setGeneratedPassword(result.password || "");
      // Clear form
      setName("");
      setEmail("");
      setAge(18);
      setAddress("");
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  const incrementAge = () => setAge(age + 1);
  const decrementAge = () => setAge(age > 1 ? age - 1 : 1);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-4 rounded-full">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-green-800">Club de Tenis</h1>
          <p className="text-gray-600">Únete a nuestra comunidad deportiva</p>
        </div>

        {/* Register Card */}
        <Card className="shadow-xl border-2">
          <CardHeader className="space-y-1 bg-gradient-to-r from-green-50 to-emerald-50 border-b-2">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Registro de Nuevo Socio
            </CardTitle>
            <CardDescription>
              Completa el formulario para convertirte en socio del club
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Nombre y Apellido:</Label>
              <Input
                id="fullname"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setMessage(null);
                }}
                placeholder="Ej: Pedro Gomez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">Email (Será tu ID de usuario):</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage(null);
                }}
                placeholder="ejemplo@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-orange-700">
                Edad (Requisito mínimo: +18 años):
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setAge(value);
                    setMessage(null);
                  }}
                  className="w-28"
                  min="1"
                />
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={incrementAge}
                    className="h-7 px-3"
                  >
                    ▲
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decrementAge}
                    className="h-7 px-3"
                  >
                    ▼
                  </Button>
                </div>
                {age >= 18 && (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Cumple requisito
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Domicilio:</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setMessage(null);
                }}
                placeholder="Ej: Av. Principal 123"
              />
            </div>

            <Button
              className="w-full h-11 bg-green-600 hover:bg-green-700"
              onClick={handleRegister}
            >
              REGISTRARME COMO SOCIO
            </Button>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 shadow-sm">
              <div className="flex gap-3 items-start">
                <Info className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-900">
                    <strong>IMPORTANTE:</strong>
                    <br />
                    El sistema generará una contraseña automática y la enviará a tu correo
                    electrónico. Guárdala en un lugar seguro para acceder al sistema.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="ghost"
                onClick={onSwitchToLogin}
                className="w-full flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio de sesión
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {message && (
          <Alert
            variant={message.type === "error" ? "destructive" : "default"}
            className={`shadow-lg border-2 ${
              message.type === "success"
                ? "bg-green-50 border-green-300 text-green-900"
                : ""
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <AlertTitle>{message.type === "success" ? "Registro Exitoso" : "Error"}</AlertTitle>
            <AlertDescription className="whitespace-pre-line">{message.text}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
