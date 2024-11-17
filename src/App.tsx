import { useState } from "react";
import "./App.css";
import { useFetch } from "./hooks/useFetch";
import { dateParser } from "./utils/dateParser";

const FAKESTORE_URL_ENDPOINT = "https://fakestoreapi.com";

interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface Cart {
  date: number | null;
  products: Product[];
}

interface Product {
  title: string;
  price: number;
  image: string;
  quantity: number;
}

function App() {
  const [cart, setCart] = useState<Cart>({
    date: null,
    products: [],
  });
  const [url, setUrl] = useState("");
  const { data, error, loading } = useFetch<ApiProduct>(url);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const quantity = Number(formData.get("quantity"));
    const productId = formData.get("productId")?.toString();

    if (productId && quantity && data && !error) {
      event.currentTarget.reset();

      const newProduct = {
        title: data.title,
        price: data.price,
        image: data.image,
        quantity: quantity,
      };

      const isInCart = cart.products.some((product) => product.title === newProduct.title);

      if (isInCart) {
        const state = [...cart.products];
        const found = state.find((product) => product.title === newProduct.title);
        if (found) {
          found.quantity += quantity;
        }

        setCart({ ...cart, products: state });
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
      }
    } else {
      document.getElementById("productId")?.focus();
    }
  }

  return (
    <>
      {JSON.stringify(cart)}
      <h1 className="mb-4 p-4 text-start text-2xl font-bold">Tienda - El Topo</h1>
      <section className="mb-4 grid place-items-start gap-3 border p-4">
        <h2>Agregá los productos al carro de compra</h2>
        <form
          className="grid grid-cols-[auto,1fr,2fr] gap-4"
          onSubmit={(event) => {
            handleSubmit(event);
          }}
        >
          <input
            className="px-2 py-1"
            type="number"
            name="quantity"
            id="quantity"
            placeholder="Cantidad"
            min={1}
            required
          />
          <input
            onChange={(event) => {
              setUrl(`${FAKESTORE_URL_ENDPOINT}/products/${event.target.value}`);
            }}
            className={`px-2 py-1 ${error ? "outline outline-red-500" : ""}`}
            type="number"
            name="productId"
            id="productId"
            placeholder="ID del producto"
            min={0}
            required
          />
          <button disabled={loading} className="place-self-end px-2 py-1" type="submit">
            Agregar
          </button>
        </form>
        {error && <p className="text-red-500">{error.message}</p>}
      </section>
      <section className="w-full border p-4">
        <h2 className="mb-4 text-balance text-left">
          Carrito de compra {cart.date !== null && `- Iniciado ${dateParser(cart.date)}`}
        </h2>
        <p className="m-auto w-4/5 text-left">
          No hay productos en el carro aun, probá agregando arriba con su id y la cantidad que
          deseas ingresar
        </p>
      </section>
    </>
  );
}

export default App;
