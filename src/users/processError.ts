import { ApolloError } from 'apollo-server-express';

const USER_ERROR = {
  ALREADY_EXIST_EMAIL: {
    code: 'ALREADY_EXIST_EMAIL',
    message: '이미 사용중인 이메일입니다.',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다.',
  },
  PASSWORD_NOT_CORRECT: {
    code: 'PASSWORD_NOT_CORRECT',
    message: '비밀번호가 다릅니다.',
  },
  NO_VERIFICATION_FOUND: {
    code: 'NO_VERIFICATION_FOUND',
    message: '이메일 인증내역이 없습니다.',
  },
};

class UserError extends ApolloError {
  constructor(error) {
    super(error.message, error.code, {});
  }
}

export { USER_ERROR };
export default UserError;
