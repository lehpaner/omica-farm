import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError as _observableThrow, of as _observableOf, AsyncSubject } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

import { Map } from 'mapbox-gl';

import { FarmDto, API_BASE_URL, ListResultDtoOfFarmDto, ListResultDtoOfAreaDto, AreaDto } from "@shared/service-proxies/service-proxies";
/////////////// UTILS
function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
    if(result !== null && result !== undefined)
        return _observableThrow(result);
    else {
        console.log("ERROR - UNKNOWN EXCEPTION");
    }
//        return _observableThrow(new SwaggerException(message, status, response, headers, null));
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next("");
            observer.complete();
        } else {
            let reader = new FileReader(); 
            reader.onload = function() { 
                observer.next(this.result);
                observer.complete();
            }
            reader.readAsText(blob); 
        }
    });
}
    //////////////EndUtils


@Injectable({ providedIn: 'root'})
export class LandService {
    private http: HttpClient;
    private baseUrl: string;
   
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    //behavior subject 4 land
    //selected:FarmDto =undefined;
    // private current_farm = new BehaviorSubject(this.selected);
    //currentFarm = this.current_farm.asObservable();
    //behaviour subject 4 map
    public selecteLand = new AsyncSubject<FarmDto>();
    public map = new AsyncSubject<Map>();
    

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    selectFarm(farm: FarmDto) {
        this.selecteLand.next(farm);
        this.selecteLand.complete();
      }
    /**
     * @return Success
     */
    landsGet(): Observable<ListResultDtoOfFarmDto> {
        let url_ = this.baseUrl + "/api/services/lands";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processLandsGet(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processLandsGet(<any>response_);
                } catch (e) {
                    return <Observable<ListResultDtoOfFarmDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<ListResultDtoOfFarmDto>><any>_observableThrow(response_);
        }));
    }

    protected processLandsGet(response: HttpResponseBase): Observable<ListResultDtoOfFarmDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? ListResultDtoOfFarmDto.fromJS(resultData200) : new ListResultDtoOfFarmDto();
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<ListResultDtoOfFarmDto>(<any>null);
    }

    /**
     * @param data (optional) 
     * @return Success
     */
    landsPost(data: FarmDto | null | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/lands";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(data);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processLandsPost(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processLandsPost(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processLandsPost(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }

    /**
     * @return Success
     */
    areasGet(id: number): Observable<ListResultDtoOfAreaDto> {
        let url_ = this.baseUrl + "/api/services/lands/{id}/areas";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processAreasGet(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processAreasGet(<any>response_);
                } catch (e) {
                    return <Observable<ListResultDtoOfAreaDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<ListResultDtoOfAreaDto>><any>_observableThrow(response_);
        }));
    }

    protected processAreasGet(response: HttpResponseBase): Observable<ListResultDtoOfAreaDto> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? ListResultDtoOfAreaDto.fromJS(resultData200) : new ListResultDtoOfAreaDto();
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<ListResultDtoOfAreaDto>(<any>null);
    }

    /**
     * @param data (optional) 
     * @return Success
     */
    areasPost(id: number, data: AreaDto | null | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/services/lands/{id}/areas";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(data);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processAreasPost(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processAreasPost(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processAreasPost(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }
}