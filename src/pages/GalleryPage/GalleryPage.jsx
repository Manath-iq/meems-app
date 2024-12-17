import { useState } from 'react';
import { Input } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.jsx';
import { useNavigate } from 'react-router-dom';
import './GalleryPage.css';

// Импортируем изображения
const meme1 = '/meems-app/memes/meme1.jpg';
const meme2 = '/meems-app/memes/meme2.jpg';
const meme3 = '/meems-app/memes/meme3.jpg';
const meme4 = '/meems-app/memes/meme4.jpg';
const meme5 = '/meems-app/memes/meme5.jpg';
const meme6 = '/meems-app/memes/meme6.jpg';
const meme7 = '/meems-app/memes/meme7.jpg';
const meme8 = '/meems-app/memes/meme8.jpg';
const meme9 = '/meems-app/memes/meme9.jpg';
const meme10 = '/meems-app/memes/meme10.jpg';
const meme11 = '/meems-app/memes/meme11.jpg';
const meme12 = '/meems-app/memes/meme12.jpg';

const mockMemes = [
  { id: 1, name: 'Drake Hotline Bling', image: meme1 },
  { id: 2, name: 'Two Buttons', image: meme2 },
  { id: 3, name: 'Distracted Boyfriend', image: meme3 },
  { id: 4, name: 'Running Away Balloon', image: meme4 },
  { id: 5, name: 'Left Exit 12', image: meme5 },
  { id: 6, name: 'Expanding Brain', image: meme6 },
  { id: 7, name: 'Drake Hotline Bling', image: meme7 },
  { id: 8, name: 'Two Buttons', image: meme8 },
  { id: 9, name: 'Distracted Boyfriend', image: meme9 },
  { id: 10, name: 'Running Away Balloon', image: meme10 },
  { id: 11, name: 'Left Exit 12', image: meme11 },
  { id: 12, name: 'Expanding Brain', image: meme12 },
];

export function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const filteredMemes = mockMemes.filter(meme => 
    meme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMemeSelect = (meme) => {
    navigate('/', { state: { selectedMeme: meme } });
  };

  return (
    <Page>
      <div className="gallery-page">
        <div className="search-container">
          <Input
            className="search-input"
            placeholder="Найди свой мем"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="memes-grid">
          {filteredMemes.map(meme => (
            <div 
              key={meme.id} 
              className="meme-item"
              onClick={() => handleMemeSelect(meme)}
            >
              <img src={meme.image} alt={meme.name} />
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
