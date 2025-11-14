import fetch from "auth/FetchInterceptor";

const BuyerService = {};

BuyerService.addBuyer = (data) =>
  fetch({ url: "/buyers", method: "post", data });

BuyerService.getAllBuyers = (params) =>
  fetch({ url: "/buyers", method: "get", params });

BuyerService.getBuyerById = (id) =>
  fetch({ url: `/buyers/${id}`, method: "get" });

BuyerService.updateBuyer = (id, data) =>
  fetch({ url: `/buyers/${id}`, method: "put", data });

BuyerService.deleteBuyer = (id) =>
  fetch({ url: `/buyers/${id}`, method: "delete" });

export default BuyerService;
