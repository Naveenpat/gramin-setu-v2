import React, { useEffect, useState } from "react";
import { Table, Button, message, Tag, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ActionButtons from "components/ActionButtons";
import AddCurrencyModal from "./AddCurrencyModal";
import CurrencyService from "services/CurrencyService";

import { useDispatch, useSelector } from "react-redux";
import {
  addCurrency,
  updateCurrency,
  deleteCurrency
} from "store/slices/currencySlice";
import { hasPermission } from "utils/auth";

const CurrencyList = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await CurrencyService.getAllCurrencies();
      setCurrencies(response.data || []);
    } catch (err) {
      message.error("Failed to fetch currencies");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await dispatch(updateCurrency({
          id: editingRecord._id,
          data: values
        })).unwrap();
        message.success("Currency updated successfully");
      } else {
        await dispatch(addCurrency(values)).unwrap();
        message.success("Currency created successfully");
      }
      setShowAddModal(false);
      setEditingRecord(null);
      fetchCurrencies(); // Refresh the list
    } catch (err) {
      message.error(err?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCurrency(id)).unwrap();
      message.success("Currency deleted successfully");
      fetchCurrencies(); // Refresh the list
    } catch (err) {
      message.error("Failed to delete currency");
    }
  };

  const columns = [
    {
      title: "Currency Code",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Currency Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{symbol}</span>,
    },
    {
      title: "Exchange Rate",
      dataIndex: "exchangeRate",
      key: "exchangeRate",
      render: (rate) => rate ? `1 USD = ${rate}` : 'N/A',
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <ActionButtons
          onEdit={() => {
            setEditingRecord(record);
            setShowAddModal(true);
          }}
          onDelete={() => handleDelete(record._id)}
          showEdit={hasPermission('settings.currencyManagment:edit')}
          showDelete={hasPermission('settings.currencyManagment:delete')}
          showDeleteConfirm
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Currency Management</h2>
        {hasPermission('settings.currencyManagment:add') && (<Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddModal(true)}
        >
          Add Currency
        </Button>)}


      </div>

      <Table
        columns={columns}
        dataSource={currencies}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 800 }}
      />

      <AddCurrencyModal
        visible={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        formData={editingRecord}
      />
    </div>
  );
};

export default CurrencyList;