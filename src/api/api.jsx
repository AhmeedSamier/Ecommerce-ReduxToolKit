import axios from "axios";

export const productData = async()=>{
    const products = await axios.get("https://fakestoreapi.com/products");
    return products;
}


