import { IPagedListMetaData } from "src/app/shared/interfaces/paged-list-meta-data";
import { CreatePermissionDto } from "./permission";

export class RoleDto {
    nameAr: string | undefined;
    nameEn: string | undefined;
    id: number;
    code: string | undefined;
    isActive:boolean| undefined;
}
export class CreateRoleCommand {
    nameAr: string | undefined;
    nameEn: string | undefined;
    code: string | undefined;
    isActive:boolean| undefined;
    permissions:CreatePermissionDto[]
}
export class EditRoleCommand {
    nameAr: string | undefined;
    nameEn: string | undefined;
    id: number;
    code: string | undefined;
    isActive:boolean| undefined;
    permissions:CreatePermissionDto[]
}

export interface IRoleDtoPageList {
    metadata: IPagedListMetaData;
    items: RoleDto[] | undefined;
}
export class DeleteListRoleCommand{
    ids: number[] | undefined;
}