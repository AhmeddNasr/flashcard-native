import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.db");

export default function generateRandomCards() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const handleSubmitDb = (insertArray) => {
    db.transaction((tx) => {
      insertArray.forEach((card) => {
        tx.executeSql(
          "INSERT INTO cards (question_text, question_image, answer_text, answer_image, class_id) values (?, ?, ?, ?, ?)",
          [
            card.question_text ? card.question_text : null,
            card.question_image ? card.question_image : null,
            card.answer_text ? card.answer_text : null,
            card.answer_image ? card.answer_image : null,
            2,
          ],
          (_, resultSet) => {
            console.log(resultSet);
          },
          (_, error) => {
            console.log(error);
          }
        );
      });
    });
  };

  let insertArray = [];
  //500 cards
  for (let i = 0; i < 500; i++) {
    let question = "";
    let answer = "";
    //between 1 and 151 letters
    let wordLength = Math.floor(Math.random() * 150) + 1;
    for (let q = 0; q < wordLength; q++) {
      question += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      answer += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    insertArray.push({ question_text: question, answer_text: answer });
  }
  handleSubmitDb(insertArray);
}
