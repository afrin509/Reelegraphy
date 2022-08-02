import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../REELS-START/AuthContext";
import Signup from "../REELS-START/Signup";
import App from '../App';

import { useLocation } from 'react-router-dom';

import { Container, Grid, Paper, makeStyles } from "@material-ui/core";
// import { patch } from 'request';
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";


// After this, we can use the .push() method to redirect to any route we want.
function GridContainer(props) {
  // let { signup } = useContext(AuthContext);

  // classes
//   let path = props.history;
  let useStyles = makeStyles({
    size: {
      height: "20vh",
      backgroundColor: "lightgray",
    },
    color: {
      color: "lightgreen",
    },
  });

  let nijamhistory= useHistory();
  
    let history = useLocation();
    console.log("A",history)
  

  // alert(App());
  let classes = useStyles();
  return (
    <div>
      <Container>
        <Grid container spacing={5}>
          <Grid item xs={5} sm={3} md={5} lg={10}>
            <Paper className={[classes.size, classes.color]}>Hello</Paper>
          </Grid>
          <Grid item xs={5} sm={3} md={5} lg={2}>
            <Paper className={classes.size}>Hello</Paper>
          </Grid>
          <Grid item xs={5} sm={6} md={2}>
            <Paper className={classes.size}>Hello</Paper>
          </Grid>
        </Grid>
        <form>
          <center>
            <input type="email" placeholder="Enter Email"></input>
            <input type="password" placeholder="Password"></input>
            {/* { <Link to='https://www.google.com/' >Forgot Password</Link>} */}
            <Button
              variant="outlined"
              color="primary"
              href="https://www.google.com/"
            >
              Forgot Password?
            </Button>

            {/* <Button href={path.push("/feed")}>Login</Button> */}
            <span>Don't have an account?</span>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {

// custom hook to get the current pathname in React
  // alert(history);
//  nijamhistory.push("/signup")
            //    <Signup></Signup>
              }}
            >
              Sign up
            </Button>
          </center>
        </form>
      </Container>
    </div>
  );
}
export default GridContainer;
