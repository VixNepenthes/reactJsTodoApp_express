// Những domain được phép truy cập tới tài nguyên của server
export const WHITELIST_DOMAINS = [
  // 'http://localhost:3000'
  // Không cần localhost nữa vì ở file config/cors đã luôn cho phép môi trường dev
  // ví dụ sau này sẽ deploy lên domain chính thức
  // 'https://trello-web-sepia.vercel.app'
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}
