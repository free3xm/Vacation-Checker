import React from "react";
import { Route, Switch, NavLink } from "react-router-dom";
import Login from "./Login/Login";
import User from "./User/User";
import SignUp from "./SignUp/SignUp";
import Err404 from "./Err404/Err404";
import cls from "./App.module.css";

class App extends React.Component{
  state = {
    isLogged: false,
    token: undefined,
    user:{},
    url:"http://localhost:3001"
  }

  login(value){
    this.setState(()=>({
      isLogged: true,
      token: value.token,
      user: value.user
    }));
    sessionStorage.setItem("tjwt", value.token);
  }

  updateUser(value){
    console.log(value.user)
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
    sessionStorage.clear()
  }

  componentDidMount(){
    let token = sessionStorage.getItem("tjwt")
    if(!this.state.token && token){
      fetch(this.state.url, {
        method: "GET",
        headers: {
          "Content-Type":"application/json",
          "auth-token": token
        }
      }).then(res => {
        if(res.status !== 200) throw Error("user not found");
        console.log(res)
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
    console.log(this.state.user)
    return (
      <div className={cls.bg}>
      <header className={cls.header}>
        <div>Hello, on this site you can check your vacation.</div>
        <div>
          <NavLink className={cls.links} to="/">Home</NavLink>
          {!this.state.isLogged ? (<NavLink className={cls.links} to="/signup">Sign Up</NavLink>):
          (<NavLink className={cls.links} onClick={this.logout.bind(this)} to="/">Logout</NavLink>)}
        </div>
      </header>
      <Switch>
        <Route path="/" exact render={() => (
           !this.state.isLogged ?
           <Login login={this.login.bind(this)} url={this.state.url}/>:
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
