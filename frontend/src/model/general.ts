export type View = "sections" | "assignments" | "people" | "requests" | "settings" | "home" | "my requests" | "surveys"

export const AdminViews = ["sections", "assignments", "surveys", "people", "requests", "settings"] as View[]

export const StaffViews = ["sections", "assignments", "surveys", "people", "requests"] as View[]

export const StudentViews = ["home", "my requests", "surveys", "people", "settings"] as View[]