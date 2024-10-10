import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { env } from '~/config/environment'
import ms from 'ms'
import { GET_DB } from '~/config/mongodb'
import { JwtProvider } from '~/providers/JwtProvider'
const USER_COLLECTION_NAME = 'users'

async function login(request, response) {
  try {
    const query = {
      email: request.body.email,
      password: request.body.password
    }
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne(query)
    if (!result) {
      response.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' })
      return
    }
    //Tạo thông tin payload để đính kèm trong token: bao gồm _id và email của user
    const userInfo = {
      id: result._id,
      fullname: result.fullname,
      email: result.email
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days'
    )
    /**
     * Xử lý trường hợp trả về http only cookie cho phía trình duyệt
     * maxAge - thời gian sống của cookie. Đừng nhầm với thời gian sống của token.
     */
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Trả về thông tin user cũng như sẽ trả về Tokens cho trường hợp phía  FE cần lưu Tokens vào localStorage
    response.status(StatusCodes.OK).json({ ...userInfo, accessToken, refreshToken })
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

async function logout(request, response) {
  try {
    response.clearCookie('accessToken')
    response.clearCookie('refreshToken')

    response.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

async function refreshToken(request, response) {
  try {
    const refreshTokenFromCookie = request.cookies?.refreshToken

    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenFromCookie,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h'
    )

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    response.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ' Refresh Token API failed' })
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
