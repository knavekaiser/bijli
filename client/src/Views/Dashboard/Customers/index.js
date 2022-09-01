import { useState, useEffect, useContext } from "react";
import { SiteContext } from "SiteContext";
import { Table, TableActions } from "Components/elements";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { Prompt, Modal } from "Components/modal";
import s from "./customer.module.scss";
import { useFetch } from "hooks";
import { endpoints, paths } from "config";
import { useNavigate } from "react-router-dom";

import CustomerForm from "./CustomerForm";

const Customers = () => {
  const { config } = useContext(SiteContext);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [addCustomer, setAddCustomer] = useState(false);

  const navigate = useNavigate();

  const { get: getCustomers, loading } = useFetch(endpoints.customers);
  const { remove: deleteCustomer } = useFetch(endpoints.customers + "/{ID}");

  useEffect(() => {
    getCustomers().then(({ data }) => {
      if (data.success) {
        return setCustomers(data.data);
      }
    });
  }, []);
  return (
    <div className={`${s.content} grid gap-1 m-a p-1`}>
      <div className="flex">
        <h2>All Customers</h2>
        <button className="btn m-a mr-0" onClick={() => setAddCustomer(true)}>
          Add Customer
        </button>
      </div>
      <Table
        loading={loading}
        className={s.customers}
        columns={[
          { label: "Name" },
          { label: "Start Unit", className: "text-right" },
          { label: "Action" },
        ]}
      >
        {customers.map((item) => (
          <tr
            onClick={(e) => {
              if (e.target.tagName === "TD") {
                navigate(paths.bills.replace(":customerId", item._id));
              }
            }}
            style={{ cursor: "pointer" }}
            key={item._id}
          >
            <td className={s.customer}>{item.name}</td>
            <td className={`text-right ${s.net}`}>{item.startingUnit.bn()}</td>
            <TableActions
              className={s.actions}
              actions={[
                {
                  icon: <FaRegEye />,
                  label: "View",
                  callBack: () => {
                    setCustomer(item);
                    setAddCustomer(true);
                  },
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "Delete",
                  callBack: () =>
                    Prompt({
                      type: "confirmation",
                      message: `Are you sure you want to remove this customer?`,
                      callback: () => {
                        deleteCustomer(
                          {},
                          { params: { "{ID}": item._id } }
                        ).then(({ data }) => {
                          if (data.success) {
                            setCustomers((prev) =>
                              prev.filter(
                                (customer) => customer._id !== item._id
                              )
                            );
                          } else {
                            Prompt({ type: "error", message: data.message });
                          }
                        });
                      },
                    }),
                },
              ]}
            />
          </tr>
        ))}
      </Table>
      <Modal
        open={addCustomer}
        head
        label={`${customer ? "View / Update" : "Add"} Customer`}
        className={s.addCustomerFormModal}
        setOpen={() => {
          setCustomer(null);
          setAddCustomer(false);
        }}
      >
        <CustomerForm
          edit={customer}
          customers={customers}
          onSuccess={(newCustomer) => {
            if (customer) {
              setCustomers((prev) =>
                prev.map((item) =>
                  item._id === newCustomer._id ? newCustomer : item
                )
              );
              setCustomer(null);
            } else {
              setCustomers((prev) => [...prev, newCustomer]);
            }
            setAddCustomer(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Customers;
