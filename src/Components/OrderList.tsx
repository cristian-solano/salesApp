import React, { useState } from 'react'
import '../Styles/orderlist.css'
import { useForm } from 'react-hook-form'
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import check from '../Images/check.png'
import { Link } from 'react-router-dom';

interface Product {
    id: string;
    product: string;
    price: number;
  }
  
  interface OrderListProps {
    myproducts: Product[];
  }
  
  interface OrderInfo {
    amount: number;
    email: string | null;
    id_client: string | null;
    items: Product[];
    createAt: Date;
    currentState: string;
  }

const OrderList:  React.FC<OrderListProps> = ({myproducts}) => {

    const {handleSubmit} = useForm()
    const [info, setInfo] = useState<OrderInfo | null>(null)
    const [watchSale, setWatchSale] = useState(false)

    const handlerOnChange = () => {
        if(watchSale === false){
            setWatchSale(true)
        }else {
            setWatchSale(false)
        }
    }

    
    const name = sessionStorage.getItem("email")
    const id_person = sessionStorage.getItem("id")

    const onSubmit = async() => {
        const totalamount = myproducts.reduce((total, item) => total + item.price, 0)
        const data = {
                amount: totalamount,
                email: name,
                id_client: id_person,
                items: myproducts,
                createAt: new Date(), 
                currentState: totalamount > 1000 ? "en revisión" : "pendiente"
            }


            try {
                await addDoc(collection(db, "orders"), data);
                setInfo(data);
            } catch (error) {
                console.log("Error al guardar la orden:", error);
            }
        
    }

    const calculateTotalPrice = () => {
        return myproducts.reduce((total, item) => total + item.price, 0);
      };

  return (
    <div className='order-list-container'>
        <input type='checkbox' id="mycarcheck" style={{display: 'none'}}/>
        <div className='order-list-content'>
            <div className='order-list_my-list'>
                <label htmlFor='mycarcheck' className='product-list-my-car-close'>
                    <p>X</p>
                </label>
                <div className='order-list-my-car-title'>
                    <h3>Productos seleccionados</h3>
                    <p>salesapp</p>
                </div>
                <div className='order-list-car'>
                    <div className='order-list-title'>
                        <p>Item</p>
                        <p>Nombre</p>
                        <p>Precio</p>
                    </div>
                    {myproducts.length > 0 ? 
                    myproducts.map((items, i) => (
                        <div className='order-list-item' key={items.id}>
                            <p>{i + 1}.</p>
                            <p>{items.product}</p>
                            <p>${items.price}</p>
                        </div>

                    ))
                    : <p>"No has añadido nada al carrito"</p>}
                </div>
                
                <div className='order-list-total'>
                    <p>Total: ${calculateTotalPrice()}</p>
                </div>
            </div>
            
            {myproducts.length > 0 ? 
            <form onSubmit={handleSubmit(onSubmit)} className='order-list-button'>
                <button onClick={() => handlerOnChange()}>Comprar</button>
            </form>
        : ""}
        </div>
        
        
        {watchSale && info && 
        <div className='order-list-complete-content'>
            <div className='order-list-complete-card'>
                <div className='order-list-complete-card-title'>
                <h3>Compra realizada</h3>
                    <img src={check} alt="check"/>
                </div>
                
                <div className='order-list-complete-card-client'>
                    <p>Correo: {info?.email}</p>
                </div>
                <div className='order-list-complete-card-sales'>
                    {info?.items.length > 0 ? info?.items.map((info, i) => (
                    <div className='order-list-complete-card-client-data' key={info.id}>
                        <span>{i+1}.</span>
                        <p>{info.product}</p>
                        <p>${info.price}</p>
                    </div>
                    )) : ""}
                </div>
                
                <div className='order-list-complete-card-amount'>
                    <p>TOTAL: ${info?.amount}</p>
                </div>
                <div className='order-list-complete-card-my-orders'>
                    <Link to="/orders">Dirigite a compras</Link>
                </div>
            </div>
        </div>}
    </div>
    
  )
}

export default OrderList