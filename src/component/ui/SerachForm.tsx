import { AutorenewIcon, CheckIcon, CloseIcon } from "../icons";
import { Product } from "../../types/modules";

interface SearchFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChangeInputForm: (event: React.FormEvent<HTMLInputElement>) => void;
  error: Error | null;
  loading: boolean;
  product: Product | null;
}

export const SearchForm = ({
  handleSubmit,
  handleChangeInputForm,
  error,
  loading,
  product,
}: SearchFormProps) => {
  return (
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
              handleChangeInputForm(event);
            }}
            onChange={(event) => {
              handleChangeInputForm(event);
            }}
            className={`px-2 py-1 ${error ? "outline outline-red-500" : ""}`}
            type="number"
            name="productId"
            id="productId"
            placeholder="ID del producto"
            min={1}
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
  );
};
