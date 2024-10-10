import JWT from 'jsonwebtoken'

/**
 * Function tạo mới một token- cần 3 tham số
 * userInfo: Những thông tin muốn đính kèm một token
 * secrectSignature: Chữ ký bí mật ( trên docs là privateKey)
 * tokenLife: thời gian sống token
 */
const generateToken = async (userInfo, secrectSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secrectSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Function kiểm tra token hợp lệ hay không
 */
const verifyToken = async (token, secrectSignature) => {
  try {
    return JWT.verify(token, secrectSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
