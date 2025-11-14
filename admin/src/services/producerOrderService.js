import fetch from "auth/FetchInterceptor";

const ProducerOrderService = {};

// ✅ Create Producer Order
ProducerOrderService.createOrder = function (data) {
  return fetch({
    url: "/producer-orders",
    method: "post",
    data: data,
  });
};

// ✅ Get All Producer Orders (with pagination, search, filters)
ProducerOrderService.getAllOrders = function (params) {
  return fetch({
    url: "/producer-orders",
    method: "get",
    params: params,
  });
};

// ✅ Get Producer Order by ID
ProducerOrderService.getOrderById = function (id) {
  return fetch({
    url: `/producer-orders/${id}`,
    method: "get",
  });
};

// ✅ Update Producer Order
ProducerOrderService.updateOrder = function (id, data) {
  return fetch({
    url: `/producer-orders/${id}`,
    method: "put",
    data: data,
  });
};

// ✅ Delete Producer Order
ProducerOrderService.deleteOrder = function (id) {
  return fetch({
    url: `/producer-orders/${id}`,
    method: "delete",
  });
};

export default ProducerOrderService;
