import fetch from "auth/FetchInterceptor";

const SupplierService = {
  /**
   * ➕ Create a new supplier
   * @param {Object} data - Supplier details
   */
  addSupplier: (data) => 
    fetch({
      url: "/suppliers",
      method: "post",
      data,
    }),

  /**
   * 📄 Get all suppliers (supports pagination, search, filters)
   * @param {Object} params - { page, limit, search, status, sort }
   */
  getAllSuppliers: (params) =>
    fetch({
      url: "/suppliers",
      method: "get",
      params,
    }),

  /**
   * 🔍 Get supplier details by ID
   * @param {String} id - Supplier ID
   */
  getSupplierById: (id) =>
    fetch({
      url: `/suppliers/${id}`,
      method: "get",
    }),

  /**
   * ✏️ Update supplier details
   * @param {String} id - Supplier ID
   * @param {Object} data - Updated supplier data
   */
  updateSupplier: (id, data) =>
    fetch({
      url: `/suppliers/${id}`,
      method: "put",
      data,
    }),

  /**
   * 🗑️ Delete a supplier
   * @param {String} id - Supplier ID
   */
  deleteSupplier: (id) =>
    fetch({
      url: `/suppliers/${id}`,
      method: "delete",
    }),

  /**
   * ✅ Verify / Approve Supplier
   * @param {String} id - Supplier ID
   * @param {Object} data - e.g. { status: 'approved' }
   */
  verifySupplier: (id, data) =>
    fetch({
      url: `/suppliers/${id}/verify`,
      method: "patch",
      data,
    }),
};

export default SupplierService;
