import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getWeekNumber } from '../utils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import SongManagementModal from './SongManagementModal';
import HymnLookupModal from './HymnLookupModal';
import { db } from '../firebaseConfig';
import Button from 'react-bootstrap/Button';

function SongSelection() {
  const [songs, setSongs] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [week, setWeek] = useState(getWeekNumber(new Date()));
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState('');
  const [previousPageTokens, setPreviousPageTokens] = useState([]);
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [showHymnModal, setShowHymnModal] = useState(false);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const docRef = doc(db, 'songs', `${year}-${month}-${week}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSongs(docSnap.data().songs || []);
        } else {
          setSongs([
            {
              id: 'song-1',
              name: '입당',
              videoId: '',
              link: '',
              selected: false,
            },
            {
              id: 'song-2',
              name: '예물 준비',
              videoId: '',
              link: '',
              selected: false,
            },
            {
              id: 'song-3',
              name: '영성체',
              videoId: '',
              link: '',
              selected: false,
            },
            {
              id: 'song-4',
              name: '영성체 후 묵상곡',
              videoId: '',
              link: '',
              selected: false,
            },
            {
              id: 'song-5',
              name: '파견',
              videoId: '',
              link: '',
              selected: false,
            },
          ]);
        }
      } catch (err) {
        console.error('Error fetching songs from database:', err);
      }
    }
    fetchSongs();
  }, [year, month, week]);

  const handleOpenModal = () => setShowManagementModal(true);
  const handleCloseModal = () => setShowManagementModal(false);

  const handleOpenHymnModal = () => setShowHymnModal(true);
  const handleCloseHymnModal = () => setShowHymnModal(false);

  const searchYouTube = async (query, pageToken = '') => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            q: query,
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
            maxResults: 9,
            type: 'video',
            pageToken,
          },
        }
      );
      setSearchResults(response.data.items);
      setNextPageToken(response.data.nextPageToken || '');
      if (!pageToken) {
        setPreviousPageTokens([]);
      } else {
        setPreviousPageTokens((prev) => [...prev, pageToken]);
      }
    } catch (err) {
      console.error('Error searching YouTube:', err);
    }
  };

  const handleSongSelect = (songName) => {
    setSelectedSong(songName);
    setSearchResults([]);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleSearch = () => {
    if (searchQuery) {
      searchYouTube(searchQuery);
    }
  };

  const handleSelectVideo = (video) => {
    const updatedSongs = songs.map((song) =>
      song.name === selectedSong
        ? {
            ...song,
            videoId: video.id.videoId,
            link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            selected: true,
          }
        : song
    );
    setSongs(updatedSongs);
    setSelectedSong(null);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      searchYouTube(searchQuery, nextPageToken);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1 && previousPageTokens.length > 0) {
      const prevToken = previousPageTokens[previousPageTokens.length - 2];
      setPreviousPageTokens((prev) => prev.slice(0, -1));
      setCurrentPage((prev) => prev - 1);
      searchYouTube(searchQuery, prevToken || '');
    }
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'songs', `${year}-${month}-${week}`);
      await setDoc(docRef, { songs });
      alert('Songs saved successfully!');
    } catch (err) {
      console.error('Error saving songs:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">성가 선정 서비스</h1>
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
            {[...Array(5)].map((_, idx) => (
              <option key={idx} value={idx + 1}>
                {idx + 1}주차 (
                {new Date(year, month - 1, 1 + idx * 7).toLocaleDateString(
                  'ko-KR',
                  { month: 'long', day: 'numeric' }
                )}
                )
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={handleOpenModal}>
            성가 관리
          </Button>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={handleOpenHymnModal}>
            청소년 청년 성가집 찾기
          </Button>
        </div>
        <select
          className="form-select"
          onChange={(e) => handleSongSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            성가를 선택하세요
          </option>
          {[...songs].map((song, index) => (
            <option key={index} value={song.name}>
              {song.selected ? `${song.name} (선택 완료)` : song.name}
            </option>
          ))}
        </select>
      </div>
      <SongManagementModal
        year={year}
        month={month}
        week={week}
        songs={songs}
        setSongs={setSongs}
        show={showManagementModal}
        handleClose={handleCloseModal}
      />
      <HymnLookupModal
        show={showHymnModal}
        handleClose={handleCloseHymnModal}
      />
      {selectedSong && (
        <div className="mb-4">
          <h2>{selectedSong} 성가 검색</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="검색할 키워드 입력"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              검색하기
            </button>
          </div>
          <div className="row">
            {searchResults.map((result, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <p className="card-text">{result.snippet.title}</p>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-success w-100"
                        onClick={() => handleSelectVideo(result)}
                      >
                        선택하기
                      </button>
                      <iframe
                        className="mt-2"
                        width="100%"
                        height="200"
                        src={`https://www.youtube.com/embed/${result.id.videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube preview"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {searchResults.length > 0 && (
        <div className="pagination-controls">
          <Button variant="secondary" onClick={handlePreviousPage} disabled={currentPage === 1}>
            이전 페이지
          </Button>
          <Button variant="secondary" onClick={handleNextPage}>
            다음 페이지
          </Button>
        </div>
      )}
        </div>
      )}
      <button className="btn btn-success" onClick={handleSave}>
        저장
      </button>
    </div>
  );
}

export default SongSelection;
