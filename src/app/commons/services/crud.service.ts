import { Observable } from "rxjs";
import { Table } from "../table/models/table";

export interface ICrudService<TItem> {
    read(id: number): Observable<TItem | undefined>;
    readAll(): Observable<Table>;
    update(id: number, item: TItem): Observable<Response>;
    delete(id: number): Observable<Response>;
    commit(): Observable<Response>;
}