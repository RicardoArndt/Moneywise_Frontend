import { Observable } from "rxjs";
import { Table } from "../table/models/table";

export interface ICrudService<TItem> {
    readAll(): Observable<Table>;
    update(id: number, item: TItem): Observable<Response>;
    delete(id: number): Observable<Response>;
    updateOrCreate(): Observable<Response>;
}