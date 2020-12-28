import {React,useContext,useRef,useEffect,useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import {usercontext} from '../App'
import M from 'materialize-css'

function Navbar() {
  const history = useHistory()
  const [search, setsearch] = useState('')
  const searchModal = useRef(null)
  const {state,dispatch} = useContext(usercontext);
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])

  const onsearchChange=async(e)=>{
    const search = e.target.value;
    setsearch(search);
};

  const RenderList=()=>{
    if(state){
      return [
        <div style={{align:"left"}}>
        <li> <Link to={state?"/":"/login"}>Instagram</Link></li>,
        </div>,
        <div style={{align:"right"}}>
        <li> <i data-target="modal1" className="material-icons nav_search modal-trigger">search</i></li>,
        <li><Link  to={"/profile"}>profile</Link></li>,
        <li><Link  to={"/createpost"}>createpost</Link></li>,
        <li><Link  to={"/myfollowinguserpost"}>myfollowinguserpost</Link></li>,
        </div>,
        <li>
         <button onClick={()=>{
           localStorage.clear()
           dispatch({type:"CLEAR"})
           history.push("./login")
         }} className="btn Navbar_logoutbutton">Logout
        </button>
        </li>
      ]
    }
    else{
      return [
        <div style={{align:"left"}}>
        <li> <Link to={state?"/":"/login"}>Instagram</Link></li>,
        </div>,
        <div style={{align:"right"}}>
        <li><Link to={"/login"}>login</Link></li>,
        <li><Link to={"/signup"}>signup</Link></li>,
        </div>,
      ]
    }
  }
    return (
      <div className="navbar">
        <nav className="navbar_heading">
        <div className="nav-wrapper white">
          <ul id="nav-mobile" className="navbar_rightside">
          {RenderList()}
          </ul>
        </div>
        <div id="modal1" className="modal"  ref={searchModal}>
      <div style={{color:"black"}} className="modal-content">
      <input type="text" placeholder="search users"
            value={search} onChange={onsearchChange} />
             <ul className="collection">
                  <li className="collection-item">Alvin</li>
                  <li className="collection-item">Alvin</li>
                  <li className="collection-item">Alvin</li>
                  <li className="collection-item">Alvin</li>
                  <li className="collection-item">Alvin</li>
                  <li className="collection-item">Alvin</li>
                  <li className="collection-item">Alvin</li>
              </ul>

      </div>
      
      <div className="modal-footer">
        <button  className="modal-close waves-effect waves-green btn-flat">Agree</button>
      </div>
  </div>
  
      </nav>
      </div>
    )
}

export default Navbar
