import { useState, useEffect } from 'react';

const useEmojis = () => {
  const [emojiList, setEmojiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://emoji-api.com/emojis?access_key=207c32d033df627e9dd524e88eea66cbb52b434e")
      .then((response) => response.json())
      .then((data) => {
        setEmojiList(data);
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching emojis:", error);
        setLoading(false); // Ako se desi greška, prestajemo sa učitavanjem
      });
  }, []);

  return { emojiList, loading };
};

export default useEmojis;

