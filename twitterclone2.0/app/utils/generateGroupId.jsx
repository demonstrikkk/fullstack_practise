export function generateChatId(email1, email2) {
  return [email1, email2].sort().join('-');
}
