import { useEffect, useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { formatMenuText } from '../utils/menuText';

interface CartItem {
  id: number;
  cartKey?: string;
  name: string;
  venue: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  imageUrl: string;
  waitTimeMinutes: number;
  selectedFlavor?: string;
}

const MAX_WAIT_TIME_MINUTES = 30;

const getWaitTimeBarColor = (waitTimeMinutes: number) => {
  if (waitTimeMinutes <= 10) {
    return 'bg-green-500';
  }

  if (waitTimeMinutes <= 20) {
    return 'bg-yellow-400';
  }

  return 'bg-red-500';
};

interface CartProps {
  items: CartItem[];
  onBack: () => void;
  onCheckout: () => void;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

export function Cart({ items, onBack, onCheckout, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) {
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!isClearCartModalOpen) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isClearCartModalOpen]);

  return (
    <div className={`min-h-screen bg-amber-50 flex flex-col ${items.length === 0 ? 'pb-24' : 'pb-36'}`}>
      <div className="bg-yellow-800 text-white p-6 shadow-md">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Tu Pedido</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-8">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500">Agregá productos para comenzar tu pedido</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl mx-auto">
            {items.map((item) => (
	              <div key={item.cartKey ?? item.id} className="relative bg-white rounded-xl p-4 pr-12 shadow-md border-2 border-amber-100">
	                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-amber-100 border-2 border-amber-100 shadow-sm">
                    <img
                      src={item.imageUrl}
                      alt={formatMenuText(item.name)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center px-2 text-center text-xs font-bold text-yellow-900">
                      Sin foto
                    </div>
                  </div>
	                  <div className="min-w-0 flex-1">
	                    <h3 className="line-clamp-2 break-words font-bold leading-tight text-gray-900">{formatMenuText(item.name)}</h3>
                    {item.selectedFlavor && (
                      <p className="mt-1 text-sm font-bold text-gray-600">Opción: {formatMenuText(item.selectedFlavor)}</p>
                    )}
                    <p className="text-xl font-bold text-yellow-900">${item.price}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span>Tiempo estimado</span>
                        <span>{item.waitTimeMinutes} min</span>
                      </div>
                      <div className="h-2 rounded-full bg-amber-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getWaitTimeBarColor(item.waitTimeMinutes)}`}
                          style={{ width: `${(item.waitTimeMinutes / MAX_WAIT_TIME_MINUTES) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-400">
                        <span>0'</span>
                        <span>30'</span>
                      </div>
                    </div>
                  </div>
	                  <button
	                    onClick={() => onRemoveItem(item.cartKey ?? String(item.id))}
	                    className="absolute right-2 top-3 text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
	                    aria-label={`Eliminar ${formatMenuText(item.name)}`}
	                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 bg-amber-100 rounded-full p-1 border-2 border-amber-200">
                    <button
                      onClick={() => onUpdateQuantity(item.cartKey ?? String(item.id), -1)}
                      className="bg-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-yellow-800 hover:text-white transition-colors border border-amber-200 font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold w-8 text-center text-yellow-900">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.cartKey ?? String(item.id), 1)}
                      className="bg-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-yellow-800 hover:text-white transition-colors border border-amber-200 font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-bold text-yellow-900 text-lg">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <>
          <div className="fixed inset-x-0 bottom-[74px] z-40 px-4 pb-2">
            <div className="mx-auto flex max-w-2xl justify-center">
              <button
                type="button"
                onClick={() => setIsClearCartModalOpen(true)}
                className="rounded-xl border-2 border-red-200 bg-white px-4 py-2 text-sm font-extrabold text-red-600 shadow-sm transition-colors hover:bg-red-50"
              >
                Limpiar carrito
              </button>
            </div>
          </div>
          <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-yellow-800 bg-white/96 px-4 py-3 shadow-[0_-10px_30px_rgba(92,53,0,0.16)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold uppercase tracking-[0.14em] text-gray-500">Total</span>
              <span className="block truncate text-2xl font-extrabold text-yellow-900">${total.toLocaleString()}</span>
            </div>
            <button
              onClick={onCheckout}
              className="shrink-0 rounded-xl bg-yellow-800 px-5 py-3 text-sm font-extrabold text-white shadow-md transition-colors hover:bg-yellow-900 active:scale-95"
            >
              Confirmar
            </button>
          </div>
        </div>
        {isClearCartModalOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-5 backdrop-blur-[2px]"
            onClick={() => setIsClearCartModalOpen(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl border-2 border-red-100 bg-white p-5 text-center shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">Limpiar carrito</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">
                Se van a eliminar todos los productos de tu pedido actual.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsClearCartModalOpen(false)}
                  className="rounded-xl border-2 border-amber-200 bg-white px-4 py-3 text-sm font-extrabold text-yellow-900 transition-colors hover:bg-amber-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearCart();
                    setIsClearCartModalOpen(false);
                  }}
                  className="rounded-xl bg-red-600 px-4 py-3 text-sm font-extrabold text-white shadow-md transition-colors hover:bg-red-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
}
