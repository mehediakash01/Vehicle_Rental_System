import { pool } from "../../config/dB";

// get all user
const getUser = async()=>{
  const result = await  pool.query(`SELECT * FROM users`);
  return result

}
// update user
const updateUser = async(name:string,email:string,phone:string,role:string,userId:string|undefined)=>{
  const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
      [name,email, phone, role,userId]
    );
    return result;

}
// delete user
const deleteUser = async(userId:string|undefined)=>{
 const result =  await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`,[userId])
 return result;
}



export const userServices = {
   
    getUser,
    updateUser,
    deleteUser
}