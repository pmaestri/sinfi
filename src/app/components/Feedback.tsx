import { useState } from 'react';
import { ArrowLeft, MessageSquare, Send, Star } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackProps {
  onBack: () => void;
}

export function Feedback({ onBack }: FeedbackProps) {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    toast.success('Gracias por tu opinión', { duration: 2500 });
    setFeedback('');
    setRating(0);
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-28">
      <div className="bg-yellow-800 text-white p-6 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Opinión</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 text-yellow-900 w-12 h-12 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Dejanos tu comentario</h2>
              <p className="text-sm text-gray-600 font-medium">Calificá tu experiencia y, si querés, contanos qué mejorarías.</p>
            </div>
          </div>

          <div className="mb-5 rounded-xl bg-amber-50 border-2 border-amber-100 p-4">
            <p className="text-sm font-bold text-gray-700 mb-3">Tu calificación</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="rounded-full p-2 transition-transform hover:scale-110 active:scale-95"
                  aria-label={`Calificar con ${value} estrella${value > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating
                        ? 'fill-yellow-400 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Escribí un comentario opcional..."
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:border-yellow-700 resize-none font-medium"
            rows={6}
          />
        </div>

        <button
          type="submit"
          disabled={!rating}
          className="w-full bg-yellow-800 text-white py-4 rounded-xl font-bold hover:bg-yellow-900 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          <Send className="w-5 h-5" />
          Enviar opinión
        </button>
      </form>
    </div>
  );
}
