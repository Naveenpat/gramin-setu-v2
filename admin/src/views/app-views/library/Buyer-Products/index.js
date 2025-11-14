import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GlobalTableActions from "components/GlobalTableActions";
import ActionButtons from "components/ActionButtons";
import useDebounce from "utils/debouce";
import GlobalFilterModal from "components/GlobalFilterModal";
import ProductService from "services/productService";
import AddProductModal from "./AddChildPartModal";

const renderBadge = (text) => {
  let color =
    text === "live"
      ? "green"
      : text === "draft"
      ? "orange"
      : text === "inactive"
      ? "red"
      : "blue";
  return <Tag color={color}>{text.toUpperCase()}</Tag>;
};

const ProductList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

const columns = [
  { title: "Product Name", dataIndex: "name", key: "name" },
  { title: "Category", dataIndex: "category", key: "category" },
  {
    title: "Selling Price (₹)",
    dataIndex: "sellingPrice",
    key: "sellingPrice",
  },
  { title: "Stock", dataIndex: "stockQty", key: "stockQty" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => renderBadge(text),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <ActionButtons
        onEdit={() => handleEdit(record._id)}
        onDelete={() => handleDelete(record._id)}
        showEdit
        showDelete
      />
    ),
  },
];


  const filterConfig = [
    {
      type: "select",
      name: "category",
      label: "Category",
      placeholder: "Select Category",
      options: [
        { value: "Food", label: "Food" },
        { value: "Beverage", label: "Beverage" },
        { value: "Dairy", label: "Dairy" },
        { value: "Grain", label: "Grain" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      type: "select",
      name: "status",
      label: "Status",
      placeholder: "Select Status",
      options: [
        { value: "draft", label: "Draft" },
        { value: "live", label: "Live" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const res = await ProductService.getAllProducts({
        page,
        limit,
        search,
        ...params,
      });
      if (res.success) setData(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useDebounce((value) => {
    setSearch(value);
    setPage(1);
    fetchProducts({ search: value });
  }, 400);

  const handleDelete = async (id) => {
    try {
      const res = await ProductService.deleteProduct(id);
      if (res.success) {
        message.success("Product deleted successfully");
        fetchProducts();
      }
    } catch {
      message.error("Failed to delete product");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await ProductService.getProductById(id);
      if (res.success) {
        setEditingRecord(res.data);
        setShowModal(true);
      }
    } catch {
      message.error("Failed to fetch product details");
    }
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (editingRecord) {
        res = await ProductService.updateProduct(editingRecord._id, values);
      } else {
        res = await ProductService.createProduct(values);
      }

      if (res.success) {
        message.success(editingRecord ? "Product updated" : "Product added");
        setShowModal(false);
        setEditingRecord(null);
        fetchProducts();
      }
    } catch {
      message.error("Operation failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 style={{ margin: 0 }}>Product Management</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
            Manage your product listings and pricing
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
        >
          Add Product
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

      <AddProductModal
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
          fetchProducts(f);
          setFilterVisible(false);
        }}
        filters={filterConfig}
        title="Filter Products"
      />
    </div>
  );
};

export default ProductList;
