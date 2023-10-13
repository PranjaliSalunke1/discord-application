module.exports = function getUserIDs(message) {
  console.log(message);
  let authorID = message.user.id;
  let mentionedUser = message.options.getUser("player2");
  let mentionedUserID = mentionedUser ? mentionedUser.id : null;

  return {
    authorID: authorID,
    mentionedUser: mentionedUserID,
  };
};
