import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface FaqProps {
  onBack: () => void;
}

const FAQ_ITEMS = [
  {
    question: '¿Dónde retiro mi pedido?',
    answer: 'En el punto de compra indicado en el seguimiento. Si pediste en más de un local, cada local aparece separado.',
  },
  {
    question: '¿Cómo sé cuándo está listo?',
    answer: 'La pantalla de seguimiento muestra el estado del pedido, la barra de progreso y el tiempo estimado.',
  },
  {
    question: '¿Qué significa “Ya llegué”?',
    answer: 'Sirve para avisar al local que ya estás en el punto de retiro y que pueden preparar la entrega.',
  },
  {
    question: '¿Puedo pedir en más de un local?',
    answer: 'Sí. El seguimiento separa los tiempos por local y podés retirar primero el pedido que esté listo antes.',
  },
  {
    question: '¿Se guarda mi carrito si salgo?',
    answer: 'Sí. El carrito queda guardado por cuenta, así no se mezcla con el pedido de otro usuario.',
  },
  {
    question: '¿Puedo repetir un pedido anterior?',
    answer: 'Sí. Si ya confirmaste un pedido, aparece el botón “Repetir último pedido” para volver a cargarlo al carrito.',
  },
  {
    question: '¿Cómo identifico mi pedido?',
    answer: 'Cada pedido tiene un número visible en la pantalla de seguimiento. Usá ese número al retirar.',
  },
  {
    question: '¿Qué pasa si un producto no tiene stock?',
    answer: 'Los productos sin stock aparecen bloqueados y no se pueden agregar al carrito.',
  },
  {
    question: '¿Qué medios de pago puedo usar?',
    answer: 'Podés pagar con tarjeta o Mercado Pago desde la pantalla de confirmación.',
  },
];

export function Faq({ onBack }: FaqProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-amber-50 pb-28">
      <div className="bg-yellow-800 text-white p-6 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Preguntas frecuentes</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-3 p-6">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openFaqIndex === index;

          return (
            <button
              key={item.question}
              type="button"
              onClick={() => setOpenFaqIndex(isOpen ? null : index)}
              className="w-full rounded-xl border-2 border-amber-100 bg-white px-4 py-4 text-left shadow-sm transition-colors hover:bg-amber-50"
            >
              <span className="flex items-center justify-between gap-4">
                <span className="font-bold text-gray-900">{item.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-yellow-900 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </span>
              {isOpen && (
                <span className="mt-2 block text-sm font-medium leading-relaxed text-gray-600">
                  {item.answer}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
