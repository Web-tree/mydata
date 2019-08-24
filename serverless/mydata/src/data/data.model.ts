import {IsIn, IsNotEmpty, IsNotIn, IsUUID, Matches, MaxLength} from 'class-validator';
import {Ownable} from '../Ownable';
import {UUID} from 'aws-sdk/clients/inspector';
import {Usage} from './usage.model';

export class Data implements Ownable {
    @IsUUID('4', {groups: ['create', 'get', 'update']})
    userId?: UUID;
    @IsIn([
        'email',
        'names',
        'documents',
        'address',
        'other'
    ], {
        groups: ['create']
    })
    @IsNotIn(['', 'other'], {
        groups: ['update']
    })
    type?: string;
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
    usage?: Usage;
}
