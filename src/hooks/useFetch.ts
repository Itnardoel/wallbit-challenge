import { useEffect, useState } from "react";

type Data<T> = T | null;
type ErrorType = Error | null;

interface Params<T> {
  data: Data<T>;
  loading: boolean;
  error: ErrorType;
  handleChangeInputForm: (event: React.FormEvent<HTMLInputElement>) => void;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
}

const FAKESTORE_URL_ENDPOINT = "https://fakestoreapi.com";

export const useFetch = <T>(): Params<T> => {
  const [data, setData] = useState<Data<T>>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url === "") {
      setData(null);
      setError(null);
      return;
    }

    const controller = new AbortController();

    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(url, controller);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Response status: ${response.status.toString()} (Not Found)`);
          }
          throw new Error(`Response status: ${response.status.toString()} `);
        }

        const jsonData = (await response.json()) as T;
        setData(jsonData);
        setError(null);
      } catch (error) {
        if (error instanceof SyntaxError) {
          error.message = "Producto inexistente";
          setError(error);
        }
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => {
      controller.abort("");
    };
  }, [url]);

  function handleChangeInputForm(event: React.FormEvent<HTMLInputElement>) {
    if (event.currentTarget.name === "quantity") {
      if (event.currentTarget.value === "") {
        event.currentTarget.value = "1";
      } else if (Number(event.currentTarget.value) > 9) {
        event.currentTarget.value = "9";
      }
      return;
    }

    setUrl(
      event.currentTarget.value === ""
        ? ""
        : `${FAKESTORE_URL_ENDPOINT}/products/${event.currentTarget.value}`,
    );
  }

  return { data, loading, error, handleChangeInputForm, setUrl };
};
