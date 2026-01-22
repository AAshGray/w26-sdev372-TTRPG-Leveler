export default function randomString(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}