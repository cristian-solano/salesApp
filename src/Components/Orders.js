import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import '../Styles/orders.css'
import iconDelete from '../Images/icondelete.png'
import StateControl from './StateControl';



const Orders = () => {

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState(''); 

  const getSales = async () => {
    try {
      const salesCollection = collection(db, "orders"); 
      const salesSnapshot = await getDocs(salesCollection); 
      const salesList = salesSnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id
        return {
            ...data,
            createAt: data.createAt.toDate().toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }), id
          }
      });
      setSales(salesList);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setLoading(false);
    }
  };

  const updateState = async (id_order, newStatus) => {
    try {
        const orderRef = doc(db, "orders", id_order);
        await updateDoc(orderRef, { currentState: newStatus });

        alert(`actualizado el pedido ${id_order}`)
        setSales(prevOrders =>
            prevOrders.map(order =>
                order.id === id_order ? { ...order, currentState: newStatus } : order
            )
        );
    } catch (error) {
        console.error("Error al actualizar la orden:", error);
    }
  };

  const deleteOrder = async(id_order) => {
    try {
      const deleteOrderById = doc(db, "orders", id_order)

      await deleteDoc(deleteOrderById)
      setSales(myOrders => myOrders.filter(order => order.id !== id_order));
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
    }
  }

  const handlerOnChangeState = (e) => {
    setNewStatus(e.target.value)
  }

  useEffect(() => {
    getSales();
  }, []);

  if (loading) {
    return <p>Cargando ordenes listas...</p>;
  }

  return (
    <div className='orders-container'>
      <div className='orders-content'>
        {sales.length > 0 ? sales.map((items, i) => (
          <div className='orders-info' key={items.id}>
            <h3>Recibo No. {items.id}</h3>
            <p>Fecha de pedido:{items.createAt}</p>
            <p>Cliente: {items.email}</p>
            <div className='order-info-products-content'>
              <h5>Productos</h5>
              {items.items && items.items.map((info, i) => (
                <div className='order-info-products' key={i}>
                  <p>{i+1}.</p>
                    <p>{info.product}</p>
                    <p>${info.price}</p>
                    
                </div>
              ))}
            </div>
            <h5>Estado del pedido</h5>
            <StateControl newStatus={newStatus} amount={items.amount} state={items.currentState} update={updateState} id={items.id} change={handlerOnChangeState}/>
            <h4> Total: ${items.amount}</h4>
            <div className='order-info-actions'>
              <button onClick={() => deleteOrder(items.id)}>
                <img src={iconDelete} alt="delete"/>
              </button>
            </div>
          </div>
          ))
        
          : <div>
              <p>No hay ordenes creadas</p>
            </div>}
        
      </div>
    </div>
  )
}

export default Orders