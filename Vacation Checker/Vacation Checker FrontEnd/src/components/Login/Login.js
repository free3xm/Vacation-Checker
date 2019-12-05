import React from 'react';
import cls from "./Login.module.css";

class Login extends React.Component {
 state = {
    err: null,
  }
  checkUser(event){
    event.preventDefault();
    const login = event.target.login.value,
          pass = event.target.password.value;
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
        console.log(res)
        return res.json();
      })
      .then(data => this.props.login(data))
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
          <button type="submit" className={cls.btnLogin}>Sign In</button>
          {this.state.err ? <span>{this.state.err}</span> : <span/>}
        </form>
      </div>
    );
  }
}

export default Login;
