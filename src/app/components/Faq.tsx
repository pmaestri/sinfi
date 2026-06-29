import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface FaqProps {
  onBack: () => void;
}

const FAQ_ITEMS = [
  {
    question: '¿Cómo busco un producto?',
    answer: 'Tocá la lupa, escribí el nombre del producto o una marca y presioná “Buscar”. La búsqueda no filtra por categorías.',
  },
  {
    question: '¿Dónde retiro mi pedido?',
    answer: 'Retirás en el punto que elegiste al agregar los productos. Si pediste en más de un local, el seguimiento muestra cada punto de retiro por separado.',
  },
  {
    question: '¿Cómo sé cuándo está listo?',
    answer: 'La pantalla de seguimiento muestra el estado del pedido, la barra de progreso y el tiempo estimado de preparación.',
  },
  {
    question: '¿Qué significa “Ya llegué”?',
    answer: 'Sirve para avisar que ya estás en el punto de retiro y que pueden preparar la entrega.',
  },
  {
    question: '¿Puedo pedir en más de un local?',
    answer: 'Sí. Podés agregar productos de distintos locales al mismo carrito. Después, el seguimiento separa los tiempos y puntos de retiro.',
  },
  {
    question: '¿Se guarda mi carrito si salgo?',
    answer: 'Sí. El carrito queda guardado por usuario.',
  },
  {
    question: '¿Cómo repito mi último pedido?',
    answer: 'Después de confirmar un pedido, aparece “Repetir último pedido” en el inicio y también en el carrito vacío. Tocá ese botón para agregar los mismos productos al carrito.',
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
    question: '¿Para qué sirve “Avisarme cuando haya stock”?',
    answer: 'Sirve para dejar registrado que querés enterarte cuando un producto vuelva a estar disponible. Tocá el botón en el producto sin stock y la app confirma el aviso.',
  },
  {
    question: '¿Qué medios de pago puedo usar?',
    answer: 'Podés pagar con tarjeta o Mercado Pago desde la pantalla de confirmación.',
  },
];

export function Faq({ onBack }: FaqProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <div className="bg-emerald-600 text-white p-6 shadow-md">
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
              className="w-full rounded-xl border-2 border-emerald-100 bg-white px-4 py-4 text-left shadow-sm transition-colors hover:bg-slate-50"
            >
              <span className="flex items-center justify-between gap-4">
                <span className="font-bold text-gray-900">{item.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-sky-900 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
