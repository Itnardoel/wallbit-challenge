import "./App.css";
import { useFetch, usePersistedState } from "./hooks";
import { Cart, Product } from "./types/modules";
import { SearchForm, CartTable, DarkModeToggle } from "./components/ui";

function App() {
  const [cart, setCart] = usePersistedState<Cart>("cart", { date: null, products: [] });
  const { data: product, error, loading, setUrl, handleChangeInputForm } = useFetch<Product>();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const quantity = Number(formData.get("quantity"));
    const productId = formData.get("productId")?.toString();

    if (productId && quantity && product && !error) {
      const newProduct = { ...product, quantity: quantity };

      const isInCart = cart.products.some((product) => product.title === newProduct.title);

      if (isInCart) {
        const state = [...cart.products];
        const found = state.find((product) => product.title === newProduct.title);
        const $input: NodeListOf<HTMLInputElement> = document.querySelectorAll(
          `input[name="${newProduct.title}"]`,
        );

        if (found) {
          found.quantity += quantity;
          $input.forEach((input) => (input.value = found.quantity.toString()));
        }

        setCart({ ...cart, products: state });
        setUrl("");
      } else {
        setCart((prevState) => {
          if (prevState.date === null) {
            return {
              date: Date.now(),
              products: [newProduct],
            };
          } else {
            return {
              ...cart,
              products: [...cart.products, newProduct],
            };
          }
        });
        setUrl("");
        event.currentTarget.reset();
      }
    } else {
      document.getElementById("productId")?.focus();
    }
  }

  function changeQuantity(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value === "") {
      event.target.value = "1";
    }

    const products = [...cart.products];

    const found = products.find((product) => product.title === event.target.name);
    if (found) {
      found.quantity = Number(event.target.value);
    }

    setCart({ ...cart, products: products });
  }

  function deleteCart() {
    setCart({ date: null, products: [] });
  }

  function removeProduct(title: string) {
    const filteredProducts = cart.products.filter((product) => product.title !== title);

    if (filteredProducts.length === 0) {
      deleteCart();
      return;
    }

    setCart({ ...cart, products: filteredProducts });
  }

  return (
    <main className="p-2 sm:p-8">
      <div className="flex items-center justify-between">
        <h1 className="p-4 text-start text-2xl font-bold">Tienda - El Topo</h1>
        <DarkModeToggle />
      </div>
      <SearchForm
        error={error}
        handleChangeInputForm={handleChangeInputForm}
        handleSubmit={handleSubmit}
        loading={loading}
        product={product}
      />
      <CartTable
        cart={cart}
        changeQuantity={changeQuantity}
        deleteCart={deleteCart}
        removeProduct={removeProduct}
      />
    </main>
  );
}

export default App;
