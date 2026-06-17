import { useState } from 'react';
import { ArrowLeft, Calendar, CreditCard, LockKeyhole, Smartphone, User } from 'lucide-react';

interface CheckoutProps {
  total: number;
  onBack: () => void;
  onConfirm: (paymentMethod: string) => void;
}

export function Checkout({ total, onBack, onConfirm }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirectingToMercadoPago, setIsRedirectingToMercadoPago] = useState(false);

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const isCardFormValid =
    paymentMethod !== 'card' ||
    (
      cardNumber.replace(/\D/g, '').length === 16 &&
      cardName.trim().length >= 3 &&
      cardExpiry.length === 5 &&
      cardCvv.length >= 3
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCardFormValid) {
      return;
    }

    if (paymentMethod === 'mercado_pago') {
      setIsRedirectingToMercadoPago(true);
      setTimeout(() => {
        onConfirm(paymentMethod);
      }, 2000);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onConfirm(paymentMethod);
    }, 1500);
  };

  if (isRedirectingToMercadoPago) {
    return (
      <div className="min-h-screen bg-amber-50 px-6 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg">
            <Smartphone className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Redirigiendo a Mercado Pago
          </h1>
          <p className="mt-3 text-base font-medium leading-relaxed text-gray-600">
            Estamos abriendo el pago para confirmar tu pedido.
          </p>
          <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-sky-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-sky-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <div className="bg-yellow-800 text-white p-6 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Confirmar Pedido</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-amber-100">
          <h2 className="font-bold text-gray-900 mb-4 text-lg">Método de Pago</h2>
          <div className="space-y-3">
            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                paymentMethod === 'card'
                  ? 'border-yellow-800 bg-amber-50 shadow-sm'
                  : 'border-gray-300 hover:border-yellow-700'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-yellow-800 accent-yellow-800"
              />
              <CreditCard className="w-6 h-6 text-yellow-900" />
              <div>
                <p className="font-bold text-gray-900">Tarjeta de Crédito/Débito</p>
                <p className="text-sm text-gray-600 font-medium">Pagá con crédito o débito</p>
              </div>
            </label>

            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                paymentMethod === 'mercado_pago'
                  ? 'border-yellow-800 bg-amber-50 shadow-sm'
                  : 'border-gray-300 hover:border-yellow-700'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="mercado_pago"
                checked={paymentMethod === 'mercado_pago'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-yellow-800 accent-yellow-800"
              />
              <Smartphone className="w-6 h-6 text-yellow-900" />
              <div>
                <p className="font-bold text-gray-900">Mercado Pago</p>
                <p className="text-sm text-gray-600 font-medium">Pagá desde tu cuenta</p>
              </div>
            </label>
          </div>

          {paymentMethod === 'card' && (
            <div className="mt-5 rounded-xl border-2 border-amber-100 bg-amber-50/70 p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Número de tarjeta</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-900" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 font-semibold tracking-wide focus:border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-700"
                      required={paymentMethod === 'card'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nombre en la tarjeta</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-900" />
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="NOMBRE APELLIDO"
                      className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 font-semibold focus:border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-700"
                      required={paymentMethod === 'card'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Vencimiento</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-900" />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/AA"
                        className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-3 font-semibold focus:border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-700"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">CVV</label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-900" />
                      <input
                        type="password"
                        inputMode="numeric"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-3 font-semibold focus:border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-700"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-amber-100">
          <h2 className="font-bold text-gray-900 mb-4 text-lg">Notas del Pedido</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agregá indicaciones especiales (opcional)..."
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:border-yellow-700 resize-none font-medium"
            rows={3}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-amber-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-800 font-semibold">Subtotal</span>
            <span className="font-bold text-gray-900 text-lg">${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-800 font-semibold">Servicio</span>
            <span className="font-bold text-gray-900 text-lg">$0</span>
          </div>
          <div className="border-t-2 border-yellow-800 pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-3xl font-bold text-yellow-900">${total.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !isCardFormValid}
          className="w-full bg-yellow-800 text-white py-4 rounded-xl font-bold hover:bg-yellow-900 transition-colors disabled:bg-yellow-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Procesando pedido...
            </>
          ) : (
            'Confirmar y Realizar Pedido'
          )}
        </button>
      </form>
    </div>
  );
}
