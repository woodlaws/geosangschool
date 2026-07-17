# 거상스쿨 홈페이지

거상스쿨 신규 홈페이지입니다. AI마케팅스쿨, 단기 클래스, 수강후기, 학습자료, 학습지원, 상담문의 페이지를 포함합니다.

## 주요 페이지

| 경로 | 파일 | 설명 |
|---|---|---|
| `/` | 거상스쿨 홈.dc.html | 메인 랜딩페이지 |
| `/about` | 거상스쿨 소개.dc.html | 브랜드·신뢰 페이지 |
| `/courses` | 전체 교육과정.dc.html | 과정 허브 |
| `/courses/ai-marketing-school` | AI마케팅스쿨.dc.html | 대표 과정 상세 |
| `/courses/short-courses` | 단기 클래스.dc.html | 단기 과정 |
| `/reviews` | 수강후기.dc.html | 수강생 결과물 |
| `/resources` | 학습자료.dc.html | 콘텐츠 허브 |
| `/support` | 학습지원.dc.html | 기존 수강생 안내 |
| `/contact` | 상담문의.dc.html | 상담 신청 전환 페이지 |
| `/login` | 수강생 로그인.dc.html | VOD 연결 안내 |

## 주요 파일

- `og-image.png` — SNS/카카오톡 공유용 대표 이미지
- `robots.txt` — 검색엔진 크롤링 설정
- `sitemap.xml` — 사이트맵
- `llms.txt` — AI 검색 대응 사이트 정보
- `uploads/e-1_투명.png` — 거상스쿨 로고

## 배포 안내 (Vercel)

이 프로젝트는 정적 HTML 기반입니다.

### Vercel 배포 설정
- Framework Preset: **Other**
- Build Command: (없음)
- Output Directory: `.` (루트)

### 라우팅 설정
`vercel.json` 파일의 rewrites 규칙을 참고하세요.

각 페이지 파일을 아래와 같이 배포 구조에 맞게 배치하세요:

```
public/
  index.html         ← 거상스쿨 홈.dc.html 복사
  about.html         ← 거상스쿨 소개.dc.html 복사
  courses.html       ← 전체 교육과정.dc.html 복사
  courses/
    ai-marketing-school.html
    short-courses.html
  reviews.html
  resources.html
  support.html
  contact.html
  login.html
  og-image.png
  robots.txt
  sitemap.xml
  llms.txt
  uploads/
    e-1_투명.png
```

## 중요 안내

- 기존 VOD 강의실 기능은 새 홈페이지에 포함하지 않습니다.
- 기존 강의실 링크: https://geosangschool.com/member_login.php
- 상담 신청 폼: 현재 Google Form 또는 카카오톡 채널 연결 예정
- 정원: AI마케팅스쿨 50명

## 배포 후 확인

1. 카카오톡 공유 디버거: https://developers.kakao.com/tool/debugger/sharing
2. Facebook OG 디버거: https://developers.facebook.com/tools/debug/
3. 구글 Search Console에 sitemap.xml 등록

## 운영

- 운영사: 거상스쿨(주)
- 대표: 임헌수
- 관련: 거상마케팅센터
