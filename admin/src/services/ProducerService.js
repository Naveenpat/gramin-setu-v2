import fetch from "auth/FetchInterceptor";

const ProducerService = {};

ProducerService.addProducer = (data) =>
  fetch({ url: "/producers", method: "post", data });

ProducerService.getAllProducers = (params) =>
  fetch({ url: "/producers", method: "get", params });

ProducerService.getProducerById = (id) =>
  fetch({ url: `/producers/${id}`, method: "get" });

ProducerService.updateProducer = (id, data) =>
  fetch({ url: `/producers/${id}`, method: "put", data });

ProducerService.deleteProducer = (id) =>
  fetch({ url: `/producers/${id}`, method: "delete" });

ProducerService.verifyProducer = (id) =>
  fetch({ url: `/producers/${id}/verify`, method: "patch" });

export default ProducerService;
