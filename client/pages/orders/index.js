import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";

const OrderIndex = ({ orders }) => {
  const [isClient, setIsClient] = useState(false);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    setIsClient(true); // Ensures this runs only in browser
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.ticket.title.toLowerCase().includes(filterText.toLowerCase()) ||
      order.id.toLowerCase().includes(filterText.toLowerCase())
  );

  console.log("filteredOrders", filteredOrders);

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.id,
      sortable: true,
      wrap: true,
    },
    {
      name: "Ticket Title",
      selector: (row) => row.ticket.title,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`badge ${
            row.status === "complete"
              ? "bg-success"
              : row.status === "cancelled"
              ? "bg-danger"
              : "bg-warning text-dark"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Orders</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by Order ID or Title"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <CSVLink
          data={orders}
          filename="orders.csv"
          className="btn btn-outline-primary"
        >
          Download CSV
        </CSVLink>
      </div>

      {isClient && (
        <DataTable
          columns={columns}
          data={filteredOrders}
          pagination
          highlightOnHover
          striped
          responsive
          persistTableHead
          defaultSortFieldId={1}
        />
      )}
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
