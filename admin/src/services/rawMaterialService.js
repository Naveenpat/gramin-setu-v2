import fetch from "auth/FetchInterceptor";

const RawMaterialService = {};

// ➕ Add
RawMaterialService.create = (data) =>
  fetch({
    url: "/raw-material",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data,
  });

// 📜 Get all
RawMaterialService.getAll = () =>
  fetch({
    url: "/raw-material",
    method: "get",
  });

// 🔍 Get single
RawMaterialService.getById = (id) =>
  fetch({
    url: `/raw-material/${id}`,
    method: "get",
  });

// ✏️ Update
RawMaterialService.update = (id, data) =>
  fetch({
    url: `/raw-material/${id}`,
    method: "put",
    headers: { "Content-Type": "multipart/form-data" },
    data,
  });

// ❌ Delete
RawMaterialService.remove = (id) =>
  fetch({
    url: `/raw-material/${id}`,
    method: "delete",
  });

export default RawMaterialService;
