import { useState, useEffect, useContext, useRef } from "react";
import { SiteContext } from "SiteContext";
import { Table, TableActions, Moment } from "Components/elements";
import { FaRegEye, FaPrint, FaRegTrashAlt } from "react-icons/fa";
import { Prompt, Modal } from "Components/modal";
import { Link } from "react-router-dom";
import s from "./bills.module.scss";
import { useFetch } from "hooks";
import { endpoints, paths } from "config";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import BillForm from "./BillForm";
import PrintBill from "./printInvoice";

const Bills = () => {
  const { config, user } = useContext(SiteContext);
  const [bills, setBills] = useState([]);
  const [bill, setBill] = useState(null);
  const [addBill, setAddBill] = useState(false);
  const [customer, setCustomer] = useState(null);
  const { customerId } = useParams();

  const { get: getCustomer } = useFetch(endpoints.customers + `/${customerId}`);
  const { get: getBills, loading } = useFetch(endpoints.bills);
  const { remove: deleteBill } = useFetch(endpoints.bills + "/{ID}");

  useEffect(() => {
    getCustomer().then(({ data, error }) => {
      if (error) {
        return Prompt({
          type: "error",
          message: error.message || error,
        });
      }
      if (data.success) {
        return setCustomer(data.data);
      }
    });
    getBills({}, { query: { customer: customerId } }).then(
      ({ data, error }) => {
        if (error) {
          return Prompt({
            type: "error",
            message: error.message || error,
          });
        }
        if (data.success) {
          return setBills(data.data);
        }
      }
    );
  }, []);

  const printRef = useRef();
  const handlePrint = useReactToPrint({ content: () => printRef.current });

  return (
    <div className={`${s.content} grid gap-1 m-a p-1`}>
      <div className="flex">
        <Link to={paths.customers}>
          <h2>Cusomters</h2>
        </Link>{" "}
        <h2>/</h2> <h2>Bills</h2>
        <button className="btn m-a mr-0" onClick={() => setAddBill(true)}>
          Add Bill
        </button>
      </div>
      <Table
        loading={loading}
        className={s.bills}
        columns={[
          { label: "Date" },
          { label: "Unit", className: "text-right" },
          { label: "Usage", className: "text-right" },
          { label: "Amount", className: "text-right" },
          { label: "Paid" },
          { label: "Action" },
        ]}
      >
        {bills.map((item, i) => (
          <tr key={item._id}>
            <td className={s.date}>
              <Moment format="DD-MM-YYYY">{item.date}</Moment>
            </td>
            <td className={`text-right`}>{item.unit.fix(2).bn()}</td>
            <td className={`text-right`}>
              {(item.unit - (bills[i - 1]?.unit || customer?.startingUnit || 0))
                .fix(2)
                .bn()}
            </td>
            <td className={`text-right`}>
              {(
                (item.unit -
                  (bills[i - 1]?.unit || customer?.startingUnit || 0)) *
                  config.unitCharge || 0
              ).bn()}
            </td>
            <td>{item.paid ? "Yes" : "No"}</td>
            <TableActions
              className={s.actions}
              actions={[
                {
                  icon: <FaRegEye />,
                  label: "View",
                  callBack: () => {
                    setBill(item);
                    setAddBill(true);
                  },
                },
                {
                  icon: <FaPrint />,
                  label: "Print",
                  callBack: () => {
                    setBill(item);
                    setTimeout(() => handlePrint(), 20);
                    setTimeout(() => setBill(null), 1000);
                  },
                },
                {
                  icon: <FaRegTrashAlt />,
                  label: "Delete",
                  callBack: () =>
                    Prompt({
                      type: "confirmation",
                      message: `Are you sure you want to remove this bill?`,
                      callback: () => {
                        deleteBill({}, { params: { "{ID}": item._id } }).then(
                          ({ data }) => {
                            if (data.success) {
                              setBills((prev) =>
                                prev.filter((bill) => bill._id !== item._id)
                              );
                            } else {
                              Prompt({ type: "error", message: data.message });
                            }
                          }
                        );
                      },
                    }),
                },
              ]}
            />
          </tr>
        ))}
      </Table>
      <Modal
        open={addBill}
        head
        label={`${bill ? "View / Update" : "Add"} Bill`}
        className={s.addBillFormModal}
        setOpen={() => {
          setBill(null);
          setAddBill(false);
        }}
      >
        <BillForm
          edit={bill}
          bills={bills}
          minUnit={
            (bill
              ? bills[bills.findIndex((item) => item._id === bill._id) - 1]
                  ?.unit
              : bills[bills.length - 1]?.unit) || customer?.startingUnit
          }
          maxUnit={
            bill
              ? bills[bills.findIndex((item) => item._id === bill?._id) + 1]
                  ?.unit
              : undefined
          }
          onSuccess={(newBill) => {
            if (bill) {
              setBills((prev) =>
                prev.map((item) => (item._id === newBill._id ? newBill : item))
              );
              setBill(null);
            } else {
              setBills((prev) => [...prev, newBill]);
            }
            setAddBill(false);
          }}
        />
      </Modal>

      {bill && (
        <div style={{ display: "none" }}>
          <PrintBill
            ref={printRef}
            bill={bill}
            user={user}
            pastUnit={
              bills[bills.findIndex((item) => item._id === bill._id) - 1]
                ?.unit || customer?.startingUnit
            }
            customer={customer}
          />
        </div>
      )}
    </div>
  );
};

export default Bills;
