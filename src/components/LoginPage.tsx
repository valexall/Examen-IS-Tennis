import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, LogIn, Trophy } from "lucide-react";
import { useAuth } from "./AuthContext";

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState("juan@email.com");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos");
      return;
    }

    const result = login(email, password);
    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-4 rounded-full">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-green-800">Club de Tenis</h1>
          <p className="text-gray-600">Sistema de Gestión de Socios y Reservas</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-2">
          <CardHeader className="space-y-1 bg-gradient-to-r from-green-50 to-emerald-50 border-b-2">
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Acceso al Sistema
            </CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (Usuario):</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="ejemplo@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña:</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <Button className="w-full h-11 bg-green-600 hover:bg-green-700" onClick={handleLogin}>
              INICIAR SESIÓN
            </Button>

            <div className="text-center pt-2">
              <button
                onClick={onSwitchToRegister}
                className="text-green-600 hover:text-green-700 hover:underline"
              >
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive" className="shadow-lg border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>
              {errorMessage.includes("BLOQUEADA") ? "CUENTA BLOQUEADA" : "Error de Acceso"}
            </AlertTitle>
            <AlertDescription className="whitespace-pre-line">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Demo Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-blue-800 text-sm">
              <strong>Usuario de prueba:</strong>
              <br />
              Email: juan@email.com
              <br />
              Contraseña: password123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
