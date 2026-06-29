import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Feed from './pages/Feed';
import ProtectedRoute from './routes/ProtectedRoute';
import CharacterProfile from './pages/CharacterProfile';
import CharacterSetup from './pages/CharacterSetup'
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Landing from './pages/Landing';
import PostDetail from './pages/PostDetail';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
        />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
        />

        <Route path="/character-setup"
          element={
            <ProtectedRoute>
              <CharacterSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/:username" element={<CharacterProfile />}
        />
        <Route path="/post/:postId" element={
          <ProtectedRoute>
            <PostDetail />
          </ProtectedRoute>
        }
        />

      </Routes>


    </BrowserRouter>
  );

}

export default App
