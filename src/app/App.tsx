import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';
import {
  Home as HomeIcon,
  MessageSquare,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderTracking } from './components/OrderTracking';
import { Feedback } from './components/Feedback';
import { Faq } from './components/Faq';
import { Account } from './components/Account';
import { formatMenuText } from './utils/menuText';

type Screen = 'onboarding' | 'login' | 'home' | 'cart' | 'checkout' | 'tracking' | 'feedback' | 'faq' | 'account';

interface Product {
  id: number;
  name: string;
  venue: string;
  description: string;
  price: number;
  category: string;
  image: string;
  imageUrl: string;
  waitTimeMinutes: number;
  isOutOfStock?: boolean;
  flavorOptions?: string[];
  variantOptions?: { name: string; price: number }[];
  selectedFlavor?: string;
  quantityToAdd?: number;
  cartKey?: string;
  pickupLocation?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const CART_STORAGE_PREFIX = 'la-sede-cart';
const LAST_ORDER_STORAGE_PREFIX = 'la-sede-last-order';
const ACTIVE_ACCOUNT_STORAGE_KEY = 'la-sede-active-account';
const THEME_STORAGE_KEY = 'sinfi-theme';

const getAccountStorageKey = (prefix: string, accountName: string) =>
  `${prefix}:${accountName.trim().toLowerCase()}`;

const readStoredItems = (prefix: string, accountName: string): CartItem[] => {
  if (!accountName.trim()) {
    return [];
  }

  try {
    const storedValue = localStorage.getItem(getAccountStorageKey(prefix, accountName));
    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue as CartItem[] : [];
  } catch {
    return [];
  }
};

const readStoredAccountName = () => {
  try {
    return localStorage.getItem(ACTIVE_ACCOUNT_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
};

const writeStoredItems = (prefix: string, accountName: string, items: CartItem[]) => {
  if (!accountName.trim()) {
    return;
  }

  try {
    localStorage.setItem(
      getAccountStorageKey(prefix, accountName),
      JSON.stringify(items),
    );
  } catch {
    // If storage is unavailable, keep the in-memory cart working.
  }
};

const writeStoredAccountName = (accountName: string) => {
  try {
    if (!accountName.trim()) {
      localStorage.removeItem(ACTIVE_ACCOUNT_STORAGE_KEY);
      return;
    }

    localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, accountName.trim());
  } catch {
    // If storage is unavailable, keep the in-memory session working.
  }
};

const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
};

const writeStoredTheme = (isDarkMode: boolean) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  } catch {
    // If storage is unavailable, keep the in-memory theme working.
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() =>
    readStoredAccountName() ? 'home' : 'onboarding',
  );
  const [userName, setUserName] = useState(() => readStoredAccountName());
  const [cart, setCart] = useState<CartItem[]>(() =>
    readStoredItems(CART_STORAGE_PREFIX, readStoredAccountName()),
  );
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [lastOrderItems, setLastOrderItems] = useState<CartItem[]>(() =>
    readStoredItems(LAST_ORDER_STORAGE_PREFIX, readStoredAccountName()),
  );
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => readStoredTheme());
  const [searchQuery, setSearchQuery] = useState('');
  const [homePickupResetKey, setHomePickupResetKey] = useState(0);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);

  const loadUserSession = (name: string) => {
    const nextUserName = name.trim() || 'Usuario';
    writeStoredAccountName(nextUserName);
    setUserName(nextUserName);
    setCart(readStoredItems(CART_STORAGE_PREFIX, nextUserName));
    setLastOrderItems(readStoredItems(LAST_ORDER_STORAGE_PREFIX, nextUserName));
    setSearchQuery('');
    setIsSearchOpen(false);
    setCurrentScreen('home');
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const quantityToAdd = product.quantityToAdd ?? 1;
      const itemKey = product.cartKey ?? String(product.id);
      const existingItem = prevCart.find(
        (item) => (item.cartKey ?? String(item.id)) === itemKey,
      );
      const productLabel = product.selectedFlavor
        ? `${formatMenuText(product.name)} · ${formatMenuText(product.selectedFlavor)}`
        : formatMenuText(product.name);
      const pickupDescription = product.pickupLocation
        ? `Retiro: ${product.pickupLocation}`
        : undefined;

      if (existingItem) {
        toast.success(`${productLabel} agregado al carrito`, {
          description: pickupDescription
            ? `${pickupDescription} · Cantidad: ${existingItem.quantity + quantityToAdd}`
            : `Cantidad: ${existingItem.quantity + quantityToAdd}`,
          duration: 2000,
          action: {
            label: 'Ver carrito',
            onClick: () => setCurrentScreen('cart'),
          },
        });
        return prevCart.map((item) =>
          (item.cartKey ?? String(item.id)) === itemKey
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item,
        );
      }

      toast.success(`${productLabel} agregado al carrito`, {
        description: pickupDescription
          ? `${pickupDescription} · Cantidad: ${quantityToAdd}`
          : `Cantidad: ${quantityToAdd}`,
        duration: 2000,
        action: {
          label: 'Ver carrito',
          onClick: () => setCurrentScreen('cart'),
        },
      });
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
  };

  const handleUpdateQuantity = (cartKey: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          (item.cartKey ?? String(item.id)) === cartKey
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    const item = cart.find((i) => (i.cartKey ?? String(i.id)) === cartKey);
    if (item) {
      const itemLabel = item.selectedFlavor
        ? `${formatMenuText(item.name)} · ${formatMenuText(item.selectedFlavor)}`
        : formatMenuText(item.name);
      toast.error(`${itemLabel} eliminado del carrito`, {
        duration: 2000,
      });
    }
    setCart((prevCart) =>
      prevCart.filter((item) => (item.cartKey ?? String(item.id)) !== cartKey),
    );
  };

  const handleClearCart = () => {
    setCart([]);
    toast.error('Carrito vaciado', {
      duration: 2000,
    });
  };

  const handleCheckout = () => {
    const randomOrderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(randomOrderNumber);
    setOrderTotal(cartTotal);
    setOrderItems(cart);
    setLastOrderItems(cart);
    writeStoredItems(LAST_ORDER_STORAGE_PREFIX, userName, cart);
    writeStoredItems(CART_STORAGE_PREFIX, userName, []);
    setCurrentScreen('tracking');
    setCart([]);
    setHomePickupResetKey((currentKey) => currentKey + 1);
  };

  const handleRepeatLastOrder = () => {
    if (!lastOrderItems.length) {
      return;
    }

    setCart((prevCart) => {
      const nextCart = [...prevCart];

      for (const lastOrderItem of lastOrderItems) {
        const itemKey = lastOrderItem.cartKey ?? String(lastOrderItem.id);
        const existingItemIndex = nextCart.findIndex(
          (item) => (item.cartKey ?? String(item.id)) === itemKey,
        );

        if (existingItemIndex >= 0) {
          nextCart[existingItemIndex] = {
            ...nextCart[existingItemIndex],
            quantity: nextCart[existingItemIndex].quantity + lastOrderItem.quantity,
          };
          continue;
        }

        nextCart.push({ ...lastOrderItem });
      }

      return nextCart;
    });

    toast.success('Último pedido agregado al carrito', {
      description: `${lastOrderItems.reduce((total, item) => total + item.quantity, 0)} productos`,
      duration: 2000,
    });
    setCurrentScreen('cart');
  };

  const handleNewOrder = () => {
    setOrderItems([]);
    setCurrentScreen('home');
  };

  const handleUpdateName = (name: string) => {
    const nextUserName = name.trim();
    if (!nextUserName) return;

    writeStoredAccountName(nextUserName);
    writeStoredItems(CART_STORAGE_PREFIX, nextUserName, cart);
    writeStoredItems(LAST_ORDER_STORAGE_PREFIX, nextUserName, lastOrderItems);
    setUserName(nextUserName);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartPickupLocations = Array.from(
    new Set(cart.map((item) => item.pickupLocation).filter((location): location is string => Boolean(location))),
  );
  const showBottomNav =
    Boolean(userName) &&
    !['onboarding', 'login'].includes(currentScreen) &&
    !(currentScreen === 'cart' && cartItemCount > 0);
  const goHome = () => setCurrentScreen(userName ? 'home' : 'login');
  const goAccount = () => {
    if (!userName) {
      setCurrentScreen('login');
      return;
    }
    setCurrentScreen('account');
  };
  const handleLogout = () => {
    if (userName) {
      writeStoredItems(CART_STORAGE_PREFIX, userName, cart);
      writeStoredItems(LAST_ORDER_STORAGE_PREFIX, userName, lastOrderItems);
    }

    writeStoredAccountName('');
    setUserName('');
    setCart([]);
    setLastOrderItems([]);
    setSearchQuery('');
    setIsSearchOpen(false);
    setCurrentScreen('login');
  };
  const navItemClass = (isActive: boolean) =>
    `relative z-10 flex h-12 w-12 items-center justify-center justify-self-center rounded-full transition-colors ${
      isActive
        ? 'text-white'
        : 'text-sky-800 hover:bg-emerald-50/90 hover:text-emerald-700'
    }`;
  const activeNavIndex = isSearchOpen
    ? 1
    : ['cart', 'checkout'].includes(currentScreen)
      ? 2
      : currentScreen === 'feedback'
        ? 3
        : currentScreen === 'account'
          ? 4
          : currentScreen === 'home'
            ? 0
            : -1;

  useEffect(() => {
    if (!userName) {
      return;
    }

    writeStoredItems(CART_STORAGE_PREFIX, userName, cart);
  }, [cart, userName]);

  useEffect(() => {
    if (!userName) {
      return;
    }

    writeStoredItems(LAST_ORDER_STORAGE_PREFIX, userName, lastOrderItems);
  }, [lastOrderItems, userName]);

  useEffect(() => {
    if (!isSearchOpen) {
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
  }, [isSearchOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    writeStoredTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? 'dark size-full' : 'size-full'}>
      <Toaster position="top-center" richColors />
      {currentScreen === 'onboarding' && (
        <Onboarding onComplete={() => setCurrentScreen('login')} />
      )}

      {currentScreen === 'login' && (
        <Login onLogin={loadUserSession} onFeedback={() => setCurrentScreen('feedback')} />
      )}

      {userName && !['onboarding', 'login'].includes(currentScreen) && (
        <div className={currentScreen === 'home' ? 'block' : 'hidden'}>
          <Home
            userName={userName}
            onAddToCart={handleAddToCart}
            lastOrderItems={lastOrderItems}
            cartPickupLocations={cartPickupLocations}
            pickupResetKey={homePickupResetKey}
            onRepeatLastOrder={handleRepeatLastOrder}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLogout={handleLogout}
            getCartTarget={() => {
              const cartButtonRect = cartButtonRef.current?.getBoundingClientRect();

              if (!cartButtonRect) {
                return {
                  x: window.innerWidth / 2,
                  y: window.innerHeight - 34,
                };
              }

              return {
                x: cartButtonRect.left + cartButtonRect.width / 2,
                y: cartButtonRect.top + cartButtonRect.height / 2,
              };
            }}
          />
        </div>
      )}

      {currentScreen === 'cart' && (
        <Cart
          items={cart}
          lastOrderItems={lastOrderItems}
          onBack={() => setCurrentScreen('home')}
          onCheckout={() => setCurrentScreen('checkout')}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onRepeatLastOrder={handleRepeatLastOrder}
        />
      )}

      {currentScreen === 'checkout' && (
        <Checkout
          total={cartTotal}
          onBack={() => setCurrentScreen('cart')}
          onConfirm={handleCheckout}
        />
      )}

      {currentScreen === 'tracking' && (
        <OrderTracking
          orderNumber={orderNumber}
          total={orderTotal}
          items={orderItems}
          onNewOrder={handleNewOrder}
        />
      )}

      {currentScreen === 'feedback' && (
        <Feedback
          onBack={() => setCurrentScreen(userName ? 'home' : 'login')}
          onFaq={() => setCurrentScreen('faq')}
        />
      )}

      {currentScreen === 'faq' && (
        <Faq onBack={() => setCurrentScreen('feedback')} />
      )}

      {currentScreen === 'account' && (
        <Account
          userName={userName}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((currentValue) => !currentValue)}
          onBack={() => setCurrentScreen('home')}
          onLogout={handleLogout}
          onUpdateName={handleUpdateName}
        />
      )}

      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-0 pb-0 pointer-events-none">
          <nav className="relative grid w-full grid-cols-5 items-center rounded-none border-t-2 border-emerald-100 bg-white/96 px-5 py-2 shadow-[0_-10px_30px_rgba(15,118,110,0.14)] backdrop-blur-xl pointer-events-auto dark:border-slate-700 dark:bg-slate-950/96">
            <div className="pointer-events-none absolute inset-x-6 top-1 h-px rounded-full bg-emerald-50/80 dark:bg-slate-800/70" />
            <div
              className={`pointer-events-none absolute inset-x-5 top-2 h-12 transition-opacity duration-200 ${
                activeNavIndex === -1 ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div
                className="flex h-12 w-1/5 justify-center transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${activeNavIndex * 100}%)` }}
              >
                <div className="h-12 w-12 rounded-full bg-emerald-600 shadow-[0_10px_24px_rgba(5,150,105,0.32)] ring-4 ring-emerald-50 dark:ring-slate-900" />
              </div>
            </div>
            <button
              onClick={goHome}
              className={navItemClass(currentScreen === 'home')}
              aria-label="Home"
              type="button"
            >
              <HomeIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                setCurrentScreen('home');
                setIsSearchOpen(true);
              }}
              className={navItemClass(isSearchOpen)}
              aria-label="Buscar"
              type="button"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              ref={cartButtonRef}
              onClick={() => setCurrentScreen('cart')}
              className={`${navItemClass(['cart', 'checkout'].includes(currentScreen))} relative`}
              aria-label="Carrito"
              type="button"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentScreen('feedback')}
              className={navItemClass(currentScreen === 'feedback')}
              aria-label="Opinión"
              type="button"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
            <button
              onClick={goAccount}
              className={navItemClass(currentScreen === 'account')}
              aria-label="Mi cuenta"
              type="button"
            >
              <User className="w-6 h-6" />
            </button>
          </nav>
        </div>
      )}

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5 backdrop-blur-[2px]"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-5 w-full max-w-md shadow-2xl border-2 border-emerald-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Buscar producto</h2>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentScreen('home');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsSearchOpen(false);
                  }
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold"
                autoFocus
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md"
              type="button"
            >
              Buscar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
