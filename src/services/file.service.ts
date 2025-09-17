// import { FileImageInterface } from "@/interfaces/file.interface"
// import api from "@/lib/api"
// import { type AxiosResponse } from "axios"

// export const CrearFile = async (file: FormData): Promise<FileImageInterface>  => {

//     const option = {
//         headers: {
//             "Content-Type": "multipart/form-data",
//           },
//     }
    
//     const response: AxiosResponse<FileImageInterface> = await api.post(`cloudinary/filesave`, file , option  )

//     const newFileImage: FileImageInterface = {
//         photo:response.data.photo
//     } 

//     return newFileImage

// }