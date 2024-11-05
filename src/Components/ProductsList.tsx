import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import car from '../Images/carrito.png'
import '../Styles/productslist.css'
import OrderList from './OrderList';
import carblank from '../Images/carblank.png'
import { Link } from 'react-router-dom';
import list from '../Images/list.png'

interface Product {
    id: string;
    name_product: string;
    amount_product: number;
    photo: string;
  }
  
  interface MyProduct {
    id: string;
    product: string;
    price: number;
  }

const ProductsList: React.FC = () => {

    const [products, setProducts] = useState<Product[]>([]);;
    const [loading, setLoading] = useState(true)
    const [myProducts, setMyProducts] = useState<MyProduct[]>([])
    


    const getProducts = async() => {
        try {
            const productsCollection = collection(db, "products"); 
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map((doc) => ({
                id: doc.id, 
                ...doc.data() 
      })) as Product[];
        setProducts(productsList)
        setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getProducts()
    }, [])

    const addProducts = (product: string, id: string, price: number) => {

        const limit = myProducts.filter(item => item.id === id).length;

        if (limit >= 2) {
            alert("Solo puedes agregar 2 productos iguales");
            return;
          }
        const myobj = {
            id: id,
            product: product,
            price: price
        }

        setMyProducts((prevProducts) => [...prevProducts, myobj]);
         
        return (
            <p>Agregado al carrito</p>
        )
    }

    


    if (loading) {
        return <h2 className='product-list-load'>Cargando productos...</h2>;
    }

  return (
    <div className='product-list-container'>
        <div className='product-list-content' >
            {products && products.map(items => (
                <div className='product-list-card' key={items.id}>
                    <div className='product-list-image'>
                        <img src={items.photo} alt={`product-${items.id}`}/>
                    </div>
                    <div className='product-list-info'>
                        <h3>{items.name_product}</h3>
                        <p>Valor: ${items.amount_product}</p>
                    </div>
                    <button className='product-list-button' onClick={() => addProducts(items.name_product, items.id, items.amount_product)}>
                        <img src={car} alt="car"/>
                    </button>
                </div>
            ))}
        </div>
        <div className='product-list-my-actions'>
            <label htmlFor='mycarcheck' className='product-list-my-car-open'>
                <img src={carblank} alt="carblank"/>
            </label>
            <Link to="/orders" className="product-list-my-orders">
                <img src={list} alt="list"/>
            </Link>
        </div>
        
        
        <OrderList myproducts={myProducts}/>
        
    </div>
  )
}

export default ProductsList