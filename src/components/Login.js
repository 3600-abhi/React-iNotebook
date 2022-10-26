import { useState } from "react";
import {useNavigate} from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();
  const [userCredential, setUserCredential] = useState({
    email: "",
    password: "",
  });

  const onChange = (event) => {
    setUserCredential({
      ...userCredential,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    // Form ke andr on submit kr rhe hain to iska use krna pdega wrna page refersh ho jayega
    event.preventDefault();

    const host = "http://localhost:5000";
    const url = `${host}/api/auth/login`;
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        email: userCredential.email,
        password: userCredential.password,
      }),
    });

    const json = await response.json();
    console.log(json);

    if(json.success) {
      // save the auth token and redirect
      localStorage.setItem("token", json.authToken);

      // Screen Navigation ke liye useNavigation hook ka use krte hain react me
      navigate("/");
      props.showAlert("Welcome again !!", "success");

    }
    else {
      props.showAlert("Invalid credentials", "danger");
    }

  };

  return (
    <div className="container">
      <h2 className="mb-3 mt-3">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="email"
            onChange={onChange}
            value={userCredential.email}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" name="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
            value={userCredential.password}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}
