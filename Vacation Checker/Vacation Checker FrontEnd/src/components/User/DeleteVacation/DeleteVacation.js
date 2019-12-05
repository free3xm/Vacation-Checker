import React from "react";
import cls from "./DeleteVacation.module.css";

export default props => (
  <div className={cls.modalWrapper}>
    <form onSubmit={props.subDelete} className={cls.modal}>
      <h2>Delete this vacation?</h2>
      <div className={cls.btnWrapper}>
        <button type="Submit">OK</button>
        <button onClick={props.close}>Cancel</button>
      </div>
    </form>
  </div>
)
