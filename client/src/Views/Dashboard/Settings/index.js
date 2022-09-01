import { useContext, useEffect, useState, useRef } from "react";
import { SiteContext } from "SiteContext";
import { useForm } from "react-hook-form";
import {
  Input,
  Textarea,
  FileInput,
  Table,
  TableActions,
  Tabs,
  CustomRadio,
  Combobox,
} from "Components/elements";
import * as yup from "yup";
import s from "./settings.module.scss";
import { useYup, useFetch } from "hooks";
import { FaPencilAlt, FaRegTrashAlt, FaTimes } from "react-icons/fa";
import { Prompt, Modal } from "Components/modal";
import { paths, endpoints } from "config";
import { Routes, Route } from "react-router-dom";

const businessInformationSchema = yup.object({
  name: yup.string().required(),
  phone: yup.string().required(),
  // email: yup.string().required(),
  // address: yup.string().required(),
});

const Settings = () => {
  return (
    <div className={s.container}>
      <Tabs
        tabs={[
          { label: "Profile", path: "profile" },
          { label: "Configurations", path: "config" },
        ]}
      />
      <Routes>
        <Route
          path={paths.settings.profile}
          element={<BusinessInformation />}
        />
        <Route path={paths.settings.config} element={<Config />} />
      </Routes>
    </div>
  );
};

const BusinessInformation = () => {
  const { user, setUser } = useContext(SiteContext);
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: useYup(businessInformationSchema),
  });
  const logo = watch("logo");
  const { put: updateOwnerDetails, loading } = useFetch(endpoints.profile);
  useEffect(() => {
    reset({
      logo: user.logo ? [user.logo] : [],
      name: user.name || "",
      motto: user.motto || "",
      phone: user.phone || "",
      email: user.email || "",
      address: user.address || "",
      gstin: user.gstin || "",
      pan: user.pan || "",
      ifsc: user.ifsc || "",
    });
  }, [user]);
  return (
    <form
      className="grid gap-1"
      onSubmit={handleSubmit((values) => {
        let logo = values.logo[0];

        const formData = new FormData();

        if (logo?.type) {
          formData.append(`logo`, logo);
        } else if (!logo) {
          formData.append(`logo`, "");
        }

        formData.append(`name`, values.name);
        formData.append(`motto`, values.motto);
        formData.append(`phone`, values.phone);
        formData.append(`email`, values.email);
        formData.append(`address`, values.address);
        formData.append(`gstin`, values.gstin);
        formData.append(`pan`, values.pan);
        formData.append(`ifsc`, values.ifsc);

        updateOwnerDetails(formData).then(({ data }) => {
          if (data.success) {
            setUser(data.data);
            Prompt({
              type: "information",
              message: "Updates have been saved.",
            });
          } else if (data.errors) {
            Prompt({
              type: "error",
              message: data.message,
            });
          }
        });
      })}
    >
      <h3>Profile</h3>
      <FileInput
        thumbnail
        label="Logo"
        prefill={logo}
        onChange={(files) => {
          setValue("logo", files);
        }}
      />
      <Input label="Name" {...register("name")} error={errors.name} />
      <Input label="Phone" {...register("phone")} error={errors.phone} />
      <Input label="Email" {...register("email")} error={errors.email} />
      <Textarea
        label="Address"
        {...register("address")}
        error={errors.address}
      />

      <button className="btn" disabled={loading}>
        Save Changes
      </button>
    </form>
  );
};

const configSchema = yup.object({
  unitCharge: yup
    .number()
    .min(1, "Unit charge can not be less than 1")
    .required()
    .typeError("Enter a valid number"),
});
const Config = () => {
  const { config, setConfig } = useContext(SiteContext);
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: useYup(configSchema),
  });

  const { get: getConfig, put: updateConfig, loading } = useFetch(
    endpoints.userConfig
  );

  useEffect(() => {
    if (config) {
      reset({
        unitCharge: config.unitCharge,
        numberSeparator: config?.numberSeparator,
      });
    }
  }, [config]);

  useEffect(() => {
    getConfig().then(({ data }) => {
      if (data.success) {
        setConfig(data.data);
      } else if (data.errors) {
        Prompt({
          type: "error",
          message: data.message,
        });
      }
    });
  }, []);

  return (
    <form
      className="grid gap-1"
      onSubmit={handleSubmit((values) => {
        updateConfig({
          unitCharge: values.unitCharge,
          numberSeparator: values.numberSeparator,
        }).then(({ data }) => {
          if (data.success) {
            setConfig(data.data);
            Prompt({
              type: "information",
              message: "Updates have been saved.",
            });
          } else {
            Prompt({
              type: "error",
              message: data.message,
            });
          }
        });
      })}
    >
      <Input
        label="Unit Charge"
        {...register("unitCharge")}
        error={errors.unitCharge}
      />

      <button className="btn" disabled={loading}>
        Save Changes
      </button>
    </form>
  );
};

export default Settings;
