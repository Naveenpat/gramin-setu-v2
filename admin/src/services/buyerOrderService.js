import fetch from "auth/FetchInterceptor";

const BuyerOrderService = {};

// 🟢 Create new buyer order
BuyerOrderService.createBuyerOrder = function (data) {
  return fetch({
    url: "/buyer-orders",
    method: "post",
    data: data,
  });
};

// 🟢 Get all buyer orders (with optional filters / pagination)
BuyerOrderService.getAllBuyerOrders = function (params) {
  return fetch({
    url: "/buyer-orders",
    method: "get",
    params: params,
  });
};

// 🟢 Get single buyer order by ID
BuyerOrderService.getBuyerOrderById = function (id) {
  return fetch({
    url: `/buyer-orders/${id}`,
    method: "get",
  });
};

// 🟢 Update buyer order status
BuyerOrderService.updateBuyerOrderStatus = function (id, data) {
  return fetch({
    url: `/buyer-orders/${id}/status`,
    method: "put",
    data: data,
  });
};

// 🟢 Delete buyer order
BuyerOrderService.deleteBuyerOrder = function (id) {
  return fetch({
    url: `/buyer-orders/${id}`,
    method: "delete",
  });
};

export default BuyerOrderService;
