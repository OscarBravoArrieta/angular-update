 export interface User {
     id?: number,
     email: string
     name: string
     password: string
     role?: string
     avatar?: string

 }
 export interface UserToUpdate {
     email: string
     name: string
 }

 export interface UserToLog {
     email: string
     password: string
 }

 export interface Email{
     email: string
 }

 export interface EmailIsAvailable {

     isAvailable: boolean

 }

 export interface Token {

     token: string
     refreshToken: string

 }

 export interface AccountError {

     field: string | null
     message: string | null
     code: string

 }

 export interface UserProfile {

     id: string
     name: string
     avatar: string

 }

 export interface UserToRegister {

     firstName: string
     lastName: string
     email: string
     password: string

 }

 export interface RegisterResult {

     requiresConfirmation: boolean | null

 }


