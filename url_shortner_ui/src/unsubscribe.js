import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (userId && email) {
      fetch(`/api/unsubscribe?userId=${userId}&email=${encodeURIComponent(email)}`)
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            return response.text().then(text => { throw new Error(text) });
          }
        })
        .then(data => {
          setMessage(data);
        })
        .catch(error => {
          setMessage(`Error unsubscribing: ${error.message}`);
        });
    } else {
      setMessage('Invalid unsubscribe link.');
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Unsubscribe</h1>
      <p>{message}</p>
      <button onClick={() => navigate('/')}>Go to Homepage</button>
    </div>
  );
}

export default UnsubscribePage;