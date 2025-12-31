import supabase from "../db/connectSupabase.js";


export const getAllUsers = async () => {
  const { data, error } = await supabase.from("users").select();
  
  return data;
};

export const checkUser = async (username,password) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("username", username);
  if (data.length === 0) {
    return `user not found !`
  } else {
    if(data[0].password !== password){
        return `wrong password!`
    }else{

        return `userFound!`
    }
  }
};
export const checkUserId = async (username,userId) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("username", username);
  if (data.length === 0) {
    return `user not found !`
  } else {
    if(data[0].id !== userId){
        return `wrong userId!`
    }else{

        return `userIdFound!`
    }
  }
};