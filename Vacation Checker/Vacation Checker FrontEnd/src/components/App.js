import React from "react";
import { Route, Switch, NavLink } from "react-router-dom";
import Login from "./Login/Login";
import User from "./User/User";
import SignUp from "./SignUp/SignUp";
import Err404 from "./Err404/Err404";
import cls from "./App.module.css";
import config from "../config.js";

class App extends React.Component{
  state = {
    isLogged: false,
    token: undefined,
    user:{}
  }

  login(value, bool){
    this.setState(()=>({
      isLogged: true,
      token: value.token,
      user: value.user
    }));
    if(bool) localStorage.setItem("tjwt", value.token);
    sessionStorage.setItem("tjwt", value.token);
  }

  updateUser(value){
    this.setState(()=>({
      user: value.user
    }));
  }

  logout(){
    this.setState(()=>({
      isLogged: false,
      token: undefined,
      user:{}
    }))
    localStorage.clear()
    sessionStorage.clear()
  }

  componentDidMount(){
    let token = sessionStorage.getItem("tjwt") || localStorage.getItem("tjwt");
    if(!this.state.token && token){
      fetch(config.url + "/auth", {
        method: "GET",
        headers: {
          "Content-Type":"application/json",
          "auth-token": token
        }
      }).then(res => {
        if(res.status !== 200) throw Error("user not found");
        return res.json();
      })
      .then(data => {this.setState(()=>({
        user: data.user,
        isLogged: true,
        token: token
      }))})
      .catch(error => console.log(error));
    }
  }
  render(){
    return (
      <div className={cls.bg}>
      <header className={cls.header}>
        <div className={cls.logoWrapper}>
          <img className={cls.logo} src="./logo.svg" alt="logo"/></div>
        <div>
          <NavLink className={cls.links} to="/">Home</NavLink>
          {!this.state.isLogged ? (<NavLink className={cls.links} to="/signup">Sign Up</NavLink>):
          (<NavLink className={cls.links} onClick={this.logout.bind(this)} to="/">Logout</NavLink>)}
        </div>
      </header>
      <Switch>
        <Route path="/" exact render={() => (
           !this.state.isLogged ?
           <Login login={this.login.bind(this)} url={config.url}/>:
           <User {...this.state} updateUser={this.updateUser.bind(this)}/>
        )}/>
        <Route path="/signup" component={SignUp}/>
        <Route render={Err404}/>
        </Switch>
      </div>
    )
  }
}
export default App;
