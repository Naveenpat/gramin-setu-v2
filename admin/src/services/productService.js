import fetch from "auth/FetchInterceptor";

const ProductService = {
  createProduct(data) {
    return fetch({ url: "/products", method: "post", data });
  },
  getAllProducts(params) {
    return fetch({ url: "/products", method: "get", params });
  },
  getProductById(id) {
    return fetch({ url: `/products/${id}`, method: "get" });
  },
  updateProduct(id, data) {
    return fetch({ url: `/products/${id}`, method: "put", data });
  },
  deleteProduct(id) {
    return fetch({ url: `/products/${id}`, method: "delete" });
  },
};

export default ProductService;
