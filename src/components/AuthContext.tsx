import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  address: string;
  password: string;
  isBlocked: boolean;
  failedAttempts: number;
}

interface Reservation {
  id: string;
  userId: string;
  date: Date;
  court: string;
  timeSlot: string;
  courtName: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  reservations: Reservation[];
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  register: (userData: Omit<User, "id" | "password" | "isBlocked" | "failedAttempts">) => {
    success: boolean;
    message: string;
    password?: string;
  };
  addReservation: (reservation: Omit<Reservation, "id">) => void;
  getUserReservations: (userId: string) => Reservation[];
  cancelReservation: (reservationId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Juan Pérez",
      email: "juan@email.com",
      age: 25,
      address: "Calle Principal 456",
      password: "password123",
      isBlocked: false,
      failedAttempts: 0,
    },
  ]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const login = (email: string, password: string) => {
    const user = users.find((u) => u.email === email);

    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    if (user.isBlocked) {
      return {
        success: false,
        message: "CUENTA BLOQUEADA. Has fallado 3 intentos consecutivos. Por seguridad, tu cuenta ha sido bloqueada. Contacte al administrador.",
      };
    }

    if (user.password !== password) {
      const updatedUsers = users.map((u) => {
        if (u.email === email) {
          const newFailedAttempts = u.failedAttempts + 1;
          return {
            ...u,
            failedAttempts: newFailedAttempts,
            isBlocked: newFailedAttempts >= 3,
          };
        }
        return u;
      });
      setUsers(updatedUsers);

      const updatedUser = updatedUsers.find((u) => u.email === email);
      if (updatedUser && updatedUser.isBlocked) {
        return {
          success: false,
          message: "CUENTA BLOQUEADA. Has fallado 3 intentos consecutivos. Por seguridad, tu cuenta ha sido bloqueada. Contacte al administrador.",
        };
      }

      return {
        success: false,
        message: `Contraseña incorrecta. Intentos fallidos: ${updatedUser?.failedAttempts}/3`,
      };
    }

    // Reset failed attempts on successful login
    const updatedUsers = users.map((u) => {
      if (u.email === email) {
        return { ...u, failedAttempts: 0 };
      }
      return u;
    });
    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find((u) => u.email === email) || null);

    return { success: true, message: "Inicio de sesión exitoso" };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (userData: Omit<User, "id" | "password" | "isBlocked" | "failedAttempts">) => {
    // Check if email already exists
    if (users.find((u) => u.email === userData.email)) {
      return { success: false, message: "Este email ya está registrado" };
    }

    // Validate age requirement
    if (userData.age < 18) {
      return { success: false, message: "Debes tener al menos 18 años para registrarte" };
    }

    // Generate automatic password
    const generatedPassword = `Tennis${Math.floor(Math.random() * 10000)}!`;

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      password: generatedPassword,
      isBlocked: false,
      failedAttempts: 0,
    };

    setUsers([...users, newUser]);

    return {
      success: true,
      message: `Registro exitoso. Tu contraseña automática es: ${generatedPassword}. Se ha enviado a tu correo ${userData.email}`,
      password: generatedPassword,
    };
  };

  const addReservation = (reservation: Omit<Reservation, "id">) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
    };
    setReservations([...reservations, newReservation]);
  };

  const getUserReservations = (userId: string) => {
    return reservations.filter((r) => r.userId === userId);
  };

  const cancelReservation = (reservationId: string) => {
    setReservations(reservations.filter((r) => r.id !== reservationId));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        users,
        reservations,
        login,
        logout,
        register,
        addReservation,
        getUserReservations,
        cancelReservation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
