import React from "react";
import cls from "./UserVacations.module.css";

export default props =>{
  return (
    <li className={cls.vacation}>
      <p>{props.index+1}</p>
      <p>{props.startDate}</p>
      <p>{props.endDate}</p>
      <p className={cls.description}>{props.description}</p>
      <div className={cls.btnWrapper}>
        <button className={cls.btnVacation} onClick={props.editHandler}>Edit</button>
        <button className={cls.btnVacation} onClick={props.deleteHandler}>Delete</button>
      </div>
    </li>
  );
};
