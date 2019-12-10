import React from "react";
import cls from "./SignUp.module.css";
import config from "../../config.js";

class SignUp extends React.Component {
  state ={
      user:{
        login:"",
        email:"",
        password:"",
        date:""
      },
      err:{
        loginErr: null,
        emailErr:null,
        passwordErr: null,
        dateErr: null
      },
    validation: false,
  }
  validation(e){
    let {user, err} = this.state;
      user[e.target.name]= e.target.value

      if(!user.login.match(/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/g)){
        err.loginErr = "Incorrect username"
      }else err.loginErr= null

      if(!user.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g)){
        err.emailErr = "Incorrect email"
      }else err.emailErr= null

      if(!user.password.match(/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).*$/g)){
        err.passwordErr = "Incorrect password"
      }else err.passwordErr= null

      if(user.date === "" || new Date(user.date) > new Date()){
          err.dateErr= "Incorrect date"
      }else err.dateErr= null

      if(Object.values(err).every(e => e === null)){
        this.setState(()=>({
          validation: true
        }))
      }else if (this.setState.validation){
        this.setState(()=>({
          validation: false
        }))
      }
      this.setState(()=>({
        user
      }))
    }
  signup(e){
    e.preventDefault();
    fetch(config.url + "/signup", {
       method: "POST",
       headers: {
       "Content-Type":"application/json"
       },
       body: JSON.stringify({
         login: this.state.user.login.toLowerCase(),
         email: this.state.user.email.toLowerCase(),
         pass: this.state.user.password,
         date: this.state.user.date,
       })
     }).then(res => {
       if(res.status === 400) throw Error("username exsits");
       res.json()
     })
     .then(data => this.props.history.push("/"))
     .catch(error => console.log(error))

  }

  render(){
    return (
      <div className={cls.main}>
        <form className={cls.form} onChange={ e => this.validation.call(this, e)} onSubmit={e => this.signup(e)}>
          <input type="text" name="login" placeholder="username" />
          {this.state.err.loginErr ? (<span>{this.state.err.loginErr}</span>): <span/>}
          <input type="text" name="email" placeholder="email" />
          {this.state.err.emailErr ? (<span>{this.state.err.emailErr}</span>): <span/>}
          <input type="password" name="password" placeholder="password" />
          {this.state.err.passwordErr ? (<span>{this.state.err.passwordErr}</span>): <span/>}
          <label>Employment date</label>
          <input type="date" name="date" />
          { this.state.err.dateErr ? (<span>{this.state.err.dateErr}</span>): <span/>}
          <button type="submit" className={cls.btnLogin} disabled={!this.state.validation}>Sign Up</button>
        </form>
      </div>
    );
  }
}
export default SignUp;
