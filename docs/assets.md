# Asset Catalog

이 문서는 GitHub에서 자산 위치와 용도를 빠르게 파악하기 위한 카탈로그입니다. 앱에서 직접 참조하는 런타임 자산은 모두 `public/` 아래에 둡니다.

## Directory Map

```text
public/
  backgrounds/  엔딩/스테이지 배경
  characters/   멤버 기본 프로필 이미지
  fonts/        Pretendard subset fonts
  outfits/      콘셉트별 의상 보드 이미지
  posters/      랜딩/미션 포스터 이미지
```

## Posters

| File | Size | Used For |
| --- | --- | --- |
| `public/posters/front-cover.webp` | 1672 x 941 | 랜딩 커버, 제출용 화면 배경 |
| `public/posters/main-poster.webp` | 1672 x 941 | 메인 홍보/README 프리뷰 |
| `public/posters/dark-dopamine.webp` | 1536 x 2730 | `Dark Dopamine` 미션 포스터 |
| `public/posters/runway-crush.webp` | 1536 x 2730 | `Runway Crush` 미션 포스터 |
| `public/posters/soft-savior.webp` | 1536 x 2730 | `Soft Savior` 미션 포스터 |

## Character Images

| File | Member | Used For |
| --- | --- | --- |
| `public/characters/member-a-default.webp` | A / 작곡 멤버 | 선택 가능 메인 대화 대상 |
| `public/characters/member-b-default.webp` | 은오 | 비주얼 멤버 프로필 |
| `public/characters/member-c-default.webp` | 태훈 | 춤/랩 멤버 프로필 |
| `public/characters/member-d-default.webp` | 도진 | 보컬/비즈니스형 멤버 프로필 |
| `public/characters/member-e-default.webp` | 정민 | 리더 프로필 |

## Concept Boards

| File | Size | Concept |
| --- | --- | --- |
| `public/outfits/concept-dark-dopamine.png` | 640 x 360 | 블랙 레더, 스모키, 다크 테크웨어 |
| `public/outfits/concept-runway-crush.png` | 640 x 360 | 하이패션, 실크 셔츠, 글리터 |
| `public/outfits/concept-soft-savior.png` | 640 x 360 | 화이트 톤, 니트, 카디건 |

## Backgrounds

| File | Size | Used For |
| --- | --- | --- |
| `public/backgrounds/ending-stage.png` | 1280 x 720 | 엔딩 스테이지 배경 |

## Fonts

| File | Weight |
| --- | --- |
| `public/fonts/Pretendard-Regular.subset.woff2` | 400 |
| `public/fonts/Pretendard-Medium.subset.woff2` | 500 |
| `public/fonts/Pretendard-Bold.subset.woff2` | 700 |
| `public/fonts/Pretendard-ExtraBold.subset.woff2` | 800 |

Pretendard는 `app/globals.css`에서 `@font-face`로 등록합니다.

## Naming Rules

- 런타임에서 쓰는 이미지는 `public/<category>/<semantic-name>.<ext>` 형태로 둡니다.
- 파일명은 소문자 케밥 케이스를 사용합니다.
- 원본/중간 작업물은 앱 저장소 밖의 별도 아카이브나 디자인 툴에서 관리합니다.
- 같은 의미의 이미지는 `front-cover`, `main-poster`, `concept-*`처럼 역할이 드러나게 이름을 붙입니다.

## GitHub Upload Checklist

- `public/`에 앱에서 실제로 쓰는 압축 자산만 남깁니다.
- API 키, 프롬프트 실험 로그, 생성 원본 대용량 파일은 커밋하지 않습니다.
- 새 자산을 추가하면 이 문서와 해당 데이터 파일의 경로를 함께 업데이트합니다.
