# WOOCAGA - 커피, 디저트 맛집 공유 서비스

## 목차

1. 개요
2. 아키텍처
3. 기능
4. 메인
5. 기술스택
6. 사용법

## 개요

### 목표
건대를 중심으로 지도상에서 커피, 디저트가 맛있는 카페를 확인하고 직접 추가하여 공유하는 웹 어플리케이션 개발을 목표로 합니다.

### 주요 장점
커피, 디저트로 카테고리를 나누고 해당 구역을 마커로 표시하여 시각적으로 한 눈에 파악이 가능하다는 점이 주요 장점입니다.

## 기술스택
- 프론트엔드 : reactjs, typescript, react query, redux toolkit,  aws s3 cloudfront
- 백엔드 : express, jwt, mongodb, aws ec2

## 아키텍처
![아키텍처2](https://github.com/jieuning/woocaga-front/assets/108172664/2d2d68d2-b28b-4bee-82fe-8a35b2c36e9e)

## 기능

### 마커 리스트에 무한스크롤 적용 - 데이터 캐싱을 통한 렌더링 성능 향상
1. 마지막 엘리먼트가 뷰포트에 들어오면 IntersectionObserver가 관찰하여 fetchNextPage 함수를 실행 시킵니다.
2. useInfiniteQuery가 page parameter 값을 변경하여 fetcher함수로 보냅니다.
3. GET요청하여 query parameter를 통해 서버에서 데이터를 page당 10개씩 받아옵니다.

**useInfiniteQuery의 staleTime과 cacheTime을 통해 inactive에서 active가 될 때 캐시 데이터 사용**
![staleTime 비교](https://github.com/jieuning/woocaga-front/assets/108172664/f752a8c1-408a-4acf-837c-bded68263d00)
<br/>

### 마커 생성 / 삭제 관련 프론트 및 백엔드 로직 - 거리로 마커 수 제한하여 과부하 방지
![마커 생성 및 삭제](https://github.com/jieuning/woocaga-front/assets/108172664/154ab965-c7be-4ef0-b2ea-cc404e3fb332)

**문제 발생**
- 지도상에 너무 많은 마커가 생성되면 과부하가 걸리게 되어  끊김 현상이 발생하게 되었습니다. 

**문제 해결** 
- 좌표 값을 미터로 계산하기 위해 kakao api에서 좌표를 변환 합니다.
- db에서 현재 마커와 가장 가까운 마커를 찾아 80m이내에 마커가 존재하면 마커 생성을 제한합니다.
- 거리 제한을 통해 불필요하게 생성되는 마커를 제한하고 과부하를 방지할 수 있었습니다.


### 마커 검색 - 중복된 검색어를 redux-persist를 사용해서 api call 감소
![검색 시퀸스](https://github.com/jieuning/woocaga-front/assets/108172664/b3de3c6d-48f7-4dae-b2e0-cb65c9ce1cf2)

**문제 발생**
- 이전 검색어와 중복된 검색어를 입력했을 때 매번 kakao api에 불필요한 call 요청을 보내는 문제가 발생했습니다.

**문제 해결** 
- redux-toolkit의 psersist를 통해 kakao api에서 받아온 데이터를 저장합니다. 
- 이전에 검색했던 검색어를 재 검색하려 할 때 persist에 저장된 데이터를 사용합니다. 
- 같은 검색어를 10번 입력시, persist를 사용하는 경우 9번의 call은 localstorage를 사용합니다.
- 이에, 같은 검색어를 10번 사용하는 기존 상황대비 9번의 network call 시간을 줄여 빠른 렌더링을 구축할 수 있습니다.

### JWT 로그인 전 과정  - 보안에 취약한 access token 주기적으로 관리
![jwt시퀸스](https://github.com/jieuning/woocaga-front/assets/108172664/b543de10-fdc6-4823-850d-8e2b53eafb78)

**자동 로그아웃 Modal 을 사용한 이유** 
- setTimeout을 사용하여 2시간 49분 30초 마다 모달창이 등장하고 사용자가 로그인을 연장할 경우 access token을 재발급되게 하여 보안을 강화했습니다.
- 모달 등장 후 상호작용 하지 않을시 30초 후에 자동으로 로그아웃되게 하여 브라우저가 비활성화 된 상태에서 토큰 탈취 가능성을 감소 시킬 수 있었습니다.
- 사용자에게 로그인 연장과 로그아웃 선택권을 부여해 UX를 높일 수 있었습니다.

## 메인
- 반응형 처리하여 웹/모바일 모두 대응 가능합니다.

### PC버전
![메인](https://github.com/jieuning/woocaga-front/assets/108172664/5678686d-f5db-4a2c-ba82-e3bd4fa2396f)

### MOBOLE버전
![모바일](https://github.com/jieuning/woocaga-front/assets/108172664/3ac7f472-fd95-4b55-af89-fe4ae27f4a9f)

## 사용법

### 로컬에서 사용하기
프로젝트를 사용하기에 앞서 `git`과 `npm`이 설치되어 있어야 합니다.
#### 클론
```
git clone https://github.com/jieuning/woocaga-front.git
```
#### 패키지 설치
```
npm install
```
#### 실행
```
npm run dev
```
### 배포사이트 이용하기

#### 사이트 주소
[woocaga site](https://d2yxy7h8hjwwje.cloudfront.net)

#### 테스트 계정
```
email : user@gmail.com
pw : asdf123!
```
