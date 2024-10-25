import { z } from "zod";
import { calculateAge } from "../util";

export const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password charactor must be greater than 6"
    }),
})

// collect member information
export const memberProfileSchema = z.object({
    gender: z.string().min(1),
    description: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    dateOfBirth: z.string().min(1, {
        message: 'Date of birth is required'
    }).refine(dateString => {
        const age = calculateAge(new Date(dateString));
        return age >= 0
    }, {
        message: 'Age can not be less than 0'
    })
})

export const patientProfileSchema = z.object({
    medicalHistory: z.string().min(1)
})

export const doctorProfileSchema = z.object({
    field: z.string().min(1)
})

export const adminProfileSchema = z.object({
    secretKey: z.string().min(1)
})

const combinedRegisterSchema = registerSchema.and(memberProfileSchema);
export const patientRegisterSchema = combinedRegisterSchema.and(patientProfileSchema);
export const doctorRegisterSchema = combinedRegisterSchema.and(doctorProfileSchema);
export const adminRegisterSchema = combinedRegisterSchema.and(adminProfileSchema);
export type PatientRegisterSchema = z.infer<typeof registerSchema & typeof memberProfileSchema & typeof patientProfileSchema>;
export type DoctorRegisterSchema = z.infer<typeof registerSchema & typeof memberProfileSchema & typeof doctorProfileSchema>;
export type AdminRegisterSchema = z.infer<typeof registerSchema & typeof memberProfileSchema & typeof adminProfileSchema>;
export type PatientProfileSchema = z.infer<typeof memberProfileSchema & typeof patientProfileSchema>;
export type DoctorProfileSchema = z.infer<typeof memberProfileSchema & typeof doctorProfileSchema>;
