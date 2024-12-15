import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function HymnLookupModal({ show, handleClose }) {
  const [hymnNumber, setHymnNumber] = useState('');
  const [hymnTitle, setHymnTitle] = useState('');
  const [error, setError] = useState('');

  const handleLookup = async () => {
    try {
      setError('');
      setHymnTitle('');
      const response = await fetch('/hymns.txt');
      const text = await response.text();
      const hymns = text.split('\n');

      const index = parseInt(hymnNumber, 10) - 1;
      if (index >= 0 && index < hymns.length) {
        setHymnTitle(hymns[index]);
      } else {
        setError('유효하지 않은 성가 번호입니다. 1에서 360 사이의 번호를 입력하세요.');
      }
    } catch (e) {
      setError('성가 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" enforceFocus={false}>
      <Modal.Header closeButton>
        <Modal.Title>청소년 청년 성가집 번호 찾기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="hymnNumber">성가 번호 입력:</label>
          <input
            type="number"
            id="hymnNumber"
            className="form-control"
            value={hymnNumber}
            onChange={(e) => setHymnNumber(e.target.value)}
          />
        </div>
        <Button className="btn btn-primary mt-3" onClick={handleLookup}>
          찾기
        </Button>

        {hymnTitle && (
          <div className="alert alert-success mt-3">
            <strong>성가 제목:</strong> {hymnTitle}
          </div>
        )}
        {error && (
          <div className="alert alert-danger mt-3">{error}</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HymnLookupModal;
