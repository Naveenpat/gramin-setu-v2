import fetch from "auth/FetchInterceptor";

const OrderService = {};

// 📦 Get All Orders (with pagination, search, filter)
OrderService.getAllOrders = (params) =>
  fetch({
    url: "/orders",
    method: "get",
    params,
  });

// 🔍 Get Order by ID
OrderService.getOrderById = (id) =>
  fetch({
    url: `/orders/${id}`,
    method: "get",
  });

// ➕ Create Order
OrderService.createOrder = (data) =>
  fetch({
    url: "/orders",
    method: "post",
    data,
  });

// ✏️ Update Order
OrderService.updateOrder = (id, data) =>
  fetch({
    url: `/orders/${id}`,
    method: "put",
    data,
  });

// 🔄 Update Order Status
OrderService.updateOrderStatus = (id, data) =>
  fetch({
    url: `/orders/${id}/status`,
    method: "patch",
    data,
  });

// 🗑️ Delete Order
OrderService.deleteOrder = (id) =>
  fetch({
    url: `/orders/${id}`,
    method: "delete",
  });

// 📤 Export Orders (Excel)
OrderService.exportOrdersExcel = () =>
  fetch({
    url: "/orders/export/excel",
    method: "get",
    responseType: "arraybuffer",
  });

// 📄 Export Orders (PDF)
OrderService.exportOrdersPDF = () =>
  fetch({
    url: "/orders/export/pdf",
    method: "get",
    responseType: "arraybuffer",
  });

// 📝 Export Orders (Word)
OrderService.exportOrdersWord = () =>
  fetch({
    url: "/orders/export/word",
    method: "get",
    responseType: "arraybuffer",
  });

export default OrderService;
