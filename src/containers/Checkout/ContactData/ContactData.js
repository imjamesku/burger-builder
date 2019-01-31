import React, { Component } from 'react'

import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.module.css'
import axios from '../../../axios-order'

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = async (event) => {
        event.preventDefault()
        alert('continues')
        this.setState({ loading: true })
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            customer: {
                name: 'James',
                address: {
                    street: 'wanan',
                    zipCode: '201',
                    country: 'Taiwan'
                },
                email: '123@gmail.com'
            },
            deliveryMethod: 'fastest'
        }
        try {
            const response = await axios.post('/orders.json', order)
            console.log(response);
            this.setState({ loading: false })
            this.props.history.push('/')
        } catch (error) {
            console.log(error);
        } finally {

        }

    }

    render() {
        let form = (
            <form action="">
                <input className={classes.Input} type="text" name="name" placeholder="Your name" />
                <input className={classes.Input} type="text" name="email" placeholder="Your email" />
                <input className={classes.Input} type="text" name="street" placeholder="Your street" />
                <input className={classes.Input} type="text" name="postal code" placeholder="Your postal code" />
                <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
            </form>
        )
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Info</h4>
                {form}
            </div>
        )
    }
}

export default ContactData