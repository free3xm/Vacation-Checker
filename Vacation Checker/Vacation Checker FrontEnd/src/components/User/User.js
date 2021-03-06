import React from "react";
import cls from "./User.module.css";
import UserVacations from "./UserVacations/UserVacations";
import UserInfo from "./UserInfo/UserInfo";
import AddVaction from "./AddVaction/AddVaction";
import VacationError from "./VacationError/VacationError";
import EditVacation from "./EditVacation/EditVacation";
import DeleteVacation from "./DeleteVacation/DeleteVacation";
import config from "../../config.js";

class User extends React.Component{
  state = {
      daysFromHiring: Math.floor((new Date() - new Date(this.props.user.date))/2592000000.0000005*1.75),
      vacation:{
        startDate:"",
        endDate:"",
        days:0,
        description:""
      },
      valid:false,
      add: {
        show: false
      },
      edit:{
        show: false,
        index: null,
        err: null,
        valid: true
      },
      delete:{
        index: null,
        show:false
      },
      err:null,
      filterOption:"",
      user: this.props.user
    };

  componentDidMount(){
    this.updateDays();
  }

  getWorkingDays(start, end){
    let wDays = 0;
    while(start <= end){
      if(start.getDay() !== 0 && start.getDay() !== 6 ){
        wDays++;
      }
      start.setDate(start.getDate()+1);
    }
    return wDays
  }
  updateAll(method, data){
    this.props.updateUser(data);
    this.updateDays();
    let state = this.state;
    state[method].show = false;
    state.user = this.props.user;
    this.setState(()=>state);
  }
  updateDays(){
    let spentDays = this.props.user.vacations.reduce((sum, curr) => sum + curr.days,0);
    this.setState(()=>({
      daysOfVacation: this.state.daysFromHiring - spentDays
    }));
  }

  checkDate(event){
    let vacation = this.state.vacation;
    vacation[event.target.name]=event.target.value;

    this.setState(()=>({
      vacation
    }));

    vacation = this.state.vacation;

    if(vacation.startDate !== "" && vacation.endDate !== ""){
      const startDate = new Date(vacation.startDate),
            endDate = new Date(vacation.endDate);

      if(startDate <= endDate){
        if(startDate > new Date(this.state.user.date)){
          let wDays = this.getWorkingDays(startDate, endDate);

          if(wDays <= this.state.daysOfVacation){
            let state = this.state;
            state.valid = true;
            state.err = null;
            state.vacation.days = wDays;
            this.setState(()=>state);

          }else{
            this.setState(()=>({
              err: "The number of working days may not exceed the number of vacation days.",
              valid:  false
            }));
          }
        }else{
          this.setState(()=>({
            err: "The start date of vacation cannot be less than the employment date",
            valid:  false
          }));
        }
      }else{
        this.setState(() => ({
           valid: false,
           err:"The end date cannot be less than the starting date of the vacation."
         }));
      }
    }
  }

  showAddVacavtion(){
    let state = this.state
    state.add.show = true
      this.setState(()=> ({
        state
      }));
  }

  submitVacation(event){
    event.preventDefault();
    if(this.state.valid){
      fetch(config.url+"/addvacation",{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "auth-token": this.props.token
        },
        body:JSON.stringify({
          vacation:  this.state.vacation
        })
      }).then(res => res.json())
      .then(data => this.updateAll("add", data))
      .catch(err => this.setState(()=>({
        err
      })));
    }
  }

  vacationHandler(i,prop, event){
    let state = this.state;
    state[prop].show = true;
    state[prop].index = i;
    for(let key in state.user.vacations[i]){
      state.vacation[key] = state.user.vacations[i][key]
    }
    this.setState(()=>state)
  }

  editVacationHandler(event){
    let state = this.state;
      state.vacation[event.target.name] = event.target.value;
      this.setState(()=>state)
      state = this.state;

      let startDate = new Date(state.vacation.startDate),
          endDate = new Date(state.vacation.endDate);

    if(state.vacation.startDate !== "" && state.vacation.endDate !== "" &&
         startDate <= endDate){
      let wDays = this.getWorkingDays(startDate, endDate);

      if(this.state.daysOfVacation + state.user.vacations[this.state.edit.index].days >= wDays ){
       state.edit.valid = true;
       state.vacation.days = wDays;
       this.setState(()=>state)
     }else{
       state.edit.valid = false
       this.setState(()=>state)
     }
    }else {
      state.edit.valid = false
      this.setState(()=>state)
    }
  }

  editVacSubmit(event){
    if(this.state.edit.valid){
      event.preventDefault();
      fetch(config.url + "/edit",{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "auth-token": this.props.token
        },
        body:JSON.stringify({
          vacation:  this.state.vacation,
          index: this.state.edit.index
        })
      }).then(res => res.json())
      .then(data => this.updateAll("edit", data))
      .catch(err => this.setState(()=>({
        err
      })));
    }
  }

  submitDelete(event){
    event.preventDefault();
    fetch(config.url + "/deletevaction",{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json",
        "auth-token": this.props.token
      },
      body:JSON.stringify({
        index: this.state.delete.index
      })
    }).then(res => res.json())
    .then(data => this.updateAll("delete", data))
    .catch(err => this.setState(()=>({
      err
    })));
  }


  closeBtn(){
    let state = this.state;
    state.add.show = false;
    state.vacation.startDate="";
    state.vacation.endDate="";
    state.vacation.description="";
    state.err=null;
    state.valid=false;
    state.edit.show = false;
    state.edit.valid = true;
    state.delete.show = false;

    this.setState(()=>state);
  }

  filterHandler(event){
    let filterOption = event.target.value
    if(filterOption !== "all"){
      this.setState(()=>({
        filterOption
      }))
    }else {
      this.setState(() => ({
        filterOption: ""
      }))
    }
  }
  closeErr(){
    this.setState(()=>({
      err:null
    }))
  }
  render(){
    return (
      <div className={cls.userWrapper}>
      {this.state.edit.show ? <EditVacation vac={this.state.vacation}
                                            change={this.editVacationHandler.bind(this)}
                                            editSubmit={this.editVacSubmit.bind(this)}
                                            valid={this.state.edit.valid}
                                            close={this.closeBtn.bind(this)}/>
                                            : null}
      {this.state.delete.show ? <DeleteVacation subDelete={this.submitDelete.bind(this)}
                                                close={this.closeBtn.bind(this)}/> : null}

        <div className={cls.userHeader}>
          <span>User: {this.state.user.name[0].toUpperCase() + this.state.user.name.slice(1)}</span>
          {this.state.err && this.state.add.show ? <VacationError err={this.state.err}
                                                                  closeErr={this.closeErr.bind(this)}/>
                                                                  : null}
        </div>
        <div className={cls.userMain}>
          {!this.state.add.show ?
            <UserInfo email={this.state.user.email}
                    date={this.state.user.date}
                    days={this.state.daysOfVacation}
                    showAddVac={this.showAddVacavtion.bind(this)}/>
                    :
            <AddVaction addDate={this.checkDate.bind(this)}
                      valid={this.state.valid}
                      closeAddVac={this.closeBtn.bind(this)}
                      subVac={this.submitVacation.bind(this)}
                      err={this.state.err}/>}

              <div className={cls.listVacationsWrapper}>
                <div className={cls.listVacationsHeader}>
                  <ul className={cls.vacationsInfoWrapper}>
                    <li>№</li>
                    <li>Start date</li>
                    <li>End date</li>
                    <li>Description</li>
                    <li>
                      <select onChange={this.filterHandler.bind(this)} className={cls.filter}>
                        <option value="all">All</option>
                        {Array.from(new Set(this.state.user.vacations.map(e => e.startDate.slice(0,4)))).map((e,i) => <option key={i} value={e}>{e}</option>)}
                      </select>
                    </li>
                  </ul>
                </div>
                <ul className={cls.listVacations}>
                {this.state.user.vacations.map((e,i) => !this.state.filterOption ||this.state.filterOption === e.startDate.slice(0,4) ? (<UserVacations key={i}
                                 index={i}
                                 startDate={e.startDate}
                                 endDate={e.endDate}
                                 description={e.description}
                                 editHandler={this.vacationHandler.bind(this, i, "edit")}
                                 deleteHandler={this.vacationHandler.bind(this, i, "delete")}
                                 />)
                                 :
                                 null
                               )}
                </ul>
              </div>
        </div>
      </div>
    );
  }
}
export default User;
