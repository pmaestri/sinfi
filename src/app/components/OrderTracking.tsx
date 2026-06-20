import { useState, useEffect, useMemo } from 'react';
import { Check, Clock, ChefHat, Package, Home, ReceiptText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatMenuText } from '../utils/menuText';

interface OrderItem {
  id: number;
  cartKey?: string;
  name: string;
  venue: string;
  price: number;
  quantity: number;
  waitTimeMinutes: number;
  selectedFlavor?: string;
}

interface OrderTrackingProps {
  orderNumber: string;
  total: number;
  items: OrderItem[];
  onNewOrder: () => void;
}

type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'arrived' | 'completed';

interface VenueEstimate {
  venue: string;
  itemCount: number;
  estimatedWaitMinutes: number;
}

export function OrderTracking({ orderNumber, total, items, onNewOrder }: OrderTrackingProps) {
  const [status, setStatus] = useState<OrderStatus>('confirmed');
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [readyVenues, setReadyVenues] = useState<string[]>([]);
  const [arrivedVenues, setArrivedVenues] = useState<string[]>([]);
  const [completedVenues, setCompletedVenues] = useState<string[]>([]);
  const venueEstimates = useMemo(
    () => Array.from(
      items.reduce<Map<string, OrderItem[]>>((groups, item) => {
        const venueItems = groups.get(item.venue) ?? [];
        venueItems.push(item);
        groups.set(item.venue, venueItems);

        return groups;
      }, new Map()),
      ([venue, venueItems]): VenueEstimate => {
        const itemCount = venueItems.reduce((sum, item) => sum + item.quantity, 0);
        const slowestWaitMinutes = Math.max(
          ...venueItems.map((item) => item.waitTimeMinutes),
        );
        const adjustedBaseWaitMinutes = Math.round(slowestWaitMinutes * 1.5);
        const quantityBufferMinutes = Math.max(0, Math.ceil((itemCount - 1) / 2) * 2);

        return {
          venue,
          itemCount,
          estimatedWaitMinutes: Math.max(2, adjustedBaseWaitMinutes + quantityBufferMinutes),
        };
      },
    ),
    [items],
  );
  const hasMultipleVenues = venueEstimates.length > 1;
  const allVenuesReady =
    venueEstimates.length > 0 &&
    venueEstimates.every((venueEstimate) => readyVenues.includes(venueEstimate.venue));
  const allVenuesCompleted =
    venueEstimates.length > 0 &&
    venueEstimates.every((venueEstimate) => completedVenues.includes(venueEstimate.venue));
  const estimatedWaitMinutes = Math.max(
    1,
    ...venueEstimates.map((venueEstimate) => venueEstimate.estimatedWaitMinutes),
  );
  const progressByStatus: Record<OrderStatus, number> = {
    confirmed: 22,
    preparing: 64,
    ready: 100,
    arrived: 100,
    completed: 100,
  };
  const venueProgressPercent = venueEstimates.length
    ? Math.round((readyVenues.length / venueEstimates.length) * 100)
    : 0;
  const progressPercent = hasMultipleVenues
    ? Math.max(status === 'confirmed' ? 22 : 35, venueProgressPercent)
    : progressByStatus[status];

  useEffect(() => {
    const readyTimers = venueEstimates.map((venueEstimate) => {
      const readyDelayMs = Math.min(
        Math.max(venueEstimate.estimatedWaitMinutes * 450, 3500),
        9000,
      );

      return setTimeout(() => {
        setReadyVenues((currentReadyVenues) =>
          currentReadyVenues.includes(venueEstimate.venue)
            ? currentReadyVenues
            : [...currentReadyVenues, venueEstimate.venue],
        );
      }, readyDelayMs);
    });
    const preparingDelayMs = 1500;
    const timer1 = setTimeout(() => setStatus('preparing'), preparingDelayMs);

    return () => {
      clearTimeout(timer1);
      readyTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [venueEstimates]);

  useEffect(() => {
    if (allVenuesCompleted) {
      setStatus('completed');
      return;
    }

    if (arrivedVenues.length > completedVenues.length) {
      setStatus('arrived');
      return;
    }

    if (allVenuesReady) {
      setStatus('ready');
      return;
    }

    if (readyVenues.length > 0) {
      setStatus('preparing');
    }
  }, [
    allVenuesCompleted,
    allVenuesReady,
    arrivedVenues.length,
    completedVenues.length,
    readyVenues.length,
  ]);

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

  const handleArrived = (venue: string) => {
    setArrivedVenues((currentArrivedVenues) =>
      currentArrivedVenues.includes(venue)
        ? currentArrivedVenues
        : [...currentArrivedVenues, venue],
    );
    setStatus('arrived');
    setTimeout(() => {
      setCompletedVenues((currentCompletedVenues) =>
        currentCompletedVenues.includes(venue)
          ? currentCompletedVenues
          : [...currentCompletedVenues, venue],
      );
    }, 3000);
  };

  const getVenueStatusText = (venue: string) => {
    if (completedVenues.includes(venue)) {
      return 'Retirado';
    }

    if (arrivedVenues.includes(venue)) {
      return 'Avisando al personal';
    }

    if (readyVenues.includes(venue)) {
      return 'Listo para retirar';
    }

    return 'En preparación';
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
      </div>

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center border-2 border-amber-100">
          <div className="mx-auto mb-5 inline-flex flex-col items-center rounded-2xl bg-amber-100 px-6 py-3 text-yellow-900 shadow-sm">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow-900/70">
              Número de pedido
            </span>
            <span className="mt-1 text-3xl font-black tracking-[0.1em]">
              #{orderNumber}
            </span>
          </div>
          <div className={`${statusInfo.color} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-md`}>
            {statusInfo.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{statusInfo.title}</h2>
          <p className="text-gray-700 font-medium">{statusInfo.description}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-amber-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Tiempo estimado
              </p>
              <p className="mt-1 text-3xl font-bold text-yellow-900">
                {estimatedWaitMinutes} min
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-yellow-900">
              {progressPercent}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-amber-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-700">
            {status === 'ready' || status === 'arrived' || status === 'completed'
              ? hasMultipleVenues
                ? 'Podés retirar cada punto de compra cuando figure listo.'
                : 'Tu pedido ya debería estar listo para retirar.'
              : venueEstimates.length > 1
                ? 'Calculado por punto de compra. El tiempo total usa el local que más demora.'
                : 'Calculado según los productos y cantidades seleccionadas.'}
          </p>

          {hasMultipleVenues && (
            <div className="mt-4 space-y-2">
              {venueEstimates.map((venueEstimate) => (
                <div
                  key={venueEstimate.venue}
                  className="rounded-lg bg-amber-50 px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {venueEstimate.venue}
                      </p>
                      <p className="text-xs font-medium text-gray-500">
                        Pedido #{orderNumber} · {venueEstimate.itemCount} producto{venueEstimate.itemCount === 1 ? '' : 's'} · {getVenueStatusText(venueEstimate.venue)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-yellow-900">
                      {venueEstimate.estimatedWaitMinutes} min
                    </span>
                  </div>

                  {readyVenues.includes(venueEstimate.venue) &&
                    !arrivedVenues.includes(venueEstimate.venue) &&
                    !completedVenues.includes(venueEstimate.venue) && (
                      <button
                        type="button"
                        onClick={() => handleArrived(venueEstimate.venue)}
                        className="mt-3 w-full rounded-lg bg-yellow-800 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-yellow-900"
                      >
                        Ya llegué
                      </button>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        {status === 'ready' && !hasMultipleVenues && (
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
                    Pedido #{orderNumber} · {showOrderDetail ? 'Ocultar productos' : 'Ver productos incluidos'}
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
                      <p className="font-bold leading-tight text-gray-900">{formatMenuText(item.name)}</p>
                      {item.selectedFlavor && (
                        <p className="mt-1 text-sm font-bold text-gray-600">
                          Opción: {formatMenuText(item.selectedFlavor)}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-medium text-gray-600">
                        {item.venue} · Cantidad: {item.quantity}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-gray-500">
                        Tiempo base: {item.waitTimeMinutes} min
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

        {status === 'ready' && !hasMultipleVenues && venueEstimates[0] && (
          <button
            onClick={() => handleArrived(venueEstimates[0].venue)}
            className="w-full bg-yellow-800 text-white py-4 rounded-xl font-bold hover:bg-yellow-900 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <Home className="w-6 h-6" />
            Ya llegué
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
