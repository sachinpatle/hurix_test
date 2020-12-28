import Navbar from "./components/Navbar"
import "./App.css"
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import UserProfile from "./components/screens/UserProfile";

import MyFollowingUserPost from "./components/screens/FollowingUserPost";
import Createpost from "./components/screens/Createpost";
import { BrowserRouter, Route ,useHistory,Switch} from "react-router-dom";
import {createContext,useReducer,useEffect,useContext} from "react";
import {initialState,reducer} from "../src/reducer/UserReducer";

export const usercontext =createContext();
const Routing=()=>{
const history=useHistory();
const {state,dispatch} = useContext(usercontext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user)
    {
      dispatch({type:"USER",payload:user})
      // history.push("/")
    }
    else{
      history.push('/login')
    }
  }, [])

  return(
    <Switch>
    <Route exact  path="/">
    <Home/>
    </Route>

    <Route exact path="/login">
    <Login/>
    </Route>

    <Route  exact path="/signup">
    <Signup/>
    </Route>

    <Route exact path="/profile">
    <Profile/>
    </Route>

    <Route exact path="/user/:userid">
    <UserProfile/>
    </Route>


    <Route exact path="/createpost">
    <Createpost/>
    </Route>

    <Route  path="/myfollowinguserpost">
    <MyFollowingUserPost/>
    </Route>
    </Switch>
  )
}
function App() {
const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="app">
    <usercontext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar></Navbar>
     <Routing/>
        </BrowserRouter>
        </usercontext.Provider>
    </div>
  );
}

export default App;
