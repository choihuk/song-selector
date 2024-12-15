
# 성가 곡 선정 및 유튜브 청취 서비스

## [서비스 바로가기](https://song-selector-sandy.vercel.app/)

## 프로젝트 개요
성가 곡 선정 및 유튜브 청취 서비스는 성가 곡 관리와 검색, 청취를 효율적으로 지원하기 위해 개발된 웹 애플리케이션입니다. 성가집과 유튜브를 활용해 특정 주차별 성가를 검색하고, 청취할 수 있는 기능을 제공합니다.

---

## 기술 스택

### 프론트엔드
- **React.js:** 사용자 인터페이스 개발
- **React Bootstrap:** 스타일링 및 UI 구성 요소
- **Axios:** API 통신
- **Firebase Firestore:** 데이터베이스 관리

### 백엔드 및 데이터 관리
- **Firebase Firestore:** 성가 데이터 저장 및 관리
- **Firebase Hosting:** 정적 사이트 호스팅

### 배포 및 인프라
- **Vercel:** 프론트엔드 배포
- **GitHub:** 소스 코드 관리

---

## 인프라 구조
```
[React App] --API 통신--> [YouTube API] (비디오 검색)  
              --Firebase--> [Firestore] (성가 데이터 관리)
```
---

## 주요 기능 및 세부 설명

### 1. **성가 유튜브 청취 서비스**
- 주차별 성가 목록 관리
- 선택된 성가 YouTube 동영상 재생 지원
- 주차별, 월별, 연도별 필터링
- 성가 목록이 없을 경우 'No songs available' 메시지 표시

### 2. **성가 관리 서비스**
- 성가 추가, 수정, 삭제
- 드래그 앤 드롭으로 성가 순서 조정
- Firebase Firestore에 성가 데이터 자동 저장

### 3. **청소년 청년 성가집 번호 찾기 서비스**
- 성가 번호를 입력하면 대응하는 성가 제목 검색
- `hymns.txt` 파일에서 성가 제목 로드
- React 모달 창을 통한 성가 검색 인터페이스 제공

### 4. **YouTube 검색 및 연결 서비스**
- 유튜브 동영상 검색 API 연동
- 성가 선택 후 YouTube 검색 및 동영상 링크 등록
- 유튜브 동영상 ID 자동 관리
- 유튜브 검색 cursor pagenation 적용

---

## 사용 방법 (local)
1. 프로젝트를 클론합니다.
   ```bash
   git clone https://github.com/yourusername/yourproject.git
   ```
2. 프로젝트 디렉토리로 이동합니다.
   ```bash
   cd yourproject
   ```
3. 필요한 패키지를 설치합니다.
   ```bash
   npm install
   ```
4. Firebase 및 YouTube API 키를 `.env` 파일에 설정합니다.
   ```env
   REACT_APP_YOUTUBE_API_KEY=...
   REACT_APP_FIREBASE_API_KEY=...
   REACT_APP_FIREBASE_AUTH_DOMAIN=...
   REACT_APP_FIREBASE_PROJECT_ID=...
   REACT_APP_FIREBASE_STORAGE_BUCKET=...
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
   REACT_APP_FIREBASE_APP_ID=...
   REACT_APP_FIREBASE_MEASUREMENT_ID=...
   ```
5. 개발 서버를 시작합니다.
   ```bash
   npm start
   ```
6. `http://localhost:3000`으로 이동하여 서비스를 사용합니다.