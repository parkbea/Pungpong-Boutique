# 뿡뽕의상실

AI 여성복 디자인 스튜디오 — 옷 종류 · 핏 · 기장 · 소매 · 넥라인 · 색상 · 패턴 · 소재 · 디테일 · 신발을 고르면
실시간 SVG 미리보기로 확인하고, AI가 스튜디오 화보를 생성해 주는 웹앱입니다.

## 기술 스택

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** + **Framer Motion** (실시간 실루엣 모핑 애니메이션)
- **Pollinations.ai** 무료 이미지 생성 (서버 라우트에서 호출, 키 없이 동작)

## 시작하기

1. 의존성 설치

   ```bash
   npm install
   ```

2. 개발 서버 실행

   ```bash
   npm run dev
   ```

   <http://localhost:3000> 에서 확인할 수 있습니다. **API 키 없이 바로 동작합니다.**

3. (선택) 안정적인 이미지 생성을 위한 무료 토큰 — 무료 익명 등급은 혼잡 시 잠시 제한될 수
   있습니다. [enter.pollinations.ai](https://enter.pollinations.ai) 에서 GitHub 로그인으로 무료
   토큰을 발급(신용카드 불필요)받아 `.env.local`에 넣으면 제한이 크게 완화됩니다.

   ```bash
   # .env.local
   POLLINATIONS_TOKEN=발급받은_토큰
   ```

## 프로젝트 구조

| 경로 | 설명 |
| --- | --- |
| `src/lib/design.ts` | 옵션 정의(한/영 매핑)와 영어 이미지 프롬프트 빌더 |
| `src/lib/silhouette.ts` | 선택값 → SVG 패스 변환 (패스 구조를 고정해 Framer Motion `d` 보간 가능) |
| `src/components/Designer.tsx` | 3단계 플로우 상태 관리 및 화면 구성 |
| `src/components/Preview.tsx` | 실시간 의상 실루엣 미리보기 |
| `src/app/api/generate/route.ts` | 이미지 생성 서버 라우트 (Pollinations 호출, 혼잡/오류 핸들링) |
| `src/app/manifest.ts` | PWA 매니페스트 (앱 이름·아이콘·테마색) |
| `src/components/Pwa.tsx` | 서비스 워커 등록 + 설치 배너 |
| `public/sw.js` | 오프라인 앱 셸 캐싱 서비스 워커 |

## 태블릿/모바일에 앱으로 설치 (PWA)

배포된 사이트를 태블릿 브라우저로 열면 앱처럼 설치할 수 있습니다.

- **Android · Chrome**: 접속 시 하단에 "앱으로 설치하기" 배너가 뜹니다. 또는 메뉴(⋮) → "앱 설치 / 홈 화면에 추가".
- **iPad · Safari**: 공유 버튼 → "홈 화면에 추가".

설치하면 주소창 없는 전체화면(standalone)으로 실행되고, 한 번 방문한 뒤에는 오프라인에서도 화면이 뜹니다. (단, AI 이미지 생성은 인터넷 연결이 필요합니다.)

> 서비스 워커는 프로덕션 빌드(`npm run start`)에서만 등록됩니다. 개발 모드(`npm run dev`)에서는 캐싱 혼선을 막기 위해 비활성화됩니다.

## 배포

```bash
npm run build && npm run start
```

Vercel 등에 배포할 경우 환경 변수 `GEMINI_API_KEY`를 프로젝트 설정에 추가하세요.
PWA 설치는 **HTTPS**(또는 localhost)에서만 동작하므로, 실제 태블릿에서 설치하려면 HTTPS로 배포해야 합니다.
