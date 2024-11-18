import { useState } from "react";
import "./App.css";
import { useFetch } from "./hooks/useFetch";
import { AutorenewIcon, CheckIcon, CloseIcon, DeleteIcon } from "./component/icons";
import { dateParser } from "./utils/dateParser";
import { usePersistedState } from "./hooks/usePersistedState";

const FAKESTORE_URL_ENDPOINT = "https://fakestoreapi.com";

interface Cart {
  date: number | null;
  products: Product[];
}

interface Product {
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
  quantity: number;
}

function App() {
  const [cart, setCart] = usePersistedState<Cart>("cart", { date: null, products: [] });
  const [url, setUrl] = useState("");
  const { data: product, error, loading } = useFetch<Product>(url);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const quantity = Number(formData.get("quantity"));
    const productId = formData.get("productId")?.toString();

    if (productId && quantity && product && !error) {
      event.currentTarget.reset();

      const newProduct = { ...product, quantity: quantity };

      const isInCart = cart.products.some((product) => product.title === newProduct.title);

      if (isInCart) {
        const state = [...cart.products];
        const found = state.find((product) => product.title === newProduct.title);
        const $input = document.getElementById(newProduct.id.toString()) as HTMLInputElement;

        if (found) {
          found.quantity += quantity;
          $input.value = found.quantity.toString();
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
    <>
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
          <div className="flex items-center gap-2">
            <input
              onInput={(event) => {
                setUrl(
                  event.currentTarget.value === ""
                    ? ""
                    : `${FAKESTORE_URL_ENDPOINT}/products/${event.currentTarget.value}`,
                );
              }}
              onChange={(event) => {
                setUrl(
                  event.target.value === ""
                    ? ""
                    : `${FAKESTORE_URL_ENDPOINT}/products/${event.target.value}`,
                );
              }}
              className={`px-2 py-1 ${error ? "outline outline-red-500" : ""}`}
              type="number"
              name="productId"
              id="productId"
              placeholder="ID del producto"
              min={0}
              required
            />
            <span className={loading ? "" : product === null && error === null ? "invisible" : ""}>
              {loading ? (
                <AutorenewIcon className="animate-spin fill-white" />
              ) : error ? (
                <CloseIcon className="fill-red-500" />
              ) : (
                <CheckIcon className="fill-green-500" />
              )}
            </span>
          </div>
          <button
            disabled={loading}
            className="place-self-end px-2 py-1 hover:disabled:cursor-wait"
            type="submit"
          >
            Agregar
          </button>
        </form>
        {error && <p className="text-red-500">{error.message}</p>}
      </section>
      <section className="w-full border p-4">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-balance text-left">
            Carrito de compra {cart.date !== null && `- Iniciado ${dateParser(cart.date)}`}
          </h2>
          {cart.products.length > 0 && (
            <button className="px-2 py-1" onClick={deleteCart}>
              Limpiar carrito
            </button>
          )}
        </header>
        {cart.products.length > 0 ? (
          <>
            <table className="mb-4 w-full border-collapse place-self-center border md:w-11/12">
              <thead>
                <tr className="border-b-2">
                  <td className="p-4">Cant</td>
                  <td className="p-2 text-left">Nombre</td>
                  <td className="min-w-24 p-4">Precio U</td>
                  <td className="min-w-24 p-4">Precio T</td>
                  <td className="p-4">Foto</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {cart.products.map(({ image, price, quantity, title, id }) => {
                  return (
                    <tr className="border-b" key={id}>
                      <td>
                        <input
                          className="pl-2"
                          type="number"
                          defaultValue={quantity}
                          name={title}
                          id={id.toString()}
                          min={1}
                          onChange={(event) => {
                            changeQuantity(event);
                          }}
                        />
                      </td>
                      <td className="min-w-64 max-w-80 text-balance p-2 text-left">{title}</td>
                      <td>$ {price.toFixed(2)}</td>
                      <td>$ {(price * quantity).toFixed(2)}</td>
                      <td>
                        <img
                          className="aspect-square size-16 place-self-center p-2"
                          src={image}
                          alt={`Image of ${title}`}
                        />
                      </td>
                      <td className="p-2">
                        <DeleteIcon
                          className="fill-white/50 transition-colors hover:cursor-pointer hover:fill-white"
                          onClick={() => {
                            removeProduct(title);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-between">
              <p>
                Total productos agregados:{" "}
                {cart.products.reduce(
                  (totalProducts, product) => (totalProducts += product.quantity),
                  0,
                )}
              </p>
              <p>
                Costo total del carrito: ${" "}
                {cart.products
                  .reduce(
                    (totalPrice, product) => (totalPrice += product.price * product.quantity),
                    0,
                  )
                  .toFixed(2)}
              </p>
            </div>
          </>
        ) : (
          <p className="m-auto max-w-md text-left">
            No hay productos en el carro aun, probá agregando arriba con su id y la cantidad que
            deseas ingresar
          </p>
        )}
      </section>
    </>
  );
}

export default App;
