import React, { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './SongManagementModal.css';

function SongManagementModal({
  year,
  month,
  week,
  songs,
  setSongs,
  show,
  handleClose,
}) {
  useEffect(() => {
    if (!songs || !Array.isArray(songs)) {
      setSongs([]);
    }
  }, [songs, setSongs]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedSongs = Array.from(songs);
    const [movedSong] = reorderedSongs.splice(result.source.index, 1);
    reorderedSongs.splice(result.destination.index, 0, movedSong);
    setSongs(reorderedSongs);
  };

  const handleAddSong = () => {
    const newSongName = prompt('새 성가 이름을 입력하세요:');
    if (newSongName) {
      setSongs([...songs, { id: `song-${Date.now()}`, name: newSongName }]);
    }
  };

  const handleEditSong = (id) => {
    const newSongName = prompt('새 이름을 입력하세요:');
    if (newSongName) {
      setSongs(
        songs.map((song) =>
          song.id === id ? { ...song, name: newSongName } : song
        )
      );
    }
  };

  const handleDeleteSong = (id) => {
    setSongs(songs.filter((song) => song.id !== id));
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      enforceFocus={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {year}년 {month}월 {week}주차 성가 관리
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button className="mb-3" onClick={handleAddSong}>
          성가 추가
        </Button>
        <DragDropContext onDragEnd={handleDragEnd} strictModeCompat={true}>
          <Droppable droppableId="songs">
            {(provided) => (
              <ul
                className="list-group"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {songs.map((song, index) => (
                  <Draggable key={song.id} draggableId={song.id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          snapshot.isDragging ? 'dragging' : ''
                        }`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span>{song.name}</span>
                        <div>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditSong(song.id)}
                          >
                            수정
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteSong(song.id)}
                          >
                            삭제
                          </Button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SongManagementModal;
