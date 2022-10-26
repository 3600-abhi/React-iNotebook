import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    // Form ke andr on submit kr rhe hain to iska use krna pdega wrna page refersh ho jayega
    event.preventDefault();

    const host = "http://localhost:5000";
    const url = `${host}/api/auth/createuser`;
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      // save the auth token and redirect
      localStorage.setItem("token", json.authToken);

      // Screen Navigation ke liye useNavigation hook ka use krte hain react me
      navigate("/");
      props.showAlert("Account created succesfully", "success");

    } else {
      props.showAlert("Invalid-credentials",  "danger");
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="mb-3 mt-3">Create an account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              aria-describedby="name"
              name="name"
              onChange={handleChange}
              value={userData.name}
              minLength={1}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="email"
              name="email"
              onChange={handleChange}
              value={userData.email}
              required
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
              onChange={handleChange}
              value={userData.password}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}
