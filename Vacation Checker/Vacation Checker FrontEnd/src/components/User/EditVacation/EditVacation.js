import React from "react";
import cls from "./EditVacation.module.css";


export default props => (
  <div className={cls.modalWrapper}>
    <form className={cls.modal} onChange={props.change} onSubmit={props.editSubmit}>
      <label htmlFor="startDate">Vacation start date</label>
      <input type="date" name="startDate" value={props.vac.startDate}/>
      <label htmlFor="endDate">Vacation end date</label>
      <input type="date" name="endDate" value={props.vac.endDate}/>
      <label htmlFor="description">Description</label>
      <textarea className={cls.description} name="description" value={props.vac.description}></textarea>
      <button type="submit" disabled={!props.valid}>Save</button>
      <button onClick={props.close}>Cancel</button>
    </form>
  </div>
);
