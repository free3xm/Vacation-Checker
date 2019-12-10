import React from 'react';
import { NavLink } from "react-router-dom";
import cls from "./Login.module.css";

class Login extends React.Component {
 state = {
    err: null,
  }
  checkUser(event){
    event.preventDefault();
    const login = event.target.login.value,
          pass = event.target.password.value,
          remeber = event.target.remeber.checked;
      fetch(this.props.url, {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          login: login.toLowerCase(),
          pass: pass
        })
      }).then(res => {
        if(res.status !== 200) throw  Error("user not found");
        return res.json();
      })
      .then(data => this.props.login(data, remeber))
      .catch(error => this.setState({
        err: error.message
      }));
  }
  render(){
    return (
      <div className={cls.main}>
        <form className={cls.form} onSubmit={this.checkUser.bind(this)}>
          <input type="text" placeholder="username" name="login"/>
          <input type="password" placeholder="password" name="password"/>
          <div className={cls.checkboxWrapper}>
            <label htmlFor="remeberMe">Remeber Me</label>
            <input type="checkbox" name="remeber" id="remeberMe"/>
          </div>
          <NavLink className={cls.forgotPass} to="/">Forgot password</NavLink>
          <button type="submit" className={cls.btnLogin}>Sign In</button>
          {this.state.err ? <span>{this.state.err}</span> : <span/>}
        </form>
      </div>
    );
  }
}

export default Login;
