// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { registerClient } from "@/services/client.service";
// import { DocumentType } from "@/utils";
// import { CheckedState } from "@radix-ui/react-checkbox";
// import { Eye, EyeOff } from "lucide-react";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export default function RegisterPage() {
//   const navigate = useNavigate();

//   const [accept, setAccept] = useState(false);
//   const [acceptNoti, setAcceptNoti] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     handleSubmit,
//     register,
//     control,
//     formState: { errors },
//   } = useForm<RegisterClientInputs>({
//     defaultValues: {
//       name: "",
//       lastname: "",
//       email: "",
//       phone: "",
//       username: "",
//       password: "",
//       confirPassword: "",
//       documentType: "",
//       documentNumber: "",
//     },
//   });

//   const handleCheckboxChange = (checked: CheckedState) => {
//     setAccept(checked === true); // Solo lo tomamos como true si es true
//   };

//   const handleCheckboxChangeNoti = (checked: CheckedState) => {
//     setAcceptNoti(checked === true); // Solo lo tomamos como true si es true
//   };

//   const validateDocumentNumber = (value: string) => {
//     const documentType = control._formValues.documentType;
//     if (!documentType) return "Seleccione primero un tipo de documento";
//     if (documentType === "DNI" && !/^\d{8}$/.test(value)) {
//       return "El DNI debe tener exactamente 8 dígitos";
//     }
//     if (documentType === "Pasaporte" && !/^\d{9}$/.test(value)) {
//       return "El Pasaporte debe tener exactamente 9 dígitos";
//     }
//     if (documentType === "Carnet de Extranjería" && !/^\d{9}$/.test(value)) {
//       return "El Carnet de Extranjería debe tener exactamente 9 dígitos";
//     }
//     return true;
//   };

//   const onSubmit = async (values: RegisterClientInputs) => {
//     if (!accept) {
//       toast.warning("Debes aceptar los términos y condiciones");
//       return;
//     }

//     if (!acceptNoti) {
//       toast.warning(
//         "Debes aceptar recibir novedades, comunicados y promociones"
//       );
//       return;
//     }

//     const payload: RegisterClientDto = {
//       name: values.name,
//       lastname: values.lastname,
//       email: values.email,
//       phone: values.phone,
//       username: values.username,
//       password: values.password,
//       documentTypeId: values.documentType,
//       documentNumber: values.documentNumber,
//     };

//     setLoading(true);

//     const response = await registerClient(payload);

//     setLoading(false);

//     if (!response?.success) {
//       toast.warning(response?.message, { position: "top-center" });
//       return;
//     }

//     toast.success(response?.message, { position: "top-center" });
//     navigate("/auth");
//   };
//   return (
//     <div className="w-full mx-auto sm:w-[500px] lg:w-[450px] xl:w-[500px] mt-5 sm:mt-0">
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="space-y-4">
//           <div className="flex flex-col sm:flex-row  gap-2">
//             <div className="flex flex-col w-full gap-1.5">
//               <Label htmlFor="name">Nombre</Label>
//               <Input
//                 {...register("name", {
//                   required: "El nombre es requerido",
//                 })}
//                 type="text"
//                 id="name"
//                 placeholder="Ingrese su nombre"
//               />
//               {errors.name && (
//                 <p className="msg-error">{errors.name.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col w-full  gap-1.5">
//               <Label htmlFor="lastname">Apellido</Label>
//               <Input
//                 {...register("lastname", {
//                   required: "El apellido es requerido",
//                 })}
//                 type="text"
//                 id="lastname"
//                 placeholder="Ingrese su apellido"
//               />
//               {errors.lastname && (
//                 <p className="msg-error">{errors.lastname.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-col  sm:flex-row gap-2">
//             <div className="flex flex-col w-full gap-1.5">
//               <Label htmlFor="documentType">Tipo de documento</Label>
//               <Controller
//                 name="documentType"
//                 control={control}
//                 rules={{ required: "El tipo de documento es requerido" }}
//                 render={({ field }) => (
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Seleccionar" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {DocumentType?.map((type) => (
//                         <SelectItem key={type.id} value={type.id.toString()}>
//                           {type.nombre}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//               {errors.documentType && (
//                 <p className="msg-error">{errors.documentType.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col w-full gap-1.5">
//               <Label htmlFor="documentNumber">Numero de documento</Label>
//               <Input 
//                 {...register("documentNumber", {
//                   required: "El número es requerido",
//                   validate: validateDocumentNumber,
//                 })}
//                 type="text"
//                 id="documentNumber"
//                 placeholder="Numero de documento"
//               />
//               {errors.documentNumber && (
//                 <p className="msg-error">{errors.documentNumber.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-col w-full gap-1.5">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               {...register("email", {
//                 required: "El email es requerido",
//                 pattern: {
//                   value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
//                   message: "El email es invalido",
//                 },
//               })}
//               type="email"
//               id="email"
//               placeholder="Ingrese su email"
//             />
//             {errors.email && (
//               <p className="msg-error">{errors.email.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col w-full  gap-1.5">
//             <Label htmlFor="phone">Telefono</Label>
//             <Input
//               {...register("phone", {
//                 required: "El telefono es requerido",
//                 pattern: {
//                   value: /^[0-9]{9}$/, // 10 digits
//                   message: "El telefono es invalido",
//                 },
//               })}
//               type="tel"
//               id="phone"
//               placeholder="Ingrese su telefono"
//               maxLength={9}
//               minLength={9}
//             />
//             {errors.phone && (
//               <p className="msg-error">{errors.phone.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col w-full  gap-1.5">
//             <Label htmlFor="username">Nombre de usuario</Label>
//             <Input
//               {...register("username", {
//                 required: "El nombre de usuario es requerido",
//               })}
//               type="username"
//               id="username"
//               placeholder="Ingrese su nombre de usuario"
//             />
//             {errors.username && (
//               <p className="msg-error">{errors.username.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col gap-5 sm:flex-row lg:gap-2">
//             <div className="flex flex-col w-full gap-1.5">
//               <Label htmlFor="password">Contraseña</Label>
//               <div className="relative w-full">
//                 <Input
//                   {...register("password", {
//                     required: "La contraseña es requerida",
//                     minLength: {
//                       value: 6,
//                       message: "La contraseña debe tener al menos 6 caracteres",
//                     },
//                   })}
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   placeholder="Ingrese su contraseña"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className={`absolute right-3 -translate-y-1/2 text-gray-500 cursor-pointer ${
//                     errors.password ? "top-1/3" : "top-1/2"
//                   }`}
//                 >
//                   {showPassword ? <Eye /> : <EyeOff />}
//                 </button>

//                 {errors.password && (
//                   <p className="msg-error">{errors.password.message}</p>
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-col w-full gap-1.5">
//               <Label htmlFor="confirPassword">Confirmar contraseña</Label>
//               <div className="relative w-full">
//                 <Input
//                   {...register("confirPassword", {
//                     required: "La confirmación es requerida",
//                     minLength: {
//                       value: 6,
//                       message: "La contraseña debe tener al menos 6 caracteres",
//                     },
//                   })}
//                   type={showConfirmPassword ? "text" : "password"}
//                   id="confirPassword"
//                   placeholder="Confirme su contraseña"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className={`absolute right-3 -translate-y-1/2 text-gray-500 cursor-pointer ${
//                     errors.confirPassword ? "top-1/3" : "top-1/2"
//                   }`}
//                 >
//                   {showConfirmPassword ? <Eye /> : <EyeOff />}
//                 </button>

//                 {errors.confirPassword && (
//                   <p className="msg-error">{errors.confirPassword.message}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2 mt-4">
//           <Checkbox
//             id="terms"
//             checked={accept}
//             onCheckedChange={handleCheckboxChange}
//           />
//           <label
//             htmlFor="terms"
//             className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//           >
//             Aceptar términos y condiciones
//           </label>
//         </div>

//         <div className="flex items-center space-x-2 my-3">
//           <Checkbox
//             id="terms2"
//             checked={acceptNoti}
//             onCheckedChange={handleCheckboxChangeNoti}
//           />
//           <label
//             htmlFor="terms2"
//             className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//           >
//             Aceptar recibir novedades, comunicados y promociones
//           </label>
//         </div>

//         <Button
//           className="w-full mt-4 cursor-pointer"
//           type="submit"
//           disabled={loading}
//         >
//           {loading ? "Registrando..." : "Registrarse"}
//         </Button>

//         <div className="mt-4 flex flex-col justify-center items-center">
//           <p className="text-sm text-gray-600">¿Ya tienes una cuenta?</p>
//           <Link
//             className="text-sm font-semibold text-[#0667ff] hover:underline"
//             to="/auth"
//           >
//             Iniciar sesión
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }
