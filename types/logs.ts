export type LogType = 'user' | 'video' | 'signal' | 'test' 

export interface Logs {
    id : string,
    title : string,
    discription : string,
    type : LogType,
    createdAt: Date;
    updatedAt: Date;
    createdBy: string; 
}