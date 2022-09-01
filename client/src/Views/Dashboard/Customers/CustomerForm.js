import { useState, useEffect, useContext, useRef } from "react";
import { SiteContext } from "SiteContext";
import { useForm } from "react-hook-form";
import {
  Input,
  Textarea,
  Combobox,
  Table,
  TableActions,
  SearchField,
  moment,
} from "Components/elements";
import { useYup, useFetch } from "hooks";
import { Prompt } from "Components/modal";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import * as yup from "yup";
import s from "./customer.module.scss";
import { endpoints } from "config";

const mainSchema = yup.object({
  name: yup.string().required(),
  phone: yup.string().required(),
  address: yup.string(),
  startingUnit: yup.number().required().typeError("Enter a valid Number"),
});

const Detail = ({ label, value, className }) => {
  return (
    <p className={`${s.detail} ${className || ""}`}>
      <span className={s.label}>{label}:</span>{" "}
      <span className={s.value}>{value}</span>
    </p>
  );
};

const Form = ({ edit, customers, onSuccess }) => {
  const { user, config } = useContext(SiteContext);
  const [editItem, setEditItem] = useState(null);
  const [err, setErr] = useState(null);

  return (
    <div className={`grid gap-1 p-1 ${s.addCustomerForm}`}>
      {err && <p className="error">{err}</p>}

      <MainForm
        disabled={editItem}
        edit={edit}
        customers={customers}
        setErr={setErr}
        onSuccess={onSuccess}
      />
    </div>
  );
};

const MainForm = ({ disabled, edit, customers, setErr, onSuccess }) => {
  const { config, setConfig } = useContext(SiteContext);
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: useYup(mainSchema),
  });

  const { post: saveInvoice, put: updateInvoice, loading } = useFetch(
    endpoints.customers + `/${edit?._id || ""}`
  );

  useEffect(() => {
    reset({
      ...edit,
      date: moment(edit?.date, "YYYY-MM-DD"),
      customerName: edit?.customer?.name || "",
      customerDetail: edit?.customer?.detail || "",
    });
  }, [edit]);
  return (
    <form
      onSubmit={handleSubmit((values) => {
        (edit ? updateInvoice : saveInvoice)({
          ...values,
        }).then(({ data }) => {
          if (data.errors) {
            return Prompt({ type: "error", message: data.message });
          } else if (data.success) {
            onSuccess(data.data);
          }
        });
      })}
      className={`${s.mainForm} grid gap-1`}
    >
      <Input
        label="Name"
        type="text"
        required
        {...register("name")}
        error={errors.name}
      />

      <Input
        label="Phone Number"
        type="phone"
        {...register("phone")}
        error={errors.phone}
      />

      <Input
        label="Address"
        type="address"
        {...register("address")}
        error={errors.address}
      />

      <Input
        label="Starting Unit"
        type="number"
        required
        {...register("startingUnit")}
        error={errors.startingUnit}
      />

      <div className="btns">
        {
          //   <button
          //   type="button"
          //   onClick={() => setViewOnly(true)}
          //   className="btn"
          //   disabled={disabled || loading}
          // >
          //   Cancel
          // </button>
        }
        <button className="btn" disabled={disabled || loading}>
          {edit ? "Update" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default Form;
