import fetch from 'auth/FetchInterceptor';

const InventoryService = {};

InventoryService.getAll = function () {
  return fetch({ url: '/suppliers/inventory/inventory', method: 'get' });
};

InventoryService.getById = function (id) {
  return fetch({ url: `/suppliers/inventory/${id}`, method: 'get' });
};

InventoryService.add = function (data) {
  return fetch({ url: '/suppliers/inventory', method: 'post', data });
};

InventoryService.update = function (id, data) {
  return fetch({ url: `/suppliers/inventory/${id}`, method: 'put', data });
};

InventoryService.delete = function (id) {
  return fetch({ url: `/suppliers/inventory/${id}`, method: 'delete' });
};

InventoryService.getLowStock = function () {
  return fetch({ url: '/suppliers/inventory/low/alerts', method: 'get' });
};

export default InventoryService;
