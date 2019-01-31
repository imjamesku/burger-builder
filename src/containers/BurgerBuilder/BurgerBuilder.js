import React from 'react'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-order'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
}

class BurgerBuilder extends React.Component {

    state = {
        ingredients: null,
        totalPrice: 4, // base price
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false,
    }

    async componentDidMount() {
        try {
            const response = await axios.get('https://burger-builder-340a7.firebaseio.com/ingredients.json')
            this.setState({ingredients: response.data})    
        } catch (error) {
            this.setState({error: true})
        }
        
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, element) => {
                return sum + element
            }, 0)

        this.setState({ purchasable: sum > 0 })
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceIncrease = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceIncrease
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients)
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = oldCount - 1
        if (oldCount <= 0) {
            return
        }
        const priceDeduction = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice - priceDeduction
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients)
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    cancelPurchaseHandler = () => {
        this.setState({ purchasing: false })
    }

    continuePurchaseHandler = async () => {
        // alert('continues')
        // this.setState({loading: true})
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'James',
        //         address: {
        //             street: 'wanan',
        //             zipCode: '201',
        //             country: 'Taiwan'
        //         },
        //         email: '123@gmail.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // try {
        //     const response = await axios.post('/orders.json', order)
        //     console.log(response);
        // } catch (error) {
        //     console.log(error);
        // } finally {
        //     this.setState({loading: false, purchasing: false})
        // }

        const queryParams = []
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryParams.join('&')
        })

    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
        }
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;
        if (this.state.loading) {
            orderSummary = <Spinner/>
        }

        let burger = this.state.error ? <p>Faild to load ingredients</p> : <Spinner/>
        if(this.state.ingredients) {
            
            orderSummary = <OrderSummary
            ingredients={this.state.ingredients}
            price={this.state.totalPrice.toFixed(2)}
            purchaseCanceled={this.cancelPurchaseHandler}
            purchaseContinued={this.continuePurchaseHandler} />

            burger = (
                <>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disableInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                    totalPrice={this.state.totalPrice} />
                </>
            )
        }

        return (
            <>
                <Modal show={this.state.purchasing} modalClosed={this.cancelPurchaseHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios)