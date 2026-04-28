# NodeMoniter

macOS용 Node.js 프로세스 모니터링 GUI 앱.
실행 중인 Node.js 프로세스를 프로젝트 단위로 시각화하고 좀비 프로세스를 감지한다.

## Stack
- Runtime: Electron
- Language: TypeScript (main + renderer 모두)
- UI: React + Tailwind CSS
- Build: electron-builder
- Package manager: npm

## Project Structure
```
NodeMoniter/
├── .meta/                    # 프로젝트 관리 파일 (소스 아님)
│   ├── CHANGELOG.md          # 변경 이력 (최근 30일)
│   ├── DECISIONS.md          # 아키텍처/설계 결정 기록
│   └── TRACKING.md           # 현재 진행 중인 작업 상태
├── src/
│   ├── main/                 # Electron main process
│   │   ├── index.ts          # 앱 진입점, BrowserWindow 생성
│   │   ├── ipc/              # IPC handler 등록
│   │   └── process/          # 프로세스 조회 로직 (ps, lsof 등)
│   └── renderer/             # Electron renderer process (React)
│       ├── App.tsx
│       ├── components/
│       └── hooks/
├── electron.vite.config.ts
├── tsconfig.json
├── package.json
└── REQUIREMENTS.md
```

## Architecture
- **Main process**: 시스템 명령(`ps`, `lsof`) 실행 및 프로세스 데이터 수집
- **IPC**: main ↔ renderer 간 데이터 통신 (`ipcMain` / `ipcRenderer`)
- **Renderer**: React로 UI 렌더링, IPC로 데이터 수신

## Commands
```bash
npm run dev       # 개발 서버 시작
npm run build     # 프로덕션 빌드
npm run typecheck # 타입 체크
```

## Conventions
- 파일명: camelCase (컴포넌트는 PascalCase)
- IPC 채널명: `kebab-case` (예: `get-process-list`)
- 시스템 명령 실행은 `src/main/process/` 에서만 — renderer에서 직접 shell 실행 금지

## Consistency Checks
코드 변경 시 아래를 확인한다.

- 새 IPC 채널 추가 → `REQUIREMENTS.md`에 대응하는 Feature/Task 존재 여부 확인
- 새 `src/main/process/` 모듈 추가 → 이 파일 Project Structure 업데이트
- 의존성 추가(`package.json`) → 이 파일 Stack 섹션 업데이트
- Feature 구현 완료 → `REQUIREMENTS.md` 해당 Task `[x]` 체크
- 아키텍처 변경 → 이 파일 Architecture 섹션 즉시 업데이트
