import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GlobalTableActions from "components/GlobalTableActions";
import ActionButtons from "components/ActionButtons";
import BuyerService from "services/BuyerService";
import useDebounce from "utils/debouce";
import GlobalFilterModal from "components/GlobalFilterModal";
import AddBuyerModal from "./AddBuyerModal";

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

const BuyerList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

const columns = [
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
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
    title: "Company Name",
    dataIndex: "companyName",
    key: "companyName",
  },
  {
    title: "GST Number",
    dataIndex: "gstNumber",
    key: "gstNumber",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
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
    render: (text) => renderBadge(text ? "Yes" : "No", "verified"),
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

  const fetchBuyers = async (params = {}) => {
    setLoading(true);
    try {
      const res = await BuyerService.getAllBuyers({ page, limit, search, ...params });
      if (res.success) setData(res.buyers || []);
    } catch (err) {
      console.error("Error fetching buyers:", err);
      message.error("Failed to load buyers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useDebounce((value) => {
    setSearch(value);
    setPage(1);
    fetchBuyers({ search: value });
  }, 400);

  const handleDelete = async (id) => {
    try {
      const res = await BuyerService.deleteBuyer(id);
      if (res.success) {
        message.success("Buyer deleted successfully");
        fetchBuyers();
      }
    } catch {
      message.error("Failed to delete buyer");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await BuyerService.getBuyerById(id);
      if (res.success) {
        setEditingRecord(res.buyer);
        setShowModal(true);
      }
    } catch {
      message.error("Failed to fetch buyer details");
    }
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingRecord) {
        res = await BuyerService.updateBuyer(editingRecord._id, values);
      } else {
        res = await BuyerService.addBuyer(values);
      }

      if (res.success) {
        message.success(editingRecord ? "Buyer updated" : "Buyer added");
        setShowModal(false);
        setEditingRecord(null);
        fetchBuyers();
      }
    } catch {
      message.error("Operation failed");
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ margin: 0 }}>Buyer Management</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            Manage buyers, verify their profiles, and maintain contact info
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
          Add Buyer
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

      <AddBuyerModal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        formData={editingRecord}
      />

      <GlobalFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onSubmit={(f) => {
          fetchBuyers(f);
          setFilterVisible(false);
        }}
        filters={filterConfig}
        title="Filter Buyers"
      />
    </div>
  );
};

export default BuyerList;
