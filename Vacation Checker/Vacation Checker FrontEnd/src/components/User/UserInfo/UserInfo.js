import React from "react";
import cls from "./UserInfo.module.css";

export default props => (
    <div className={cls.userInfo}>
      <h2 className={cls.userInfoTitle}>User Information</h2>
      <div className={cls.userInfoItems}>
        <p>Email: {props.email}</p>
        <p>Employment date:  {props.date}</p>
        <p>Available vacation days: {props.days} </p>
        <button className={cls.btnAddVacation} onClick={props.showAddVac}>Add Vaction</button>
      </div>
    </div>
);
