import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Header from './components/Header'
import CharacterList from './components/CharacterList'
import CharacterDisplay from './components/CharacterDisplay'
import CharacterCreator from './components/CharacterCreator'
import './App.css'
import CreateCharacterCard from './components/CreateCharacterCard'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<CharacterList />} />
              <Route path="/create/character" element={<CharacterCreator />} />
              <Route path="/character/:id" element={<CharacterDisplay />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
