import { createContext,useContext,useState } from "react";
import { REFRESH_TOKEN,ACCESS_TOKEN } from "../../constants";
const AuthContext=createContext()
export const useAuth=()=>(
    useContext(AuthContext)
)
export const AuthProvider=({children})=>{
    const [user,setUser]=useState({})
    const [isAuthorized,setIsAuthorized]=useState(false)
    
   
    const login=async(accessToken,refreshToken)=>{
        try{
             localStorage.setItem(ACCESS_TOKEN,accessToken);
             localStorage.setItem(REFRESH_TOKEN, refreshToken);
            setIsAuthorized(true)
            console.log('in here Tabs')
           return                   
        }catch(error){
            console.log(error)
        }
    }

    const logout=async(navigation)=>{
   try{
        navigation.navigate('LandingPage')
         localStorage.removeItem(ACCESS_TOKEN);
         localStorage.removeItem(REFRESH_TOKEN);
        setIsAuthorized(false)
        setUser({})
   }catch(error){
    console.log(error)
   }   
         }
   

    return (
        <AuthContext.Provider value={{user,logout,login,isAuthorized,setUser,setIsAuthorized  }}>
            {children}
        </AuthContext.Provider>
    )
}

