import axios from "axios";

export const register = newUser => {
  return axios
    .post("http://127.0.0.1:8000/api/auth/register", {
      role: "technicien",
      // last_name: newUser.last_name,
      login: newUser.login,
      password: newUser.password,
    }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
       //"Access-Control-Allow-Origin": "*"
      },
    })
    .then(res => {
      console.log("Registered!");
    });
};

export const login = user => {
  return axios
    .post("http://127.0.0.1:8000/api/login", {
      login: user.email,
      password: user.password,
    })
    .then(res => {
      console.log(res.data)
      localStorage.setItem("usertoken", res.data.success.token);
      return res.data.success.token;
      
    })
    .catch(err => {
      console.log(err);
    });
};

export const logout = user => {
  return;
};
