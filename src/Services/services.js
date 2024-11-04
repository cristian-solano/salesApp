import { collection } from 'firebase/firestore';
import { db } from '../Firebase/firebase'; 


const products = async () => {
    try {
      const productsCollection = collection(db, "products"); 
      return productsCollection
      
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };


export default products