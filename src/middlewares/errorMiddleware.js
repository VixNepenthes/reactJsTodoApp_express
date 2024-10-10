import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

// Middleware xử lý lỗi tập trung trong ứng dụng
export const errorHandlingMiddleware = (error, req, response) => {
  // Nếu dev không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!error.statusCode) error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  const responseError = {
    statusCode: error.statusCode,
    message: error.message || StatusCodes[error.statusCode], //Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: error.stack
  }

  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  //   Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group

  //   Trả responseError về phía Front-end
  response.status(responseError.statusCode).json(responseError)
}
