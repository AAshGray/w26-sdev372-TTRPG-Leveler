import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import './CreateCharacter.css';
import apiService from '../services/apiService';


function CreateCharacter() {
  const { user } = useUser()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    char_name: '',
    total_level: 1,
    total_hp: 1,
    initiative_bonus: 0,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    languages: ''
  })

  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 1

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    apiService.setAuthToken(user?.token);
    
    try {
      const payload = {
        ...formData,
        user_id: user?.id,
      };

      const response = await apiService.post('/characters/create', payload);
      
      if (response) {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  return (
    <div className="create-character-form">
      <h2>Create a New Character</h2>
        {[...Array(TOTAL_STEPS)].map((_, index) => {
            const stepNumber = index + 1;
            return (
                <div 
                key={stepNumber} 
                className={`step-circle ${step === stepNumber ? 'active' : ''}`}
                >
                {stepNumber}
                </div>
            );
        })}
      {step === 1 && (
        <form onSubmit={handleSubmit}>
            <input type="text" name="char_name" placeholder="Character Name" value={formData.char_name} onChange={handleChange} />
            <input type="number" name="strength" placeholder="Strength" value={formData.strength} onChange={handleChange} />
            <input type="number" name="dexterity" placeholder="Dexterity" value={formData.dexterity} onChange={handleChange} />
            <input type="number" name="constitution" placeholder="Constitution" value={formData.constitution} onChange={handleChange} />
            <input type="number" name="intelligence" placeholder="Intelligence" value={formData.intelligence} onChange={handleChange} />
            <input type="number" name="wisdom" placeholder="Wisdom" value={formData.wisdom} onChange={handleChange} />
            <input type="number" name="charisma" placeholder="Charisma" value={formData.charisma} onChange={handleChange} />
            <input type="text" name="languages" placeholder="Languages" value={formData.languages} onChange={handleChange} />
            
            <button type="button" onClick={step === TOTAL_STEPS ? handleSubmit : () => setStep(step + 1)}>
                {step === TOTAL_STEPS ? 'Submit' : 'Next'}
            </button>
        </form>
      )}
    </div>
  )

}

export default CreateCharacter;