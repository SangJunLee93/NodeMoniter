# Requirements: NodeMoniter

> Last updated: 2026-04-28

## Features

### F-001: Node.js 프로세스 목록 표시
- **Priority**: High
- **Status**: Todo
- **Acceptance Criteria**:
  - [ ] 현재 실행 중인 Node.js 프로세스 전체를 목록으로 표시한다
  - [ ] PID, 프로세스명, CPU 사용률, 메모리 사용량을 컬럼으로 표시한다
  - [ ] 목록은 실시간(주기적 폴링)으로 갱신된다

#### Tasks
- [ ] T-001-1: `ps` / `pidof` 등 시스템 명령으로 Node.js 프로세스 조회 로직 구현
- [ ] T-001-2: 프로세스 목록 UI 테이블 컴포넌트 구현
- [ ] T-001-3: 폴링 주기 설정 및 자동 갱신 구현

### F-002: 프로세스 ↔ 프로젝트 매핑
- **Priority**: High
- **Status**: Todo
- **Acceptance Criteria**:
  - [ ] PID로부터 실행 경로(cwd)를 조회해 어떤 프로젝트 폴더인지 표시한다
  - [ ] `package.json`의 `name` 필드를 읽어 프로젝트명으로 표시한다
  - [ ] 프로젝트명을 알 수 없는 경우 경로를 fallback으로 표시한다

#### Tasks
- [ ] T-002-1: PID → cwd 조회 로직 구현 (`lsof` 또는 `/proc` 활용)
- [ ] T-002-2: cwd 내 `package.json` 파싱해 프로젝트명 추출
- [ ] T-002-3: 프로젝트명 컬럼을 프로세스 목록에 통합

### F-003: 좀비 프로세스 감지 및 경고
- **Priority**: High
- **Status**: Todo
- **Acceptance Criteria**:
  - [ ] 좀비 상태(Z) 프로세스를 감지해 목록에서 시각적으로 구분 표시한다
  - [ ] 좀비 프로세스 발생 시 사용자에게 알림을 표시한다
  - [ ] 좀비 프로세스를 선택해 강제 종료할 수 있다

#### Tasks
- [ ] T-003-1: 프로세스 상태(state) 필드 조회 및 파싱
- [ ] T-003-2: 좀비 프로세스 하이라이트 UI 처리
- [ ] T-003-3: 강제 종료(`kill -9`) 기능 구현 및 확인 다이얼로그 추가

### F-004: GUI 앱 (macOS)
- **Priority**: High
- **Status**: Todo
- **Acceptance Criteria**:
  - [ ] macOS에서 독립 실행 가능한 GUI 앱으로 동작한다
  - [ ] 활성 상태 보기와 유사한 테이블 기반 UI를 제공한다
  - [ ] 앱을 닫지 않고 백그라운드에서 계속 모니터링한다

#### Tasks
- [ ] T-004-1: 프레임워크 선정 (Electron / Tauri / SwiftUI 등)
- [ ] T-004-2: 메인 윈도우 레이아웃 구성
- [ ] T-004-3: 시스템 트레이 상주 기능 구현

### F-005: 프로세스 상세 정보 조회
- **Priority**: Medium
- **Status**: Todo
- **Acceptance Criteria**:
  - [ ] 프로세스 선택 시 상세 패널에서 실행 명령어, 포트, 업타임을 확인할 수 있다
  - [ ] 해당 프로세스가 사용 중인 포트 번호를 표시한다

#### Tasks
- [ ] T-005-1: 선택된 PID의 상세 정보 조회 로직 구현
- [ ] T-005-2: `lsof -i` 로 포트 매핑 조회
- [ ] T-005-3: 상세 정보 사이드 패널 UI 구현

### F-006: 프로세스 종료
- **Priority**: Medium
- **Status**: Todo
- **Acceptance Criteria**:
  - [ ] 목록에서 프로세스를 선택해 종료할 수 있다
  - [ ] 종료 전 확인 다이얼로그를 표시한다
  - [ ] 종료 후 목록이 즉시 갱신된다

#### Tasks
- [ ] T-006-1: 선택 프로세스 종료 기능 구현
- [ ] T-006-2: 확인 다이얼로그 UI 구현
- [ ] T-006-3: 종료 후 목록 즉시 갱신 처리
