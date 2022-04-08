import "./App.css";
// import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import app from "./firebase.init";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //name fill blur
  const handleNameBlur = (event) => {
    setName(event.target.value);
  };

  // email fill blur
  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };

  //password fill blur
  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  };

  //Register change
  const handleRegisteredChange = (event) => {
    // console.log(event.target.checked);
    setRegistered(event.target.checked);
  };

  //form submit
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    // test password by regular expression! jodi na thake
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError("Password should contain at least one special character.");
      return;
    }
    setValidated(true);
    setError("");
    if (registered) {
      // console.log(email, password);
      //sign in by email, password
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          console.log("login ok");
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    } else {
      //create email, password
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          setEmail("");
          setPassword("");
          console.log(user);
          verifyEmail();
          setUserName();
        })
        .catch((error) => {
          setError(error.message);
          console.error(error);
        });
    }

    event.preventDefault();
  };

  //reset password
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("sent email");
    });
  };

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log("updating name");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // varify email
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email verification sent.");
    });
  };

  return (
    <div className="App">
      <div className="registration w-50 mx-auto mt-2">
        <h2 className="text-primary">
          Please {registered ? "Login" : "Register"}!!
        </h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {!registered && (
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                onBlur={handleNameBlur}
                type="text"
                placeholder="Your Name"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleRegisteredChange}
              type="checkbox"
              label="Already registered?"
            />
          </Form.Group>
          {/* <p className="text-success">{"Success"}</p> */}
          <p className="text-danger">{error}</p>
          <Button onClick={handlePasswordReset} variant="link">
            Forget Password?
          </Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? "Login" : "Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
