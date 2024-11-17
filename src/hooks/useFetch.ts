import { useEffect, useState } from "react";

type Data<T> = T | null;
type ErrorType = Error | null;

interface Params<T> {
  data: Data<T>;
  loading: boolean;
  error: ErrorType;
}

export const useFetch = <T>(url: string): Params<T> => {
  const [data, setData] = useState<Data<T>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType>(null);

  useEffect(() => {
    if (url === "") return;

    const controller = new AbortController();

    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await fetch(url, controller);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status.toString()}`);
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

  return { data, loading, error };
};
