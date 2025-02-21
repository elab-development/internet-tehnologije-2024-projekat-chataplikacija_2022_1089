import { useState, useEffect } from 'react';

const useEmojis = () => {
  const [emojiList, setEmojiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Učitavanje liste emojija sa API-ja
    fetch("https://emojihub.yurace.pro/api/all")
      .then((response) => response.json())
      .then((data) => {
        setEmojiList(data);
        setLoading(false); // Postavljanje loading-a na false nakon što su podaci učitani
      })
      .catch((error) => {
        console.error("Error fetching emojis:", error);
        setLoading(false); // Ako se desi greška, prestajemo sa učitavanjem
      });
  }, []);

  return { emojiList, loading };
};

export default useEmojis;

