import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
import apiService from './services/apiService'
import { useEffect } from 'react'
import Header from './components/Header'
import CharacterList from './components/CharacterList'
import CharacterDisplay from './components/CharacterDisplay'
import CreateCharacter from './components/CreateCharacter'
import './App.css'

function AppContent() {
  const { user } = useUser();

  useEffect(() => {
    if (user?.token) {
      apiService.setAuthToken(user.token);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<CharacterList />} />
            <Route path="/create/character" element={<CreateCharacter />} />
            <Route path="/character/:id" element={<CharacterDisplay />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
