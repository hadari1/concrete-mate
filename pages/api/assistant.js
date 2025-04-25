
export default async function handler(req, res) {
  const { message } = req.body;
  // כאן אפשר לחבר את GPT האמיתי עם OpenAI API ו-Assistant ID
  res.status(200).json({ message: "תשובה לדוגמה מהסוכן. בקרוב יחובר לסוכן האמיתי שלך!" });
}
