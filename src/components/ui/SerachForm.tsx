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
      <h2 className="text-wrap font-semibold">Agregá los productos al carro de compra</h2>
      <form
        className="grid gap-4 sm:grid-cols-[auto,1fr,2fr]"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <input
          className="w-[197px] border px-2 py-1 sm:w-auto"
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
            className={`border px-2 py-1 ${error ? "outline outline-red-500" : ""}`}
            type="number"
            name="productId"
            id="productId"
            placeholder="ID del producto"
            min={1}
            required
          />
          <span className={loading ? "" : product === null && error === null ? "invisible" : ""}>
            {loading ? (
              <AutorenewIcon className="animate-spin fill-[#213547] dark:fill-white" />
            ) : error ? (
              <CloseIcon className="fill-red-500" />
            ) : (
              <CheckIcon className="fill-green-500" />
            )}
          </span>
        </div>
        {error && <p className="text-left text-red-500 sm:hidden">{error.message}</p>}

        <button
          disabled={loading}
          className="place-self-start px-2 py-1 hover:disabled:cursor-wait sm:place-self-end"
          type="submit"
        >
          Agregar
        </button>
      </form>
      {error && <p className="hidden text-red-500 sm:inline-block">{error.message}</p>}
    </section>
  );
};
