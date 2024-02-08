import './App.css';
import { Route, Routes} from 'react-router-dom'
import { Login } from './auth/security/login';

function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path='' element={ <Login /> }></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
