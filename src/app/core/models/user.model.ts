export interface User {
    id: number
    username: string
    passwordHash: string
    role: string
    customer?: Customer
}

export interface Customer {
    userId: number
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    address: string
    user?: User
}

export interface ProfileUpdateRequest {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    address: string
    username: string
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
}
