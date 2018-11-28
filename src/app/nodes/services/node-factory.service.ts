import { Injectable, Optional, Inject } from '@angular/core';
import { AppCtx }       from '../../app.context';
import { DAPI } from '../../services/dapi';
import { IQNode, IDataRep, Node }  from '../model';
import { Workspace } from '../nodetypes'

@Injectable()
export class NodeFactory {

    constructor(private _ctx: AppCtx, private _dapi:DAPI){

    }

public getNodeByType(subtype: number): Node {
    if(subtype === 1142) return new Workspace(this);
}

}