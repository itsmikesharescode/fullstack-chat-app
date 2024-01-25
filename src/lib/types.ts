
// server kit actions type
export type ServerNews<T> = {
    status: number
    type: string
    data: T
};

export type Message_List = {
    id: number
    created_at: string
    user_email: string
    user_display_name: string
    user_message: string
}
