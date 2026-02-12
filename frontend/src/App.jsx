import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import CharacterList from './components/CharacterList'
import CharacterDisplay from './components/CharacterDisplay'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<CharacterList />} />
            <Route path="/character/:id" element={<CharacterDisplay />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
