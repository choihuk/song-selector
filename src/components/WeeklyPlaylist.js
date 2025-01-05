import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getWeekNumber } from '../utils';
import { db } from '../firebaseConfig';

function WeeklyPlaylist() {
  const [songs, setSongs] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [week, setWeek] = useState(getWeekNumber(new Date()));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'songs', `${year}-${month}-${week}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const allSongs = docSnap.data().songs || [];
          const filteredSongs = allSongs.filter(
            (song) => song.selected === true
          );
          setSongs(filteredSongs);
        } else {
          setSongs([]);
        }
      } catch (err) {
        console.error('Error fetching songs:', err);
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, [year, month, week]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">성가 유튜브 청취 서비스</h1>
      <div className="row mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[...Array(7)].map((_, idx) => (
              <option key={idx} value={2024 + idx}>
                {2024 + idx}년
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {[...Array(12)].map((_, idx) => (
              <option key={idx} value={idx + 1}>
                {idx + 1}월
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
          >
            {(() => {
              const daysInMonth = new Date(year, month, 0).getDate();
              const maxWeeks = Math.ceil(daysInMonth / 7);

              return [...Array(maxWeeks)].map((_, idx) => {
                const startDate = new Date(year, month - 1, 1 + idx * 7);
                const sundayDate = new Date(startDate);
                sundayDate.setDate(
                  startDate.getDate() + (7 - startDate.getDay())
                );

                if (sundayDate.getMonth() + 1 !== month) return null;

                return (
                  <option key={idx} value={idx + 1}>
                    {idx + 1}주차 (
                    {sundayDate.toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                    })}
                    )
                  </option>
                );
              });
            })()}
          </select>
        </div>
      </div>
      <div className="list-group">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={index}
              className="list-group-item list-group-item-action d-flex flex-column"
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>{song.name}</span>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setSongs((prevSongs) =>
                      prevSongs.map((s, i) =>
                        i === index ? { ...s, expanded: !s.expanded } : s
                      )
                    )
                  }
                >
                  {song.expanded ? '닫기' : '재생'}
                </button>
              </div>
              {song.expanded && song.videoId && (
                <iframe
                  className="mt-3"
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${song.videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Video"
                ></iframe>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">저장된 성가가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default WeeklyPlaylist;
