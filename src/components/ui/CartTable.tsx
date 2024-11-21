import { Cart } from "../../types/modules";
import { dateParser, cartReducer } from "../../utils";
import { DeleteIcon } from "../icons";

interface CartProps {
  cart: Cart;
  deleteCart: () => void;
  changeQuantity: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeProduct: (title: string) => void;
}

export const CartTable = ({ cart, deleteCart, changeQuantity, removeProduct }: CartProps) => {
  return (
    <section className="w-full border p-4">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-balance text-left font-semibold">
          Carrito de compra {cart.date !== null && `- Iniciado ${dateParser(cart.date)}`}
        </h2>
        {cart.products.length > 0 && (
          <button className="border px-2 py-1" onClick={deleteCart}>
            Limpiar carrito
          </button>
        )}
      </header>
      {cart.products.length > 0 ? (
        <>
          <table className="mb-4 hidden w-full border-collapse place-self-center border sm:table sm:w-11/12">
            <thead>
              <tr className="border-b-2">
                <td className="p-4 font-semibold">Cant</td>
                <td className="p-2 text-left font-semibold">Nombre</td>
                <td className="min-w-24 p-4 font-semibold">Precio U</td>
                <td className="min-w-24 p-4 font-semibold">Precio T</td>
                <td className="p-4 font-semibold">Foto</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {cart.products.map(({ image, price, quantity, title, id }) => {
                return (
                  <tr className="border-b" key={id}>
                    <td>
                      <input
                        className="border pl-4"
                        type="number"
                        defaultValue={quantity}
                        name={title}
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
                        className="aspect-auto h-auto w-16 place-self-center p-2"
                        src={image}
                        alt={`Image of ${title}`}
                      />
                    </td>
                    <td className="p-2">
                      <DeleteIcon
                        className="fill-[#21354780] transition-colors hover:cursor-pointer hover:fill-[#213547] dark:fill-white/50 dark:hover:fill-white"
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

          {/* GRID CARDS FOR MOBILE */}
          <div className="mb-4 sm:hidden">
            {cart.products.map(({ image, price, quantity, title, id }) => (
              <div key={id} className="flex gap-2 p-1">
                <img
                  className="aspect-auto h-auto w-16 place-self-center p-2"
                  src={image}
                  alt={`Image of ${title}`}
                />
                <div className="flex flex-1 flex-col justify-items-start">
                  <p className="line-clamp-2 text-balance p-2 pb-0 text-left">{title}</p>
                  <div className="flex items-center">
                    <input
                      className="ml-2 max-w-10 border pl-3"
                      type="number"
                      defaultValue={quantity}
                      name={title}
                      min={1}
                      onChange={(event) => {
                        changeQuantity(event);
                      }}
                    />

                    <p className="min-w-28 p-2">$ {(price * quantity).toFixed(2)}</p>
                    <DeleteIcon
                      className="m-2 fill-[#21354780] transition-colors hover:cursor-pointer hover:fill-[#213547] dark:fill-white/50 dark:hover:fill-white"
                      onClick={() => {
                        removeProduct(title);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start leading-4">
            <p className="text-xl font-bold">Total: $ {cartReducer(cart.products, "totalPrice")}</p>
            <p className="font-semibold text-[#213547d0] dark:text-white/60">
              Productos agregados: {cartReducer(cart.products, "totalProducts")}
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
  );
};
