import { Inject, Injectable, EventEmitter } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AppCtx } from '../app.context';
import {  Node,  IResultRestModel, IDapiChangedEvent, IAuthChangedEvent} from '../model';
import {IQNode, IDataRep, INodeWhere } from '../nodes/model';
import { Subscription } from 'rxjs/Subscription';

/**
 * Data access api provides access to collections of data
 */
@Injectable()
export class DAPI {

securityChangeSubscription: Subscription;
canDo: boolean = false;
db: firebase.firestore.Firestore;

constructor(private _appCtx: AppCtx) { 
    this.securityChangeSubscription = this._appCtx.authChangedEvent.subscribe(u => this.onSecurityChanged(u))
    this.db = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    this.db.settings(settings);
}
/**
 * Create node in db
 * @param node 
 */
public nodeCreateAsync(node: IQNode): Promise<IResultRestModel> {
    return this.db.collection("DATAREP").add({
        OWNER: node.owner,
        PARENT: node.parent,
        SUBTYPE: node.subtype,
        NAME: node.name,
        STATUS: node.status,
        NUMBER: node.category,
        CREATED: node.createdOn,
        MODIFIED: node.modifiedOn,
        ED: JSON.stringify(node.extendedData)
    }).then((docRef:firebase.firestore.DocumentReference) => {
        node.id = docRef.id;
        let result: IResultRestModel  = { 
            result:'SUCESS',
            errorNumber: 0,
            message: 'Node created',
            data: node
        };
        return result;
    }).catch ((error) => {
        console.log('Something went wrong:', error.message);
        let result: IResultRestModel  = { 
            result:'ERROR',
            errorNumber: -1,
            message: error.message,
            data: null
        };
        return result;
    });
}
/**
 * 
 * @param node update node in db
 */
public nodeUpdateAsync(node: IQNode): Promise<IResultRestModel> {
    return this.db.collection("DATAREP").doc(node.id).set({
        OWNER: node.owner,
        PARENT: node.parent,
        SUBTYPE: node.subtype,
        NAME: node.name,
        STATUS: node.status,
        NUMBER: node.category,
        CREATED: node.createdOn,
        MODIFIED: node.modifiedOn,
        ED: JSON.stringify(node.extendedData)
    }).then(() => {
        let result: IResultRestModel  = { 
            result:'SUCESS',
            errorNumber: 0,
            message: 'Node updated',
            data: node
        };
        return result;
    }).catch ((error) => {
        console.log('Something went wrong:', error.message);
        let result: IResultRestModel  = { 
            result:'ERROR',
            errorNumber: -1,
            message: error.message,
            data: null
        };
        return result;
    });
}
/**
 * 
 * @param id Get node by iD
 */
public nodeGeByIDAsync(id: string): Promise<IResultRestModel> {
    return this.db.collection("DATAREP").doc(id).get().
    then((dbresult) => {
        if(dbresult.exists) {
            let uno: IQNode = {
                id: dbresult.get('ID'),
                owner: dbresult.get('OWNER'),
                parent: dbresult.get('PARENT'),
                subtype: dbresult.get('SUBTYPE'),
                name: dbresult.get('NAME'),
                status: dbresult.get('STATUS'),
                category: dbresult.get('NUMBER'),
                createdOn: dbresult.get('CREATED'),
                modifiedOn: dbresult.get('MODIFIED'),
                extendedData: JSON.parse(dbresult.get('ED'))
            }
            let result: IResultRestModel  = { 
                result:'SUCESS',
                errorNumber: 0,
                message: '',
                data: uno
            };
            return result;
        } else {
        let result: IResultRestModel  = { 
            result:'SUCESS',
            errorNumber: 0,
            message: 'No data for given ID',
            data: null
        };
        return result;
        }
    }).catch((error)=>{
        let result: IResultRestModel  = { 
            result:'ERROR',
            errorNumber: -1,
            message: error.message,
            data: null
        };
        return result;
    });
}

public nodeGetChildren(parent: string) : Promise<IResultRestModel> {
    return this.db.collection("DATAREP").where("PARENT", "==", parent).get().
    then((dbresult) => {
          return this.re2Result(dbresult);
        }).catch((error)=>{
        let result: IResultRestModel  = { 
            result:'ERROR',
            errorNumber: -1,
            message: error.message,
            data: null
        };
        return result;
    });
}

public nodeGetChildrenOfType(parent: string, type: Number) : Promise<IResultRestModel> {
    return this.db.collection("DATAREP").where("PARENT", "==", parent).where("SUBTYPE", "==", type).get().
    then((dbresult) => {
          return this.re2Result(dbresult);
        }).catch((error)=>{
        let result: IResultRestModel  = { 
            result:'ERROR',
            errorNumber: -1,
            message: error.message,
            data: null
        };
        return result;
    });
}
public nodeGetAsync(query: INodeWhere[], order:string, limit: number, startAt: number) : Promise<IResultRestModel> {
    
    //let q:firebase.firestore.CollectionReference = this.db.collection("DATAREP");
    //query.forEach(wh => {
    //    q.where(wh.field, <firebase.firestore.WhereFilterOp>wh.operator, wh.val);
   // });
    //return this.db.collection("DATAREP").orderBy(order).limit(limit).startAt(startAt).get().
    return this.db.collection("DATAREP").get().
    then((dbresult) => {
        return this.re2Result(dbresult);
    }).catch((error)=>{
        let result: IResultRestModel  = { 
            result:'ERROR',
            errorNumber: -1,
            message: error.message,
            data: null
        };
        return result;
    });

}
public nodeGetByOwnerAndTypeAsync(owner: string, subtype: number): Promise<IResultRestModel> {
    return this.db.collection("DATAREP").where("OWNER", "==", owner).where("SUBTYPE", "==", subtype).get().
    then((dbresult) => { //QuerySnapshot
        return this.re2Result(dbresult);
    }).catch((error)=>{
        let result: IResultRestModel  = { 
            result:'ERROR',
            errorNumber: -1,
            message: error.message,
            data: null
        };
        return result;
    });
}
/**
 * Records to rest result
 * @param dbresult 
 */
private re2Result(dbresult: firebase.firestore.QuerySnapshot): IResultRestModel {
    if(!dbresult.empty) {
        if(dbresult.size === 1) { 
            let uno: IQNode = {
                id: dbresult.docs[0].id,
                owner: dbresult.docs[0].get('OWNER'),
                parent: dbresult.docs[0].get('PARENT'),
                subtype: dbresult.docs[0].get('SUBTYPE'),
                name: dbresult.docs[0].get('NAME'),
                status: dbresult.docs[0].get('STATUS'),
                category: dbresult.docs[0].get('NUMBER'),
                createdOn: dbresult.docs[0].get('CREATED'),
                modifiedOn: dbresult.docs[0].get('MODIFIED'),
                extendedData: JSON.parse(dbresult.docs[0].get('ED'))
            }
            let result: IResultRestModel  = { 
                result:'SUCESS',
                errorNumber: 0,
                message: '',
                data: uno
            };
            return result;
        } else {
            let nodi: IQNode[] = [];
            dbresult.forEach( (doc) => {
                let uno: IQNode = {
                    id: doc.id,
                    owner: doc.get('OWNER'),
                    parent: doc.get('PARENT'),
                    subtype: doc.get('SUBTYPE'),
                    name: doc.get('NAME'),
                    status: doc.get('STATUS'),
                    category: doc.get('NUMBER'),
                    createdOn: doc.get('CREATED'),
                    modifiedOn: doc.get('MODIFIED'),
                    extendedData: doc.get('ED')
                }
                nodi.push(uno);
            });
            let result: IResultRestModel  = { 
                result:'SUCESS',
                errorNumber: 0,
                message: '',
                data: nodi
            };
            return result;
        }
    } else {
        let result: IResultRestModel  = { 
            result:'SUCESS',
            errorNumber: 0,
            message: 'No data for given ID',
            data: null
        };
        return result;
    }
}

//private ds2Result(doc:)
private onSecurityChanged(event: IAuthChangedEvent): void {
    if(event.user === null ){
        this.canDo = false;
    } else if(event.user.isAnonymous === null){
        this.canDo = false;
    } else {
        this.canDo = true;
    }
    return;
  }

}