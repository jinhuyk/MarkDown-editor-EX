# MarkDown Editor by TypeScript 

## 구현 내용
- bootstrap 사용
- markdown tag -> HTML tag mapping
- using class
- visitor pattern
- chaining pattern in tag

## 기본 구형 사항
- 마크다운을 파싱하는 애플리케이션 제작
- 사용자는 텍스트 영역에 입력
- 텍스트 영역이 바뀔때 문서 전체 재파싱
- 엔터키를 누른 곳을 기준으로 문서 분리
- 시작문자로 마크다운인지 아닌지 판단
- H1, H2, H3 태그 구현
- ---- 가로줄 변경
- 마크다운으로 시작핮 않는 줄은 문단 취급
- 결과는 부트스트랩 레이블에 표시
- 텍스트 영역이 비었다면 레입르은 빈문단을 포함

## 구현 과정
1. UI 제작 