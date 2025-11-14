import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GlobalTableActions from "components/GlobalTableActions";
import ActionButtons from "components/ActionButtons";
import ProducerService from "services/ProducerService";
import useDebounce from "utils/debouce";
import GlobalFilterModal from "components/GlobalFilterModal";
import { hasPermission } from "utils/auth";
import AddProducerModal from "./AddProducerModal";

const renderBadge = (text, type) => {
  let color;
  switch (type) {
    case "status":
      color = text === "active" ? "green" : "red";
      break;
    case "verified":
      color = text ? "blue" : "orange";
      text = text ? "Verified" : "Unverified";
      break;
    default:
      color = "gray";
  }
  return <Tag color={color}>{text}</Tag>;
};

const ProducerList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const suppliers = [{_id:"69065250439371e4f07e9c2e",label:"NaveenPatel"}]
 const columns = [
  {
    title: "Company Name",
    dataIndex: "companyName",
    key: "companyName",
  },
  {
    title: "Contact Person",
    dataIndex: "contactPerson",
    key: "contactPerson",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Payment Terms",
    dataIndex: "paymentTerms",
    key: "paymentTerms",
    render: (text) => text || "-",
  },
  {
    title: "GST",
    dataIndex: "gst",
    key: "gst",
    render: (gst) => renderBadge(gst ? "Yes" : "No", gst ? "active" : "inactive"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => renderBadge(text, "status"),
  },
  {
    title: "Verified",
    dataIndex: "verified",
    key: "verified",
    render: (verified) => renderBadge(verified ? "Yes" : "No", verified ? "verified" : "unverified"),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <ActionButtons
        onEdit={() => handleEdit(record._id)}
        onDelete={() => handleDelete(record._id)}
        showEdit={true}
        showDelete={true}
      />
    ),
  },
];


  const filterConfig = [
    {
      type: "select",
      name: "status",
      label: "Status",
      placeholder: "Select Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      type: "select",
      name: "verified",
      label: "Verified",
      placeholder: "Select Verification",
      options: [
        { value: true, label: "Verified" },
        { value: false, label: "Unverified" },
      ],
    },
  ];

  const fetchProducers = async (params = {}) => {
    setLoading(true);
    try {
      const res = await ProducerService.getAllProducers({ page, limit, search, ...params });
      if (res.success) setData(res.data);
    } catch (err) {
      console.error("Error fetching producers:", err);
      message.error("Failed to load producers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useDebounce((value) => {
    setSearch(value);
    setPage(1);
    fetchProducers({ search: value });
  }, 400);

  const handleDelete = async (id) => {
    try {
      const res = await ProducerService.deleteProducer(id);
      if (res.success) {
        message.success("Producer deleted successfully");
        fetchProducers();
      }
    } catch (err) {
      message.error("Failed to delete producer");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await ProducerService.getProducerById(id);
      if (res.success) {
        setEditingRecord(res.data);
        setShowModal(true);
      }
    } catch (err) {
      message.error("Error fetching producer details");
    }
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingRecord) {
        res = await ProducerService.updateProducer(editingRecord._id, values);
      } else {
        res = await ProducerService.addProducer(values);
      }

      if (res.success) {
        message.success(editingRecord ? "Producer updated" : "Producer added");
        setShowModal(false);
        setEditingRecord(null);
        fetchProducers();
      }
    } catch (err) {
      message.error("Operation failed");
    }
  };

  useEffect(() => {
    fetchProducers();
  }, []);

  return (
    <div>
     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>Producer Management</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>Manage all producers and verify their details</p>
        </div>

          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
            Add Producer
          </Button>
        
      </div>

      <GlobalTableActions
        showSearch
        onSearch={handleSearch}
        showFilter
        onFilter={() => setFilterVisible(true)}
      />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ current: page, pageSize: limit, onChange: setPage }}
      />

      <AddProducerModal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        formData={editingRecord}
        suppliers={suppliers}
      />

      <GlobalFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onSubmit={(f) => {
          fetchProducers(f);
          setFilterVisible(false);
        }}
        filters={filterConfig}
        title="Filter Producers"
      />
    </div>
  );
};

export default ProducerList;
