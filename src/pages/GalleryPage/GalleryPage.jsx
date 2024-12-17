import { useState } from 'react';
import { Input } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page.jsx';
import { useNavigate } from 'react-router-dom';
import './GalleryPage.css';

// Импортируем изображения
import meme1 from '/memes/meme1.jpg';
import meme2 from '/memes/meme2.jpg';
import meme3 from '/memes/meme3.jpg';
import meme4 from '/memes/meme4.jpg';
import meme5 from '/memes/meme5.jpg';
import meme6 from '/memes/meme6.jpg';
import meme7 from '/memes/meme7.jpg';
import meme8 from '/memes/meme8.jpg';
import meme9 from '/memes/meme9.jpg';
import meme10 from '/memes/meme10.jpg';
import meme11 from '/memes/meme11.jpg';
import meme12 from '/memes/meme12.jpg';

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
