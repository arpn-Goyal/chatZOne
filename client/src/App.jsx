import {BrowserRouter  as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Chat from './pages/Chat.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
function App() {

  return (
      <Router >
        <Routes>
          <Route path='/'  element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/chat' element={
            <ProtectedRoute>
              <Chat/>
            </ProtectedRoute>
            
            }/>
        </Routes>
      </Router >
  ) 
}

export default App
