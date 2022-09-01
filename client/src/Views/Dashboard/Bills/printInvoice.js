import { useRef, forwardRef, useContext, useEffect, useState } from "react";
import { SiteContext } from "SiteContext";
import { Moment } from "Components/elements";

import { Table, TableActions, moment } from "Components/elements";

import s from "./bills.module.scss";

const Detail = ({ label, value }) => {
  return (
    <p className={s.detail}>
      <span className={s.label}>{label}</span>{" "}
      <span className={s.value}>{value}</span>
    </p>
  );
};

const PrintInvoice = forwardRef(({ bill, user, customer, pastUnit }, ref) => {
  const { config } = useContext(SiteContext);
  const usage = bill.unit - pastUnit;
  return (
    <div className={s.print} ref={ref}>
      <header>
        <h4>{customer.name}</h4>
        <p>
          <Moment format="DD-MM-YYYY">{bill.date}</Moment>
        </p>
      </header>

      <div className={s.billDetail}>
        <Detail label="বর্তমান" value={bill.unit.bn()} />
        <Detail label="সাবেক" value={`-${pastUnit.bn()}`} />
        <hr />
        <Detail label="=" value={usage.bn()} />
        <Detail
          label="ব্যবহৃত ইউনিট"
          value={`${usage.bn()} x ${config.unitCharge.bn()}`}
        />
        <hr />
        <Detail label="মোট বিল" value={(usage * config.unitCharge).bn()} />
      </div>
    </div>
  );
});

export default PrintInvoice;
