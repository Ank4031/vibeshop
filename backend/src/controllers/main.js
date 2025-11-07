import  ApiError  from "../utilities/apierror.js";
import  ApiResponce  from "../utilities/apiresponse.js";
import AsyncHandler from "../utilities/asynchandler.js";
import product from "../models/product.js";
import CartItem from "../models/cart.js";

const GetProducts = AsyncHandler(async(req,res)=>{
    console.log("fetching products...");
    
    const Products = await product.find().limit(10)
    res
    .status(200)
    .json(new ApiResponce(200,Products,"products fetched"))
})

const AddNewProduct = AsyncHandler(async(req,res)=>{
    const {name, price, description, quantity} = req.body
    const newProduct = await product.create({
        name,
        price,
        description,
        quantity
    })

    if(!newProduct){
        throw new ApiError(500,"unable to create product")
    }
    res
    .status(201)
    .json(new ApiResponce(201,newProduct,"product created successfully"))
})

const AddToCart = AsyncHandler(async(req,res)=>{
    const {productId, qty} = req.body

    const Product = product.findById(productId)
    if(!Product){
        throw new ApiError(400,"no such product is found")
    }

    const cartItem = CartItem.create({
        product: productId,
        quantity: qty
    })

    res
    .status(201)
    .json(new ApiResponce(201,cartItem,"product added to cart"))
    
})

const RemoveFromCart = AsyncHandler(async(req,res)=>{
    console.log("removing item from cart...");
    
    const {id} = req.params

    const cartItem = await CartItem.deleteOne({_id:id})
    if(!cartItem){
        throw new ApiError(400,"no such cart item is found")
    }
    res
    .status(200)
    .json(new ApiResponce(200,cartItem,"item removed from cart"))
})

const EmptyCart = AsyncHandler(async(req,res)=>{
    console.log("emptying cart...");
    await CartItem.deleteMany({})
    res
    .status(200)
    .json(new ApiResponce(200,{},"cart emptied"))
})

const GetCart = AsyncHandler(async(req,res)=>{
    console.log("fetching cart items...");
    
    const cartItems = await CartItem.find().populate("product")
    
    res
    .status(200)
    .json(new ApiResponce(200,cartItems,"cart items fetched"))
})

const GetCheckout = AsyncHandler(async(req,res)=>{
    // Build checkout object: per-item quantity and total, plus cart total
    const cartItems = await CartItem.find().populate("product")

    let cartTotal = 0
    const items = cartItems.map(item => {
        const price = item.product && item.product.price ? Number(item.product.price) : 0
        const qty = item.quantity ? Number(item.quantity) : 0
        const itemTotal = price * qty
        cartTotal += itemTotal

        return {
            itemId: item._id,
            product: item.product || null,
            quantity: qty,
            itemTotal
        }
    })

    const checkoutObj = {
        items,
        cartTotal
    }

    res
    .status(200)
    .json(new ApiResponce(200, checkoutObj, "checkout computed"))
})

export {GetProducts, AddToCart, RemoveFromCart, GetCart, GetCheckout, AddNewProduct,EmptyCart}