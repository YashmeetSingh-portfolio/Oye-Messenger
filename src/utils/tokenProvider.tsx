import { supabase } from '../lib/supabase';

export const tokenProvider = async () => {
   const {data} = await supabase.functions.invoke('stream-tokens')
    console.log("Data from function:", data);
    return data?.token
 
}