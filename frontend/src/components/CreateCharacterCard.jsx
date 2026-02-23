import { useNavigate } from 'react-router-dom'

function CreateCharacterCard() {
  const navigate = useNavigate()

  return (
    <div className="character-card create-card" onClick={() => navigate('/create/character')}>
      <span>+</span>
      <p>Create a Character</p>
    </div>
  )
}

export default CreateCharacterCard