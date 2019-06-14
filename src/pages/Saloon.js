import React from 'react';
import firebase from "../firebaseConfig";
import Button from "../components/Button"
import Input from "../components/Input"
import withFirebaseAuth from 'react-with-firebase-auth';
import {BrowserRouter as Router, Route, Redirect, Link} from 'react-router-dom';
import menu from '../data';
import Logo from "../components/Logo";
import TabMenu from '../components/Tab';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

class Saloon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerName: "",
      order: [],
      totalPrice: 0,
      name: ''
    };
 
  }

  orderClick = (item) => {
    const itemIndex = this.state.order.findIndex((product) => {
      return product.name === item.name;
    });
    const totalPrice = this.state.order.reduce((acc, cur) => {
      return acc + (cur.quantity * cur.price)
     }, 0);
    if (itemIndex < 0) {
      const newItem = {
        ...item,
        quantity: 1
      };
      this.setState({
        order: this.state.order.concat(newItem),
        totalPrice: totalPrice
      });
    } else {
      let newOrder = this.state.order;
      newOrder[itemIndex].quantity += 1;
      this.setState({
        order: newOrder,
        totalPrice: totalPrice
      });
    }
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value
    this.setState(newState);
  }

  clickDelete = (item) => {
    const itemIndex = this.state.order.findIndex((product) => {
      return product.name === item.name;
    });
     
    let newOrder = this.state.order;
      newOrder[itemIndex].quantity -= 1;

     const quantity = newOrder[itemIndex].quantity;
      
     if(quantity > 0) {
      this.setState({
        order: newOrder
      });

      } else {
        newOrder.splice(itemIndex, 1)
        this.setState({
          order: newOrder
        });
      } 
  }

  sendOrder = () => {
    database.collection("orders").doc().set({
      waiter: this.state.name,
      customerName: this.state.customerName,
      orderedItens: this.state.order,
      totalPrice: this.state.totalPrice,
    });
  }

  handleClick = () => {
    this.setState({
      condition: !this.state.condition
    })
  }

  render() {
    const user = firebase.auth().currentUser;
        database.collection("users").doc(user.uid).get()
          .then(doc => {
            const data = doc.data();
            const name = data.firstName;
            this.setState({ name })
          });
      
    const totalPrice = this.state.order.reduce((acc, cur) => {
     return acc + (cur.quantity * cur.price)
    }, 0);
   
    return (
      <div>
       
        <Logo />
        <div className="main-body">
          {
            <TabMenu 
              text1="Menu Principal"
              text2="Café da Manhã"
              content1= {
          <div>
            <ul className="itens-list">{
              menu.mainMenu.map((product, i) => {
              return <li key={i} 
              >
                <i class="fas fa-plus-circle" onClick={() => this.orderClick(product)}></i>
                {product.name}</li>
              })
             }
              </ul >
          </div>
          }
          content2= {
            <div>
              <ul className="itens-list">{
                menu.breakfast.map((product, i) => {
                return <li key={i}>
                  <i class="fas fa-plus-circle" onClick={() => this.orderClick(product)}></i>
                  {product.name}</li>
                })
              }
              </ul>
            </div>
            }
          />
          }
        <hr className="divide-line"></hr>
       
          <h3 className="resume">Itens comprados</h3>
          <ul className="itens-list">
            {
              this.state.order.map((product, i) =>{
                return <li key={i}> 
                <i class="fas fa-minus-circle" onClick={()=> this.clickDelete(product)}></i>
                {product.quantity} {product.name} R${product.price * product.quantity} 
              </li>})
            }
            </ul>
           
            <h3 className="resume">Total</h3>
              <p className="resume">R${totalPrice}</p>
              <Input 
                type="text" 
                value={this.state.customerName} 
                placeholder="Digite o nome do cliente"
                onChange={(e) => this.handleChange(e, "customerName")} 
              />
              <Button 
                onClick={this.sendOrder}
                text="Finalizar pedido"
              />
            </div>             
      </div>       
    );
  }
  }

export default withFirebaseAuth({firebaseAppAuth}) (Saloon);