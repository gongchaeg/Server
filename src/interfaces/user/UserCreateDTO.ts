export interface UserCreateDTO {
    profileImage: string|null,
    nickname: string|null,
    intro: string|null,
    social_platform: string;
    social_id: string;
}