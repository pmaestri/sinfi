import { useState } from "react";
import { ArrowLeft, Lock, Mail, MailCheck, MessageSquare, UserPlus } from "lucide-react";
import { toast } from "sonner";
import sinfiLogo from "../../assets/sinfi-logo-transparent.png";

interface LoginProps {
  onLogin: (name: string) => void;
  onFeedback: () => void;
}

export function Login({ onLogin, onFeedback }: LoginProps) {
  const [mode, setMode] = useState<"login" | "recover" | "register" | "verify">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerUser, setRegisterUser] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [recoverUser, setRecoverUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(username || "Usuario");
    }, 1000);
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Te enviamos las instrucciones", {
        description: `${recoverUser}@uade.edu.ar`,
        duration: 2500,
      });
      setIsLoading(false);
      setMode("login");
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setUsername(registerUser);
      setPassword(registerPassword);
      setIsLoading(false);
      setMode("verify");
    }, 1000);
  };

  const resetMode = () => {
    setIsLoading(false);
    setMode("login");
  };

  const handleBackToLogin = () => {
    setIsLoading(false);
    setMode("login");
  };

  const title = mode === "login"
    ? "Bienvenido a SinFi"
    : mode === "recover"
      ? "Recuperar contraseña"
      : mode === "register"
        ? "Crear cuenta"
        : "Verificá tu cuenta";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white text-gray-900 p-6 text-center shadow-md relative">
        <button
          onClick={onFeedback}
          className="absolute right-6 top-6 bg-emerald-50 p-2 rounded-full text-emerald-700 hover:bg-emerald-100 transition-colors"
          aria-label="Dejar comentario"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <img src={sinfiLogo} alt="SinFi" className="h-24 w-24 object-contain drop-shadow-lg" />
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex-1 p-6">
        {mode === "login" && (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto space-y-6 pt-8"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email UADE
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="usuario"
                  className="w-full pl-10 pr-32 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  @uade.edu.ar
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Solo ingresá tu usuario, nosotros agregamos
                @uade.edu.ar
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="contraseña"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setMode("recover")}
                className="text-sm text-emerald-700 font-semibold hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
              <p className="text-sm text-gray-700">
                ¿No tenés cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Registrate
                </button>
              </p>
            </div>
          </form>
        )}

        {mode === "recover" && (
          <form onSubmit={handleRecover} className="max-w-md mx-auto space-y-6 pt-8">
            <button
              type="button"
              onClick={resetMode}
              className="flex items-center gap-2 text-emerald-700 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al login
            </button>

            <div className="bg-white rounded-xl p-5 border-2 border-emerald-100 shadow-md space-y-4">
              <p className="text-gray-700 font-medium">
                Ingresá tu usuario UADE y te enviaremos instrucciones para cambiar tu contraseña.
              </p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={recoverUser}
                  onChange={(e) => setRecoverUser(e.target.value)}
                  placeholder="usuario"
                  className="w-full pl-10 pr-32 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  @uade.edu.ar
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:bg-emerald-300 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-5 pt-8">
            <button
              type="button"
              onClick={resetMode}
              className="flex items-center gap-2 text-emerald-700 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al login
            </button>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nombre completo</label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email UADE</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={registerUser}
                  onChange={(e) => setRegisterUser(e.target.value)}
                  placeholder="usuario"
                  className="w-full pl-10 pr-32 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  @uade.edu.ar
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="contraseña"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:bg-emerald-300 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        )}

        {mode === "verify" && (
          <div className="max-w-md mx-auto pt-8">
            <div className="bg-white rounded-xl p-6 border-2 border-emerald-100 shadow-md text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-sky-900 flex items-center justify-center">
                <MailCheck className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">Gracias por registrarte</h2>
                <p className="text-gray-600 font-medium">
                  Te enviamos un mail a <span className="font-bold text-gray-800">{registerUser}@uade.edu.ar</span> para confirmar tu usuario y verificar tu cuenta.
                </p>
              </div>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-md"
              >
                Ir al login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
