import React from "react";
import cls from "./VacationError.module.css";

export default props => (
  <div className={cls.err}>
    <img src="./info.svg"/>
      <p>{props.err}</p>
  </div>
);
