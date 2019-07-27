import {IsNotEmpty, IsUUID, Matches, MaxLength} from 'class-validator';
import {Ownable} from '../Ownable';
import {UUID} from 'aws-sdk/clients/inspector';

export class Data implements Ownable {
    @IsUUID()
    userId?: UUID;
    @IsNotEmpty({
        groups: ['create', 'get', 'update']
    })
    @MaxLength(50, {
        groups: ['create', 'get', 'update']
    })
    @Matches(/^[a-z0-9-]*$/, {
        message: 'Name can contain only letters, numbers and dash.',
        groups: ['create', 'get', 'update']
    })
    name: string;
    @MaxLength(300, {
        groups: ['create', 'update']
    })
    value?: string;
    createdAt?: number;
    updatedAt?: number;
}
