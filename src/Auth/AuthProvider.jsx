import { createContext,useContext,useState } from "react";
import { useNavigate } from 'react-router-dom';
import { api } from "./api";
const AuthContext=createContext()
let globalLogout=()=>{}
export const useAuth=()=>(
    useContext(AuthContext)
)
export const AuthProvider=({children})=>{
    const navigate = useNavigate();
    const [user,setUser]=useState({})
    const [isAuthorized,setIsAuthorized]=useState(false)
    
   
    const login=async(data)=>{
        try{
 
            localStorage.setItem('user',JSON.stringify(data))
            setIsAuthorized(true)
            console.log('in here Tabs')
            navigate('/Home')
           return                   
        }catch(error){
            console.log(error)
        }
    }

    const logout=async()=>{
   try{
        const res=await api.post('api/user/logout')
        console.log(res)
        setIsAuthorized(false)
        localStorage.clear()
        navigate('/')
   }catch(error){
    console.log(error)
   }   
         }

         globalLogout=logout
   

    return (
        <AuthContext.Provider value={{user,logout,login,isAuthorized,setUser,setIsAuthorized  }}>
            {children}
        </AuthContext.Provider>
    )
}

export const getGlobalLogout = () => globalLogout;


