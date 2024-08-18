import db from "./db"

export const createUser = (email, password) =>{
  const result = db.prepare('insert into users (email, password) values(?, ?)').run(email, password)
  return result.lastInsertRowid;
}

export const getUserByEmail = (email)=>{
  const result = db.prepare("select * from users where email = ?").get(email);
  return result;
}