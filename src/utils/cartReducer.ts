import { Product } from "../types/modules";

type Value = "totalProducts" | "totalPrice";

export function cartReducer(products: Product[], value: Value) {
  return value === "totalProducts"
    ? products.reduce((totalProducts, product) => (totalProducts += product.quantity), 0)
    : products
        .reduce((totalPrice, product) => (totalPrice += product.price * product.quantity), 0)
        .toFixed(2);
}
