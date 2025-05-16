import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from './config';

// Proveedor para autenticación con Google
const googleProvider = new GoogleAuthProvider();

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Obtener token
    const token = await result.user.getIdToken();
    
    // Formatear información del usuario
    const user = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    };
    
    return {
      success: true,
      user,
      token
    };
  } catch (error: any) {
    console.error("Error al iniciar sesión con Google:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para cerrar sesión
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return true;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return false;
  }
};