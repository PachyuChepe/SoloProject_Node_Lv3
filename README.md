# SoloProject_Node_Lv3
노드 심화 개인과제<br><br><br>

### Git 명령어 정리
```
// 브랜치 생성 및 파일 이동
git switch -c <브랜치명>
git checkout -b <브랜치명>



// 로컬 브랜치 이동
git checkout <브랜치명>

// 최신 상태로 업데이트
git pull

// 현재 위치의 브랜치에서 해당 브랜치의 내용을 병합
git merge <병합할 브랜치 명>

// 변경 사항 원격 저장소 푸시
git push



// 커밋 기록(commit log) 유지 & 레포지토리(Git Repository) 병합
git clone <옮겨 담을 레포지토리 URL>

// 병합할 레포지토리
git subtree add --prefix=하위디렉토리명 <병합할 레포지토리 URL> <브랜치명>
```