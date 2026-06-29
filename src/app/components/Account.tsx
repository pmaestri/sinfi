import { useEffect, useState } from 'react';
import { ArrowLeft, Lock, LogOut, Moon, Pencil, Save, Sun, User } from 'lucide-react';
import { toast } from 'sonner';

interface AccountProps {
  userName: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
  onLogout: () => void;
  onUpdateName: (name: string) => void;
}

export function Account({ userName, isDarkMode, onToggleDarkMode, onBack, onLogout, onUpdateName }: AccountProps) {
  const [name, setName] = useState(userName);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const savedName = userName.trim();
  const trimmedName = name.trim();
  const hasProfileChanges = Boolean(trimmedName) && trimmedName !== savedName;

  useEffect(() => {
    setName(userName);
  }, [userName]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasProfileChanges) return;

    onUpdateName(trimmedName);
    toast.success('Perfil actualizado', {
      description: 'Guardamos los cambios de tu cuenta.',
      duration: 2500,
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !repeatPassword) return;

    if (newPassword !== repeatPassword) {
      toast.error('Las contraseñas no coinciden', {
        duration: 2500,
      });
      return;
    }

    toast.success('Contraseña actualizada', {
      description: 'Vas a usarla en tu próximo ingreso.',
      duration: 2500,
    });
    setCurrentPassword('');
    setNewPassword('');
    setRepeatPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <div className="bg-emerald-600 text-white p-6 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Mi cuenta</h1>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-emerald-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="bg-emerald-50 text-sky-900 w-12 h-12 rounded-full flex items-center justify-center">
                {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900 text-lg">Modo oscuro</h2>
                <p className="text-sm text-gray-600 font-medium">Aplicar tema oscuro en toda la app.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition-colors ${
                isDarkMode ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              aria-pressed={isDarkMode}
              aria-label="Cambiar modo oscuro"
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="bg-white rounded-xl p-6 shadow-md border-2 border-emerald-100 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="bg-emerald-50 text-sky-900 w-12 h-12 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-lg">Editar perfil</h2>
              <p className="text-sm text-gray-600 font-medium">Actualizá tus datos personales.</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <Pencil className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Nombre o email</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={!hasProfileChanges}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            <Save className="w-5 h-5" />
            Guardar perfil
          </button>
        </form>

        <form onSubmit={handleChangePassword} className="bg-white rounded-xl p-6 shadow-md border-2 border-emerald-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-sky-900 w-12 h-12 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Cambiar contraseña</h2>
              <p className="text-sm text-gray-600 font-medium">Confirmá tu contraseña actual y elegí una nueva.</p>
            </div>
          </div>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Contraseña actual"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
          />
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="Repetir nueva contraseña"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
          />

          <button
            type="submit"
            disabled={!currentPassword || !newPassword || !repeatPassword}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            <Lock className="w-5 h-5" />
            Cambiar contraseña
          </button>
        </form>

        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
