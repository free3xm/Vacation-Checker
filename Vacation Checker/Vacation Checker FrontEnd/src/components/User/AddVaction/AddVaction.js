import React from "react";
import cls from "./AddVaction.module.css";

export default props => {
  return (
    <div className={cls.main}>
       <form onSubmit={props.subVac} onChange={props.addDate}>
         <h2>Add vacation</h2>
         <button className={cls.btnClose} onClick={props.closeAddVac}>X</button>
         <div>
           <label htmlFor="startDate">Vacation start date</label>
           <input type="date" name="startDate" />
         </div>
         <div>
           <label htmlFor="endDate">Vacation end date</label>
           <input type="date" name="endDate"/>
         </div>
         <div>
           <label htmlFor="description">Description</label>
           <textarea name="description" className={cls.description} ></textarea>
         </div>
         <button type="submit" disabled={!props.valid} className={cls.btnSubmitVac}>Add</button>
       </form>
    </div>
  );
};
