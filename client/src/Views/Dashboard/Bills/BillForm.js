import { useState, useEffect, useContext, useCallback } from "react";
import { SiteContext } from "SiteContext";
import { useForm } from "react-hook-form";
import {
  Input,
  Textarea,
  Combobox,
  Table,
  TableActions,
  SearchField,
  Select,
  Tabs,
  moment,
} from "Components/elements";
import { useYup, useFetch } from "hooks";
import { Prompt } from "Components/modal";
import { FaPencilAlt, FaRegTrashAlt, FaTimes, FaCheck } from "react-icons/fa";
import * as yup from "yup";
import s from "./bills.module.scss";
import { useReactToPrint } from "react-to-print";
import { endpoints } from "config";
import { useParams } from "react-router-dom";

const Form = ({ edit, minUnit, maxUnit = 100000000, onSuccess }) => {
  const { user, config, setConfig } = useContext(SiteContext);
  const [err, setErr] = useState(null);
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({
    resolver: useYup(
      yup.object({
        date: yup.string().required(),
        paid: yup.string().required(),
        currentUnit: yup
          .number()
          .min(minUnit + 0.0001, `Unit must be greater than ${minUnit}`)
          .max(maxUnit - 0.0001, `Unit must be less than ${maxUnit}`)
          .required()
          .typeError("Enter a valid Number"),
      })
    ),
  });
  let { customerId } = useParams();

  const { post: saveInvoice, put: updateInvoice, loading } = useFetch(
    endpoints.bills + `/${edit?._id || ""}`
  );

  const submitForm = useCallback((values) => {
    (edit ? updateInvoice : saveInvoice)({
      ...values,
      paid: values.paid === "true",
      customer: customerId,
    }).then(({ data }) => {
      if (data.errors) {
        return Prompt({ type: "error", message: data.message });
      } else if (data.success) {
        onSuccess(data.data);
      }
    });
  }, []);

  useEffect(() => {
    reset({
      ...edit,
      date: moment(edit?.date, "YYYY-MM-DD"),
      currentUnit: edit?.unit || "",
      paid: edit?.paid.toString() || "",
    });
  }, [edit]);
  return (
    <div className={`grid gap-1 p-1 ${s.addBillForm}`}>
      {err && <p className="error">{err}</p>}
      <div className={`${s.mainForm} grid gap-1`}>
        <form
          className={`${s.mainFormWrapper} grid gap-1 all-columns`}
          onSubmit={handleSubmit(submitForm)}
        >
          <Input
            label="Date"
            type="date"
            {...register("date")}
            required
            error={errors.date}
          />

          <Input
            label="Current Unit"
            type="number"
            step="0.01"
            placeholder={`> ${minUnit}`}
            required
            {...register("currentUnit")}
            error={errors.currentUnit}
          />

          <Combobox
            label="Paid"
            name="paid"
            watch={watch}
            register={register}
            setValue={setValue}
            required
            clearErrors={clearErrors}
            options={[
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]}
            error={errors.paid}
          />

          <div className="btns">
            <button className="btn" disabled={loading}>
              {edit ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
