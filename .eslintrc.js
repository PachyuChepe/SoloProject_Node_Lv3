module.exports = {
  extends: ["airbnb-base", "plugin:node/recommended", "prettier"],
  ignorePatterns: ["sequelize/**/*"],
  rules: {
    "no-restricted-globals": "off",

    // 임포트 시 파일 확장자 입력 유무 확인
    "import/extensions": "off",

    // 임포트 문의 순서 관리 (라이브러리가 로컬 파일 임포트보다 먼저 오게)
    // "import/order": "off",

    // Node.js 버전에 따라 지원되지 않는 ECMAScript 문법 경고
    "node/no-unsupported-features/es-syntax": "off",

    // 함수가 모든 코드 경로에서 일관되게 값을 반환하게 함
    "consistent-return": "off",
  },
};
