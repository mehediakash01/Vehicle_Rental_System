import { pool } from "../../config/dB";

const createUser = async(name:string,loweredMail:string,hashedPassword:string,phone:string,fixedRole:string)=>{
     const result = await pool.query(
          `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING * `,
          [name, loweredMail, hashedPassword, phone, fixedRole]
        );
        return result;
}
// get all user
const getUser = async()=>{
  const result = await  pool.query(`SELECT * FROM users`);
  return result

}
const updateUser = async(name:string,email:string,phone:string,role:string,id:string|undefined)=>{
  const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
      [name,email, phone, role,id]
    );
    return result;

}

export const userServices = {
    createUser,
    getUser,
    updateUser
}