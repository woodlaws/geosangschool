# 거상스쿨 홈페이지

거상스쿨 신규 홈페이지입니다. AI마케팅스쿨, 단기 클래스, 학습자료, 수강후기, 상담문의, 학습지원, 수강생 로그인 페이지를 포함합니다.

## 주요 페이지

| 경로 | 파일 | 설명 |
|---|---|---|
| `/` | 거상스쿨 홈.dc.html | 메인 랜딩페이지 |
| `/about` | 거상스쿨 소개.dc.html | 브랜드·신뢰 페이지 |
| `/courses` | 전체 교육과정.dc.html | 과정 허브 |
| `/courses/ai-marketing-school` | AI마케팅스쿨.dc.html | 대표 과정 상세 |
| `/courses/short-courses` | 단기 클래스.dc.html | 단기 과정 |
| `/resources` | 학습자료.dc.html | 콘텐츠 허브 |
| `/reviews` | 수강후기.dc.html | 수강생 결과물 |
| `/contact` | 상담문의.dc.html | 상담 신청 전환 페이지 |
| `/support` | 학습지원.dc.html | 기존 수강생 안내 |
| `/login` | 수강생 로그인.dc.html | VOD 연결 안내 |

## 주요 파일

| 파일 | 설명 |
|---|---|
| `vercel.json` | Vercel 라우팅 설정 |
| `support.js` | DC 런타임 (필수) |
| `og-image.png` | SNS/카카오톡 공유용 대표 이미지 |
| `favicon.ico` | 파비콘 |
| `favicon-16x16.png` | 파비콘 16px |
| `favicon-32x32.png` | 파비콘 32px |
| `apple-touch-icon.png` | 애플 홈화면 아이콘 |
| `android-chrome-192x192.png` | 안드로이드 아이콘 |
| `android-chrome-512x512.png` | 안드로이드 아이콘 (대) |
| `site.webmanifest` | PWA 매니페스트 |
| `robots.txt` | 검색엔진 크롤링 설정 |
| `sitemap.xml` | 사이트맵 |
| `llms.txt` | AI 검색 대응 사이트 정보 |

## 배포 안내 (Vercel)

이 프로젝트는 **정적 HTML 기반**입니다. 빌드 과정이 없습니다.

### Vercel 배포 설정

- Framework Preset: **Other**
- Build Command: (비워두기)
- Output Directory: `.` (루트)
- Install Command: (비워두기)

### 라우팅 설정

`vercel.json`의 rewrites 규칙이 각 URL을 해당 `.dc.html` 파일로 연결합니다.

```json
{
  "rewrites": [
    { "source": "/", "destination": "/거상스쿨 홈.dc.html" },
    { "source": "/about", "destination": "/거상스쿨 소개.dc.html" },
    ...
  ]
}
```

## AI마케팅스쿨 주요 정보

- 16기 진행 중
- 3년 이상 운영
- 정원 50명
- 12주 커리큘럼
- Zoom 실시간 + 과제 + 피드백
- 17기부터 90만원 방향으로 운영 예정 (상담 후 안내)

## 중요 안내

- 기존 VOD 강의실 기능은 새 홈페이지에 포함하지 않습니다.
- 기존 강의실 링크: https://geosangschool.com/member_login.php
- 상담 신청 폼: Google Form 또는 카카오톡 채널 연결 예정

## 배포 후 확인

1. 카카오톡 공유 디버거: https://developers.kakao.com/tool/debugger/sharing
2. Facebook OG 디버거: https://developers.facebook.com/tools/debug/
3. 구글 Search Console에 sitemap.xml 등록

## 운영

- 운영사: 거상스쿨(주)
- 대표: 임헌수
- 관련: 거상마케팅센터
