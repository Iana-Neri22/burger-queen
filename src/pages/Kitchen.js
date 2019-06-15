import React from 'react';
// import './App.css';
import firebase from "../firebaseConfig";
import Button from "../components/Button"
import Home from "./Home"
import withFirebaseAuth from 'react-with-firebase-auth';
import {BrowserRouter as Router, Route, Redirect, Link} from 'react-router-dom';


const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

class Kitchen extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      listItem: [],
      };
    }

  // componentDidMount() {
   
  //   }

      render() {
        database.collection("orders").get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map(doc => ({ ...doc.data() }));
          this.setState({ listItem: data })
        });
        const orders = this.state.listItem;
      return <div>
            <h1>{
               orders.map((orders) =>
             orders.customerName)
            }</h1> 
        </div>

      }
  
}


export default Kitchen