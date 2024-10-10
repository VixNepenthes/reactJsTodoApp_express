import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
async function isAuthorized(request, response, next) {
  const accessTokenFromCookie = request.cookies?.accessToken
  if (!accessTokenFromCookie) {
    response.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! (Token not found)' })
    return
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenFromCookie,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    console.log(accessTokenDecoded)
    request.jwtDecoded = accessTokenDecoded

    next()
  } catch (error) {
    if (error.message?.includes('jwt expired')) {
      response.status(StatusCodes.GONE).json({ message: 'Need to refresh token' })
      return
    }

    response.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! Please Login' })
  }
}
export const authMiddleware = {
  isAuthorized
}
