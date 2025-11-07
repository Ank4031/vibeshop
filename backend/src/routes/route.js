import { Router } from "express";
import { GetProducts, AddToCart, RemoveFromCart, GetCart, GetCheckout, AddNewProduct, EmptyCart } from "../controllers/main.js";

const Route = Router()
Route.route("/addnewproduct").post(
    AddNewProduct
)

Route.route("/emptycart").delete(
    EmptyCart
)

Route.route("/products").get(
    GetProducts
)

Route.route("/cart").post(
    AddToCart
)

Route.route("/cart/:id").delete(
    RemoveFromCart
)

Route.route("/cart").get(
    GetCart
)

Route.route("/checkout").post(
    GetCheckout
)

export default Route