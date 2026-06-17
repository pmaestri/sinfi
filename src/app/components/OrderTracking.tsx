import { useState, useEffect } from 'react';
import { Check, Clock, ChefHat, Package, Home, ReceiptText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderItem {
  id: number;
  cartKey?: string;
  name: string;
  venue: string;
  price: number;
  quantity: number;
  selectedFlavor?: string;
}

interface OrderTrackingProps {
  orderNumber: string;
  total: number;
  items: OrderItem[];
  onNewOrder: () => void;
}

type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'arrived' | 'completed';

export function OrderTracking({ orderNumber, total, items, onNewOrder }: OrderTrackingProps) {
  const [status, setStatus] = useState<OrderStatus>('confirmed');
  const [hasArrived, setHasArrived] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('preparing'), 2000);
    const timer2 = setTimeout(() => setStatus('ready'), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (status === 'completed') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#713f12', '#92400e', '#b45309', '#d97706'],
      });
    }
  }, [status]);

  const handleArrived = () => {
    setHasArrived(true);
    setStatus('arrived');
    setTimeout(() => setStatus('completed'), 3000);
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'confirmed':
        return {
          title: 'Pedido Confirmado',
          description: 'Estamos recibiendo tu pedido',
          icon: <Check className="w-8 h-8" />,
          color: 'bg-blue-600',
        };
      case 'preparing':
        return {
          title: 'En Preparación',
          description: 'Estamos preparando tu pedido',
          icon: <ChefHat className="w-8 h-8" />,
          color: 'bg-yellow-800',
        };
      case 'ready':
        return {
          title: 'Tu pedido te está esperando',
          description: 'Pasá a retirarlo por el buffet',
          icon: <Package className="w-8 h-8" />,
          color: 'bg-green-600',
        };
      case 'arrived':
        return {
          title: 'Avisamos que Llegaste',
          description: 'Estamos preparando tu entrega',
          icon: <Clock className="w-8 h-8" />,
          color: 'bg-purple-600',
        };
      case 'completed':
        return {
          title: '¡Pedido Entregado!',
          description: 'Que lo disfrutes',
          icon: <Check className="w-8 h-8" />,
          color: 'bg-green-600',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <div className="bg-yellow-800 text-white p-6 text-center shadow-md">
        <h1 className="text-2xl font-bold mb-2">Seguimiento del Pedido</h1>
        <p className="text-sm opacity-90">Pedido #{orderNumber}</p>
      </div>

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center border-2 border-amber-100">
          <div className={`${statusInfo.color} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-md`}>
            {statusInfo.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{statusInfo.title}</h2>
          <p className="text-gray-700 font-medium">{statusInfo.description}</p>
        </div>

        {status === 'ready' && !hasArrived && (
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100">
            <button
              type="button"
              onClick={() => setShowOrderDetail((currentValue) => !currentValue)}
              className="flex w-full items-center justify-between gap-4 rounded-xl bg-green-50 px-4 py-4 text-left transition-colors hover:bg-green-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Detalle del pedido</p>
                  <p className="text-sm font-medium text-gray-600">
                    {showOrderDetail ? 'Ocultar productos' : 'Ver productos incluidos'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-700">
                {showOrderDetail ? 'Ocultar' : 'Ver'}
              </span>
            </button>

            {showOrderDetail && (
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.cartKey ?? item.id}
                    className="flex items-start justify-between gap-4 rounded-xl border-2 border-amber-100 bg-amber-50/60 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-bold leading-tight text-gray-900">{item.name}</p>
                      {item.selectedFlavor && (
                        <p className="mt-1 text-sm font-bold text-gray-600">
                          Gusto: {item.selectedFlavor}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-medium text-gray-600">
                        {item.venue} · Cantidad: {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 font-bold text-yellow-900">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-amber-100">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 text-lg">Total Pagado</span>
            <span className="text-2xl font-bold text-yellow-900">${total.toLocaleString()}</span>
          </div>
        </div>

        {status === 'ready' && !hasArrived && (
          <button
            onClick={handleArrived}
            className="w-full bg-yellow-800 text-white py-4 rounded-xl font-bold hover:bg-yellow-900 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <Home className="w-6 h-6" />
            Ya Llegué al Buffet
          </button>
        )}

        {status === 'arrived' && (
          <div className="bg-purple-50 border-2 border-purple-400 rounded-xl p-4 flex items-center justify-center gap-2 shadow-md">
            <div className="w-5 h-5 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-purple-800 font-bold">Avisando al personal...</span>
          </div>
        )}

        {status === 'completed' && (
          <button
            onClick={onNewOrder}
            className="w-full bg-yellow-800 text-white py-4 rounded-xl font-bold hover:bg-yellow-900 transition-colors shadow-lg"
          >
            Hacer Nuevo Pedido
          </button>
        )}
      </div>
    </div>
  );
}
