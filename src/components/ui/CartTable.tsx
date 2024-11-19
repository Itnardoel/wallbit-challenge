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
          <div className="flex items-center justify-between">
            <p>Total productos agregados: {cartReducer(cart.products, "totalProducts")}</p>
            <p>Costo total del carrito: $ {cartReducer(cart.products, "totalPrice")}</p>
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
