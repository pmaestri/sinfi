import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

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
}

export function Cart({ items, onBack, onCheckout, onUpdateQuantity, onRemoveItem }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`min-h-screen bg-amber-50 flex flex-col ${items.length === 0 ? 'pb-24' : ''}`}>
      <div className="bg-yellow-800 text-white p-6 shadow-md">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Tu Pedido</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500">Agregá productos para comenzar tu pedido</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl mx-auto">
            {items.map((item) => (
              <div key={item.cartKey ?? item.id} className="bg-white rounded-xl p-4 shadow-md border-2 border-amber-100">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-amber-100 border-2 border-amber-100 shadow-sm">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
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
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    {item.selectedFlavor && (
                      <p className="mt-1 text-sm font-bold text-gray-600">Gusto: {item.selectedFlavor}</p>
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
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
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
        <div className="bg-white border-t-4 border-yellow-800 p-6 space-y-4 shadow-lg">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-3xl font-bold text-yellow-900">${total.toLocaleString()}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full max-w-2xl mx-auto block bg-yellow-800 text-white py-4 rounded-xl font-bold hover:bg-yellow-900 transition-colors shadow-md"
          >
            Confirmar Pedido
          </button>
        </div>
      )}
    </div>
  );
}
