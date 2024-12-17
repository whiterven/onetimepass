 // app/signup/actions.ts
 "use server";
 import { revalidatePath } from "next/cache";

 export async function signUp(formData: FormData) {
     const name = formData.get("name")
     const email = formData.get("email")
     const password = formData.get("password")

     if(typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
       return {
         error: "Invalid Data"
       }
     }


     try {
       const response = await fetch("/api/auth/signup", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           fullName: name,
           email,
           password,
         }),
       });

       if (!response.ok) {
          const errorData = await response.json();
         return {error: errorData.error}
       }
          revalidatePath('/signin')
        return {success: true}

     } catch (error) {
       console.error("Error during signup:", error);
       return { error: "Something went wrong." };
     }
 }