export default {
  NULL_VALUE: "필요한 값이 없습니다.",
  OUT_OF_VALUE: "파라미터 값이 잘못되었습니다.",
  NOT_FOUND: "잘못된 경로입니다.",
  BAD_REQUEST: "잘못된 요청입니다.",

  // 회원가입 및 로그인
  SIGNUP_SUCCESS: "회원 가입 성공",
  SIGNUP_FAIL: "회원 가입 실패",
  SIGNIN_SUCCESS: "로그인 성공",
  SIGNIN_FAIL: "로그인 실패",
  ALREADY_NICKNAME: "이미 사용중인 닉네임입니다.",


  // 유저
  READ_USER_SUCCESS: "유저 조회 성공",
  READ_USER_FAIL: "유저 조회 실패",
  READ_ALL_USERS_SUCCESS: "모든 유저 조회 성공",
  UPDATE_USER_SUCCESS: "유저 수정 성공",
  DELETE_USER_SUCCESS: "유저 탈퇴 성공",
  DELETE_USER_FAIL: "유저 탈퇴 실패",
  NO_USER: "탈퇴했거나 가입하지 않은 유저입니다.",
  SEARCH_USER_SUCCESS: "유저 검색 성공",
  SEARCH_USER_FAIL: "유저 검색 실패",
  NULL_NICKNAME: "닉네임 값이 없습니다.",
  FAIL_CHECK_NICKNAME: "닉네임 중복 검사 실패",
  SUCCESS_CHECK_NICKNAME: "닉네임 중복 검사 성공",

  // 이미지
  NO_IMAGE: "이미지가 없습니다.",
  CREATE_IMAGE_SUCCESS: "이미지 저장 성공",
  CREATE_IMAGE_FAIL: "이미지 저장 실패",


  // 토큰
  CREATE_TOKEN_SUCCESS: "토큰 재발급 성공",
  EXPIRED_TOKEN: "토큰이 만료되었습니다.",
  EXPIRED_ALL_TOKEN: "모든 토큰이 만료되었습니다. 재로그인 해주세요.",
  INVALID_REFRESH_TOKEN: "유효하지 않은 리프레시 토큰입니다",
  INVALID_TOKEN: "유효하지 않은 토큰입니다.",
  VALID_TOKEN: "유효한 토큰입니다.",
  EMPTY_TOKEN: "토큰 값이 없습니다.",

  // 책장
  CREATE_MYBOOK_SUCCESS: "책 등록 성공",
  CREATE_MYBOOK_FAIL: "책 등록 실패",
  READ_MYBOOK_SUCCESS: "등록된 책 상세 조회 성공",
  READ_MYBOOK_FAIL: "해당하는 책을 찾을 수 없습니다.",
  DELETE_MYBOOK_SUCCESS: "등록한 책 삭제 성공",
  DELETE_MYBOOK_FAIL: "등록한 책 삭제 실패",
  UPDATE_MYBOOK_SUCCESS: "등록한 책 수정하기 성공",
  UPDATE_MYBOOK_FAIL: "등록한 책 수정하기 실패",
  READ_BOOKSHELF_SUCCESS: "책장 불러오기 성공",
  READ_BOOKSHELF_FAIL: "책장 불러오기 실패",
  READ_FRIEND_BOOKSHELF_SUCCESS: "친구 책장 불러오기 성공",
  READ_FRIEND_BOOKSHELF_FAIL: "친구 책장 불러오기 실패",

  // 서버 내 오류
  INTERNAL_SERVER_ERROR: "서버 내 오류",

  INVALID_PASSWORD: "잘못된 비밀번호입니다.",

  // 친구
  NOT_FOUND_FRIEND_ID: "잘못된 친구 id 입니다",
  SUCCESS_RECOMMEND_BOOK: "친구에게 책 추천하기 성공",
  FAIL_RECOMMEND_BOOK: "친구에게 책 추천하기 실패",
  FAIL_FOUND_NICKNAME: "닉네임을 찾을 수 없습니다.",
  FAIL_GET_USER: "사용자 검색 실패",
  SUCCESS_GET_USER: "사용자 검색 성공",
  FAIL_FOUND_FRIEND_ID: "친구 닉네임 찾기 실패",
  SUCCESS_POST_FOLLOW: "친구 팔로우 성공",
  FAIL_POST_FOLLOW: "이미 팔로우한 사용자 입니다.",
  DELETE_FRIEND_SUCCESS: "친구 팔로우 취소 성공",
  DELETE_FRIEND_FAIL: "친구 팔로우 취소 실패",
  FAIL_NO_FRIEND: "팔로우 하지 않는 친구입니다",
  FAIL_NO_FRIEND_EXIST: "존재하지 않는 유저입니다.",
  FAIL_REPORT_INFO: "친구 신고하기 정보 조회 실패",
  FAIL_REPORT_POST: "친구 신고하기 실패",
  SUCCESS_REPORT_POST: "친구 신고하기 성공",
  SUCCESS_BLOCK_FRIEND: "친구 차단하기 성공",
  FAIL_BLOCK_FRIEND: "친구 차단하기 실패",
  SUCCESS_CANCLE_BLOCK_FIREND: "친구 차단 해제 성공",
  FAIL_CANCLE_BLOCK_FRIEND: "친구 차단 해제 실패",
  SUCCESS_GET_BLOCK_LIST: "친구 차단 리스트 조회 성공",
  FAIL_GET_BLOCK_LIST: "친구 차단 리스트 조회 실패",

  // 추천
  FAIL_GET_RECOMMEND: "추천 책 조회 실패",
  SUCCESS_GET_RECOMMEND: "추천 책 조회 성공",

  //pick
  FAIL_PATCH_PICK: "책 pick 수정 실패",
  SUCCESS_PATCH_PICK: "책 pick 수정 성공",
  FAIL_GET_BOOK: "책 전체 조회 실패",
  SUCCESS_GET_BOOK: "책 전체 조회 성공",

  // alarm
  FAIL_GET_ALARM: "알림 조회 실패",
  SUCCESS_GET_ALARM: "알림 조회 성공",

  // report
  MAIL_TITLE: "[Report] 사용자 신고",
  REASON_ONE: "부적절한 게시글",
  REASON_TWO: "욕설 및 비하 발언",
  REASON_THREE: "홍보성 컨텐츠",
  REASON_FOUR: "닉네임 신고",
  REASON_FIVE: "기타",


};