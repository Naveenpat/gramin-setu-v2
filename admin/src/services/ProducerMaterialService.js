import fetch from "auth/FetchInterceptor";

const ProducerMaterialService = {};

ProducerMaterialService.createMaterial = function (data) {
  return fetch({
    url: "/producer-material",
    method: "post",
    data: data,
  });
};

ProducerMaterialService.getAllMaterials = function () {
  return fetch({
    url: "/producer-material",
    method: "get",
  });
};

ProducerMaterialService.getMaterialById = function (id) {
  return fetch({
    url: `/producer-material/${id}`,
    method: "get",
  });
};

ProducerMaterialService.updateMaterial = function (id, data) {
  return fetch({
    url: `/producer-material/${id}`,
    method: "put",
    data: data,
  });
};

ProducerMaterialService.deleteMaterial = function (id) {
  return fetch({
    url: `/producer-material/${id}`,
    method: "delete",
  });
};

export default ProducerMaterialService;
